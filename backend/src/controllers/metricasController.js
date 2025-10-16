import { MetricaReporte } from "../models/index.js";

export const listarMetricas = async (req, res) => {
  try {
    const { id_reporte } = req.params;
    const metricas = await MetricaReporte.findAll({ where: { id_reporte } });
    res.json(metricas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener métricas" });
  }
};
