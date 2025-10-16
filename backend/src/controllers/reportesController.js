import { Reporte, Asignacion, MetricaReporte } from "../models/index.js";

export const crearReporte = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, ubicacion_lat, ubicacion_lng, direccion } = req.body;
    const id_usuario = req.userId;
    const reporte = await Reporte.create({ id_usuario, titulo, descripcion, categoria, ubicacion_lat, ubicacion_lng, direccion });
    res.json({ message: "Reporte creado", reporte });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear reporte" });
  }
};

export const listarReportes = async (req, res) => {
  const { estado, categoria } = req.query;
  const where = {};
  if (estado) where.estado = estado;
  if (categoria) where.categoria = categoria;
  const reportes = await Reporte.findAll({ where, order: [["fecha_creacion", "DESC"]] });
  res.json(reportes);
};

export const obtenerReporte = async (req, res) => {
  const { id } = req.params;
  const reporte = await Reporte.findByPk(id);
  if (!reporte) return res.status(404).json({ message: "No existe" });
  res.json(reporte);
};

export const actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  await Reporte.update({ estado }, { where: { id_reporte: id } });
  if (estado.toLowerCase() === "resuelto") {
    // ejemplo: crear métrica de cierre (simplificado)
    await MetricaReporte.create({ id_reporte: id, fecha_cierre: new Date() });
  }
  res.json({ message: "Estado actualizado" });
};

export const asignarReporte = async (req, res) => {
  const { id } = req.params;
  const { id_dependencia, id_funcionario, prioridad, fecha_limite } = req.body;
  const asign = await Asignacion.create({ id_reporte: id, id_dependencia, id_funcionario, prioridad, fecha_limite });
  await Reporte.update({ estado: "En gestión" }, { where: { id_reporte: id } });
  res.json({ message: "Reporte asignado", asign });
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo administradores pueden asignar reportes
// Sólo usuarios autenticados pueden crear reportes y actualizar estados
// La lista de reportes es pública, pero detalles como comentarios internos pueden estar restringidos