import express from "express";
import { verificarToken } from "../middleware/authJwt.js";
import { 
  listarGruposUsuario, 
  crearGrupo, 
  unirseGrupoPorCodigo,
  obtenerMensajesGrupo, 
  enviarMensajeGrupo 
} from "../controllers/gruposController.js";

const router = express.Router();

router.get("/usuario/:id_usuario", verificarToken, listarGruposUsuario);
router.post("/", verificarToken, crearGrupo);
router.post("/unirse", verificarToken, unirseGrupoPorCodigo);
router.get("/mensajes/:id_grupo", verificarToken, obtenerMensajesGrupo);
router.post("/mensajes/:id_grupo", verificarToken, enviarMensajeGrupo);

export default router;