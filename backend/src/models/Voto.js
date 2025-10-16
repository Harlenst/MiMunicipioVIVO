import { DataTypes } from "sequelize";
export default (db) => db.define("Voto", {
  id_voto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_reporte: { type: DataTypes.INTEGER, allowNull: false },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  fecha_voto: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: "votos", timestamps: false, indexes: [{ unique: true, fields: ['id_reporte','id_usuario'] }]});
// Un usuario sólo puede votar una vez por reporte