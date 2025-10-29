import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import router from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import reportesRoutes from "./routes/reportes.js";
import notificacionesRoutes from "./routes/notificaciones.js";
import { conectarDB } from "./config/db.js";
import { syncAll } from "./models/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import usuariosRoutes from "./routes/usuarios.js";
import comentariosRoutes from "./routes/comentarios.js";



dotenv.config();
const app = express();

// ========================
// 🔧 MIDDLEWARES BÁSICOS
// ========================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// 📂 ARCHIVOS ESTÁTICOS
// ========================
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📁 Carpeta 'uploads' creada automáticamente");
}
app.use("/uploads", express.static(uploadsDir));

// ========================
// 🧩 RUTAS PRINCIPALES
// ========================

// 🔐 Autenticación (registro, login, recuperar contraseña)
app.use("/api/auth", authRoutes);

// 👤 Usuarios (perfil, actualización, etc.)
app.use("/api/usuarios", usuariosRoutes);

// 📊 Reportes protegidos
app.use("/api/reportes", reportesRoutes);

// ⚙️ Configuración de usuario

// 🔔 Notificaciones
app.use("/api/notificaciones", notificacionesRoutes);

// 🌍 Rutas adicionales (ciudades, dependencias, etc.)
app.use("/api", router);

// 🗨️ Comentarios
app.use("/api/comentarios", comentariosRoutes);

// 🚫 Middleware general para detectar errores de autenticación
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado",
    });
  }
  next(err);
});

// ========================
// ⚠️ MANEJO GLOBAL DE ERRORES
// ========================
app.use(errorHandler);

// ========================
// 🚀 INICIO DEL SERVIDOR
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await conectarDB(); // Conecta a la base de datos
    await syncAll(); // Sincroniza los modelos Sequelize
    console.log("✅ Base de datos conectada correctamente");
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}/api`);
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
  }
});
