import { Reporte } from "../models/index.js";
import * as turf from "@turf/turf";
import { success, failure } from "../utils/response.js";

/**
 * 📌 Buscar reportes cercanos a una ubicación
 */
export const buscarCercanos = async (req, res) => {
  try {
    const { lat, lng, radio = 1 } = req.query; // radio en km

    if (!lat || !lng)
      return failure(res, "Debes enviar latitud y longitud", 400);

    // Obtener todos los reportes con coordenadas válidas
    const reportes = await Reporte.findAll({
      where: { ubicacion_lat: { not: null }, ubicacion_lng: { not: null } },
    });

    const centro = turf.point([parseFloat(lng), parseFloat(lat)]);
    const radioKm = parseFloat(radio);

    // Filtrar por radio
    const reportesCercanos = reportes.filter((r) => {
      const punto = turf.point([parseFloat(r.ubicacion_lng), parseFloat(r.ubicacion_lat)]);
      const distancia = turf.distance(centro, punto, { units: "kilometers" });
      return distancia <= radioKm;
    });

    return success(res, `Reportes en un radio de ${radioKm} km`, reportesCercanos);
  } catch (error) {
    return failure(res, "Error al buscar reportes cercanos", 500, error.message);
  }
};

/**
 * 📏 Calcular la distancia entre dos puntos
 */
export const calcularDistancia = (req, res) => {
  try {
    const { lat1, lng1, lat2, lng2 } = req.query;

    if (!lat1 || !lng1 || !lat2 || !lng2)
      return failure(res, "Faltan coordenadas", 400);

    const puntoA = turf.point([parseFloat(lng1), parseFloat(lat1)]);
    const puntoB = turf.point([parseFloat(lng2), parseFloat(lat2)]);
    const distancia = turf.distance(puntoA, puntoB, { units: "kilometers" });

    return success(res, "Distancia calculada correctamente", { distancia_km: distancia });
  } catch (error) {
    return failure(res, "Error al calcular distancia", 500, error.message);
  }
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo usuarios autenticados pueden buscar reportes cercanos
// La función de distancia es pública
// Limitar la tasa de solicitudes para evitar abuso