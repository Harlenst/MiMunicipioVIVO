import express from "express";
import { 
  actualizarPerfil, 
    actualizarContrasena,
    actualizarPersonalizacion,
    actualizarNotificaciones,
    obtenerConfiguracionUsuario
} from "../controllers/configuracionController.js";
import { verificarToken } from "../middlewares/authJwt.js";

const router = express.Router();

/**
 * ✅ Rutas de configuración (todas protegidas por JWT)
 */
router.get("/:id_usuario", verificarToken, obtenerConfiguracionUsuario);
router.put("/:id_usuario/general", verificarToken, actualizarPerfil);
router.put("/:id_usuario/password", verificarToken, actualizarContrasena);
router.put("/:id_usuario/personalizacion", verificarToken, actualizarPersonalizacion);
router.put("/:id_usuario/notificaciones", verificarToken, actualizarNotificaciones);

export default router;
