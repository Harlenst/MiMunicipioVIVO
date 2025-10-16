import { DataTypes } from "sequelize";
export default (db) => db.define("Notificacion", {
  id_notificacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  id_reporte: { type: DataTypes.INTEGER, allowNull: true },
  tipo: { type: DataTypes.STRING(30), allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  fecha_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado_envio: { type: DataTypes.STRING(20), defaultValue: "pendiente" }
}, { tableName: "notificaciones", timestamps: false });
// tipos: nuevo_reporte, cambio_estado, comentario, asignacion
// estados: pendiente, enviado, fallido