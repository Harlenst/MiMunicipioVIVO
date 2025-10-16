import express from "express";
import { verificarToken, esAdmin } from "../middleware/authJwt.js";
import { crearDependencia, listarDependencias } from "../controllers/dependenciasController.js";
const router = express.Router();

router.post("/", verificarToken, esAdmin, crearDependencia);
router.get("/", listarDependencias);

export default router;
// Sólo administradores pueden crear dependencias
// La lista de dependencias es pública
// Cada dependencia tiene nombre, descripción, contacto (email/teléfono)