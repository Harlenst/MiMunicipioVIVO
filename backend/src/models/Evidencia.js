import { DataTypes } from "sequelize";
export default (db) => db.define("Evidencia", {
  id_evidencia: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_reporte: { type: DataTypes.INTEGER, allowNull: false },
  tipo: { type: DataTypes.STRING(20), allowNull: false },
  url_archivo: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.STRING(150), allowNull: true },
  fecha_subida: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: "evidencias", timestamps: false });
// tipos: imagen, video, documento