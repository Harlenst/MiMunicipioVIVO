import express from "express";
import multer from "multer";
import path from "path";
import {
  crearReporte,
  listarReportes,
  obtenerReportePorId,
  obtenerReportesPorUsuario, 
  actualizarReporte,
  eliminarReporte
  // 👈 nuevo import
} from "../controllers/reportesController.js";
import { verificarToken } from "../middleware/authJwt.js";

const router = express.Router();

// =========================
// ⚙️ Configuración de multer
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 📁 carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // límite: 10 MB
});

// =========================
// 📦 Rutas principales
// =========================

// 📍 Obtener los reportes con nivel "Alto"
router.get("/prioritarios/listado", async (req, res) => {
  try {
    const { Reporte } = await import("../models/index.js");

    const reportes = await Reporte.findAll({
      where: { nivel: "Alto" },
      order: [["fecha_creacion", "DESC"]],
      limit: 5,
    });

    return res.json({
      ok: true,
      message: "Reportes prioritarios obtenidos correctamente",
      data: reportes,
    });
  } catch (error) {
    console.error("❌ Error al obtener reportes prioritarios:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener reportes prioritarios",
      error: error.message,
    });
  }
});

// 👤 NUEVO: Obtener reportes por ID de usuario (para ChatCiudadano)
router.get("/usuario/:id_usuario", obtenerReportesPorUsuario);

// 📤 Crear un nuevo reporte (con archivos y token)
router.post("/", verificarToken, upload.array("archivos", 5), crearReporte);
// 🗑️ Eliminar un reporte por ID (requiere token )
router.delete("/:id", verificarToken, eliminarReporte);
// 📋 Listar todos los reportes
router.get("/", listarReportes);
router.put("/:id", verificarToken, actualizarReporte); // ✅ corregido
// 🔍 Obtener un reporte por ID (requiere token)
router.get("/:id", verificarToken, obtenerReportePorId);


export default router;
