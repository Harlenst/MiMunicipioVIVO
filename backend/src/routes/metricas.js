import express from "express";
import { listarMetricas } from "../controllers/metricasController.js";

const router = express.Router();

router.get("/reportes/:id_reporte", listarMetricas);

export default router;
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo usuarios autenticados pueden ver métricas
// Los administradores pueden ver métricas de todos los reportes
// Los usuarios pueden ver métricas sólo de sus propios reportes
// Métricas incluyen: vistas, votos, comentarios, tiempo de resolución
// Métricas se actualizan en tiempo real o casi real