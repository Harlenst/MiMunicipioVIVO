import { Voto } from "../models/index.js";

export const votarReporte = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { id_reporte } = req.params;
    // intenta crear; si duplica, atrapa error por índice único
    try {
      const voto = await Voto.create({ id_reporte, id_usuario });
      return res.json({ message: "Voto registrado", voto });
    } catch (err) {
      return res.status(400).json({ message: "Ya votaste este reporte" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error votando" });
  }
};

export const contarVotos = async (req, res) => {
  const { id_reporte } = req.params;
  const count = await Voto.count({ where: { id_reporte } });
  res.json({ id_reporte, votos: count });
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo usuarios autenticados pueden votar
// La cuenta de votos es pública
// Un usuario sólo puede votar una vez por reporte
// Voto es positivo (me gusta) o negativo (no me gusta)