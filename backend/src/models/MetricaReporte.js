import { DataTypes } from "sequelize";
export default (db) => db.define("MetricaReporte", {
  id_metrica: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_reporte: { type: DataTypes.INTEGER, allowNull: false },
  tiempo_respuesta: { type: DataTypes.INTEGER, allowNull: true }, // horas
  cantidad_votos: { type: DataTypes.INTEGER, allowNull: true },
  fecha_cierre: { type: DataTypes.DATE, allowNull: true }
}, { tableName: "metricas_reportes", timestamps: false });
// tiempo_respuesta en horas desde "Recibido" hasta "Resuelto" o "Rechazado"
// cantidad_votos es el total de votos recibidos por el reporte
// fecha_cierre es la fecha cuando el reporte fue marcado como "Resuelto" o "Rechazado"