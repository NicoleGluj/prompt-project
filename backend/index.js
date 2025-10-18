import http from "http";
import fs from "fs";
import { randomUUID } from "crypto";

const PORT = 3000;
const FILE = "./src/mock/tasks.json";

// Helper: leer tareas
const readTasks = () => {
  try {
    const data = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Helper: escribir tareas
const writeTasks = (tasks) => {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
};


// Crear servidor
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- GET /tasks ---
  if (req.url === "/tasks" && req.method === "GET") {
    const tasks = readTasks();
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(tasks));
    return;
  }

  // --- POST /tasks ---
  if (req.url === "/tasks" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { text } = JSON.parse(body);
        const newTask = {
          id: randomUUID(),
          text,
          completed: false,
          createdAt: new Date(),
        };

        const tasks = readTasks();
        tasks.push(newTask);
        writeTasks(tasks);

        res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(newTask));
      } catch {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Datos inválidos");
      }
    });
    return;
  }

  // --- PUT /tasks/:id (toggle o edición) ---
  if (req.url.startsWith("/tasks/") && req.method === "PUT") {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const updates = JSON.parse(body);
        let tasks = readTasks();
        const index = tasks.findIndex((t) => t.id === id);

        if (index === -1) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Task no encontrada");
          return;
        }

        tasks[index] = { ...tasks[index], ...updates };
        writeTasks(tasks);

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(tasks[index]));
      } catch {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Datos inválidos");
      }
    });
    return;
  }

  // --- DELETE /tasks/:id ---
  if (req.url.startsWith("/tasks/") && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    let tasks = readTasks();
    const newTasks = tasks.filter((t) => t.id !== id);

    if (newTasks.length === tasks.length) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Task no encontrada");
      return;
    }

    writeTasks(newTasks);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ message: "Task eliminada" }));
    return;
  }

  // --- Default ---
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Ruta no encontrada");
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});