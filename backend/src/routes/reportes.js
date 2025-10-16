import express from "express";
import { verificarToken, esAdmin } from "../middleware/authJwt.js";
import { crearReporte, listarReportes, obtenerReporte, actualizarEstado, asignarReporte } from "../controllers/reportesController.js";
const router = express.Router();

router.post("/", verificarToken, crearReporte);
router.get("/", listarReportes); // público: lista de reportes
router.get("/:id", obtenerReporte);
router.put("/:id/estado", verificarToken, actualizarEstado);
router.post("/:id/asignar", verificarToken, esAdmin, asignarReporte);

export default router;
// Sólo usuarios autenticados pueden crear reportes y actualizar estados
// Sólo administradores pueden asignar reportes a dependencias
// La lista de reportes es pública, pero detalles como comentarios internos pueden estar restringidos