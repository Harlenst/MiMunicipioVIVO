import express from "express";
import { verificarToken } from "../middleware/authJwt.js";
import { enviarNotificacion, listarNotificaciones } from "../controllers/notificacionesController.js";
const router = express.Router();

router.post("/enviar", verificarToken, enviarNotificacion);
router.get("/", verificarToken, listarNotificaciones);

export default router;
// Sólo usuarios autenticados pueden enviar y ver notificaciones
// Los administradores pueden enviar notificaciones a todos los usuarios
// Los usuarios pueden ver sólo sus propias notificaciones