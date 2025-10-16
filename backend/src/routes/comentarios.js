import express from "express";
import { verificarToken } from "../middleware/authJwt.js";
import {
  crearComentario,
  listarComentariosPorReporte,
} from "../controllers/comentariosController.js";

const router = express.Router();

router.post("/", verificarToken, crearComentario);
router.get("/:id_reporte", listarComentariosPorReporte);

export default router;
