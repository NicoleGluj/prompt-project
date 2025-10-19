import express from "express";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;
const JWT_SECRET = "supersecreto"; // 👉 cámbialo por una variable de entorno

// --- 🪵 Configuración del logger ---
const logsDir = path.join(process.cwd(), "logs");

// Crear carpeta logs si no existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Nombre del archivo con la fecha actual
const logFileName = `access-${new Date().toISOString().split("T")[0]}.log`;
const logFilePath = path.join(logsDir, logFileName);

// Crear stream de escritura en modo append
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Morgan -> registra todo en archivo y consola, excepto OPTIONS
app.use(
  morgan("common", {
    skip: (req) => req.method === "OPTIONS",
    stream: accessLogStream
  })
);

// También mostrar en consola
app.use(
  morgan("common", {
    skip: (req) => req.method === "OPTIONS"
  })
);

// --- Conexión MongoDB ---
const MONGO_URI = "mongodb://localhost:27017/tareasdb";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// --- Schemas & Modelos ---
const taskSchema = new mongoose.Schema({
  id: { type: String, default: () => randomUUID() },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// --- Middleware ---
app.use(express.json());
app.use(cors());

// Middleware para validar token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Token requerido");

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token inválido o expirado");
    req.user = user; // datos del token
    next();
  });
};

// --- 🩺 Endpoint de estado del sistema ---
app.get("/status", (req, res) => {
  const dbState = mongoose.connection.readyState;
  /*
    Estados de readyState:
    0 = disconnected
    1 = connected
    2 = connecting
    3 = disconnecting
  */

  if (dbState !== 1) {
    return res.status(503).json({
      status: "DOWN",
      message: "La base de datos no está conectada",
      dbStatus: dbState,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }

  res.status(200).json({
    status: "OK",
    message: "Sistema operativo y base de datos funcionando correctamente",
    dbStatus: dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// --- Rutas de autenticación ---
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Email y password requeridos");

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send("Usuario ya registrado");

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash });
    await newUser.save();

    res.status(201).send("Usuario registrado correctamente");
  } catch {
    res.status(500).send("Error en el registro");
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Credenciales inválidas");

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(400).send("Credenciales inválidas");

    const token = jwt.sign(
      { id: user._id, email: user.email, test: 1 },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch {
    res.status(500).send("Error en el login");
  }
});

// --- Rutas de Tareas (protegidas con authMiddleware) ---
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).send("Error al obtener tareas");
  }
});

app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).send("Datos inválidos");

    const newTask = new Task({ text });
    await newTask.save();

    res.status(201).json(newTask);
  } catch {
    res.status(400).send("Datos inválidos");
  }
});

app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTask = await Task.findOneAndUpdate({ id }, updates, {
      new: true,
    });

    if (!updatedTask) return res.status(404).send("Task no encontrada");
    res.status(200).json(updatedTask);
  } catch {
    res.status(400).send("Datos inválidos");
  }
});

app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({ id });

    if (!deleted) return res.status(404).send("Task no encontrada");
    res.status(200).json({ message: "Task eliminada" });
  } catch {
    res.status(500).send("Error al eliminar la task");
  }
});

// --- Default ---
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});