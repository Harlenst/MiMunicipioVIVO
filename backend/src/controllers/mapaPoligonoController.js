import * as turf from "@turf/turf";
import { Reporte } from "../models/index.js";
import { success, failure } from "../utils/response.js";

/**
 * 🔷 Buscar reportes dentro de un polígono
 */
export const buscarPorPoligono = async (req, res) => {
  try {
    const { poligono } = req.body; // arreglo de coordenadas [[lng, lat], [lng, lat], ...]
    if (!poligono || poligono.length < 3)
      return failure(res, "Polígono inválido", 400);

    const area = turf.polygon([poligono]);
    const reportes = await Reporte.findAll({
      where: { ubicacion_lat: { not: null }, ubicacion_lng: { not: null } },
    });

    const dentro = reportes.filter((r) => {
      const punto = turf.point([parseFloat(r.ubicacion_lng), parseFloat(r.ubicacion_lat)]);
      return turf.booleanPointInPolygon(punto, area);
    });

    return success(res, "Reportes dentro del área", dentro);
  } catch (error) {
    return failure(res, "Error al buscar por polígono", 500, error.message);
  }
};
