import express from "express";
import { verificarToken } from "../middleware/authJwt.js";
import { votarReporte, contarVotos } from "../controllers/votosController.js";
const router = express.Router();

router.post("/:id_reporte", verificarToken, votarReporte);
router.get("/count/:id_reporte", contarVotos);

export default router;
// Sólo usuarios autenticados pueden votar
// La cuenta de votos es pública
// Un usuario sólo puede votar una vez por reporte
// Voto es positivo (me gusta) o negativo (no me gusta)