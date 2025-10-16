import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import router from "./routes/index.js";
import { conectarDB } from "./config/db.js";
import { syncAll } from "./models/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Carpeta de archivos subidos
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

// Rutas principales
app.use("/api", router);

// Middleware global de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await conectarDB();
  await syncAll();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/api`);
});
