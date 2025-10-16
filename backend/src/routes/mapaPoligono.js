import express from "express";
import { verificarToken } from "../middleware/authJwt.js";
import { buscarPorPoligono } from "../controllers/mapaPoligonoController.js";

const router = express.Router();
router.post("/buscar", verificarToken, buscarPorPoligono);
export default router;
