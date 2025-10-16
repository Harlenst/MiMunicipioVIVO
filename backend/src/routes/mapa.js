import express from "express";
import { verificarToken } from "../middleware/authJwt.js";
import { buscarCercanos, calcularDistancia } from "../controllers/mapaController.js";

const router = express.Router();

router.get("/cercanos", verificarToken, buscarCercanos);
router.get("/distancia", calcularDistancia);

export default router;
