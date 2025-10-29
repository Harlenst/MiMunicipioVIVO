import express from "express";
import { verificarToken } from "../middleware/authJwt.js";
import { 
  listarComunidadesUsuario, 
  crearComunidad, 
  obtenerMensajesComunidad, 
  enviarMensajeComunidad 
} from "../controllers/comunidadesController.js";

const router = express.Router();

router.get("/usuario/:id_usuario", verificarToken, listarComunidadesUsuario);
router.post("/", verificarToken, crearComunidad);
router.get("/mensajes/:id_comunidad", verificarToken, obtenerMensajesComunidad);
router.post("/mensajes/:id_comunidad", verificarToken, enviarMensajeComunidad);

export default router;