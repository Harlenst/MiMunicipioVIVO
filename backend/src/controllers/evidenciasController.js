import { Evidencia } from "../models/index.js";

export const subirEvidencia = async (req, res) => {
  try {
    const { id_reporte } = req.params;
    if (!req.file) return res.status(400).json({ message: "Archivo requerido" });
    const tipo = req.file.mimetype.startsWith("video") ? "video" : "foto";
    const url_archivo = `/uploads/${req.file.filename}`;
    const evidencia = await Evidencia.create({ id_reporte, tipo, url_archivo, descripcion: req.body.descripcion || null });
    res.json({ message: "Evidencia subida", evidencia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al subir evidencia" });
  }
};

export const listarEvidencias = async (req, res) => {
  const { id_reporte } = req.params;
  const items = await Evidencia.findAll({ where: { id_reporte } });
  res.json(items);
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo usuarios autenticados pueden subir evidencias
// La lista de evidencias es pública
// Tipos permitidos: imagen, video, documento
