import express from "express";
import {
  obtenerMensajesReporte,
  enviarMensajeReporte,
  enviarArchivoReporte,
  eliminarMensaje,
  reaccionarMensaje,
  contarMensajesNoLeidos,
  comentarioUpload
} from "../controllers/comentariosController.js";
import { verificarToken } from "../middleware/authJwt.js";

const router = express.Router();

// =========================
// 💬 RUTAS PRINCIPALES DE MENSAJES
// =========================

// 📨 Obtener mensajes de un reporte
router.get("/reportes/:id_reporte/mensajes", verificarToken, obtenerMensajesReporte);

// 📤 Enviar mensaje de texto
router.post("/reportes/:id_reporte/mensajes", verificarToken, enviarMensajeReporte);

// 🖼️ Enviar archivo/imagen
router.post("/reportes/:id_reporte/archivos", verificarToken, comentarioUpload.single("archivo"), enviarArchivoReporte);

// =========================
// ⚡ ACCIONES ADICIONALES
// =========================

// 🗑️ Eliminar mensaje
router.delete("/mensajes/:id_mensaje", verificarToken, eliminarMensaje);

// ❤️ Reaccionar a mensaje
router.post("/mensajes/:id_mensaje/reaccionar", verificarToken, reaccionarMensaje);

// 📊 Contar mensajes no leídos
router.get("/reportes/:id_reporte/no-leidos", verificarToken, contarMensajesNoLeidos);

export default router;