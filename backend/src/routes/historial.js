import express from "express";
import { verificarToken, esAdmin } from "../middleware/authJwt.js";
import { listarHistorial } from "../controllers/historialController.js";

const router = express.Router();
router.get("/", verificarToken, esAdmin, listarHistorial);

export default router;
