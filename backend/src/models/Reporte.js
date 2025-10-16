import { DataTypes } from "sequelize";
export default (db) => db.define("Reporte", {
  id_reporte: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  categoria: { type: DataTypes.STRING(50), allowNull: false },
  ubicacion_lat: { type: DataTypes.DECIMAL(9,6), allowNull: true },
  ubicacion_lng: { type: DataTypes.DECIMAL(9,6), allowNull: true },
  direccion: { type: DataTypes.STRING(200), allowNull: true },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado: { type: DataTypes.STRING(20), defaultValue: "Recibido" }
}, { tableName: "reportes", timestamps: false });
// estados: Recibido, En Proceso, Resuelto, Rechazado