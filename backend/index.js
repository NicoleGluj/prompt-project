import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import dotenv from "dotenv"
import authRouter from "./src/routes/authRoutes.js";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import taskRouter from "./src/routes/tasksRoutes.js";
import connectDb from "./src/config/mongodb.js";

dotenv.config()
const { PORT, MONGO_URI, NODE_ENV } = process.env

const app = express()
app.use(express.json());
app.use(cors());

// CONFIGURACION LOGGER
const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFileName = `access-${new Date().toISOString().split("T")[0]}.log`;
const logFilePath = path.join(logsDir, logFileName);
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

// MORGAN
app.use(
  morgan("common", {
    skip: (req) => req.method === "OPTIONS",
    stream: accessLogStream
  })
);

app.use(
  morgan("common", {
    skip: (req) => req.method === "OPTIONS"
  })
);

// ESTADO DEL SISTEMA
app.get("/status", (req, res) => {
  const dbState = mongoose.connection.readyState;

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

// RUTAS AUTENTICACION
app.use("/auth", authRouter)
app.use("/tasks", authMiddleware, taskRouter)

// RUTA NO ENCONTRADA
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

// TEST
if (NODE_ENV !== "test") {
  // Iniciar servidor
  app.listen(PORT, () => {
    connectDb(MONGO_URI)
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app