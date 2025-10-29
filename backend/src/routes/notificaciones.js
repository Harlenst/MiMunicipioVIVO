import express from "express";
import {
  enviarNotificacion,
  listarNotificaciones,
  notificarATodos,
} from "../controllers/notificacionesController.js";
import { verificarToken, esAdmin } from "../middleware/authJwt.js";

const router = express.Router();

/* =======================================================
   ✉️ POST /api/notificaciones/enviar
   Envía una notificación a un usuario específico
   - Requiere token válido
   - Sólo admins o funcionarios pueden usarlo
   ======================================================= */
router.post("/enviar", verificarToken, esAdmin, enviarNotificacion);

/* =======================================================
   📩 GET /api/notificaciones
   Lista las notificaciones del usuario autenticado
   ======================================================= */
router.get("/", verificarToken, listarNotificaciones);

/* =======================================================
   🚀 POST /api/notificaciones/todos
   Envía una notificación masiva a todos los usuarios
   - Solo para administradores
   ======================================================= */
router.post("/todos", verificarToken, esAdmin, notificarATodos);

export default router;
