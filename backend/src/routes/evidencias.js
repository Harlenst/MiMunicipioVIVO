import express from "express";
import multer from "multer";
import path from "path";
import { verificarToken } from "../middleware/authJwt.js";
import { subirEvidencia, listarEvidencias } from "../controllers/evidenciasController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

router.post("/:id_reporte", verificarToken, upload.single("archivo"), subirEvidencia);
router.get("/:id_reporte", listarEvidencias);

export default router;
// Sólo usuarios autenticados pueden subir evidencias
// La lista de evidencias es pública
// Tipos permitidos: imagen, video, documento