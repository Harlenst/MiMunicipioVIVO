import { DataTypes } from "sequelize";
export default (db) => db.define("Asignacion", {
  id_asignacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_reporte: { type: DataTypes.INTEGER, allowNull: false },
  id_dependencia: { type: DataTypes.INTEGER, allowNull: false },
  id_funcionario: { type: DataTypes.INTEGER, allowNull: true },
  fecha_asignacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  prioridad: { type: DataTypes.STRING(20), defaultValue: "media" },
  fecha_limite: { type: DataTypes.DATE, allowNull: true }
}, { tableName: "asignaciones", timestamps: false });
// prioridades: baja, media, alta
// Un reporte puede ser asignado a múltiples dependencias
// Un funcionario es un usuario con rol 'moderador' o 'admin'