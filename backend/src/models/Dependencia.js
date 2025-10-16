import { DataTypes } from "sequelize";
export default (db) => db.define("Dependencia", {
  id_dependencia: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.STRING(200), allowNull: true },
  correo_contacto: { type: DataTypes.STRING(150), allowNull: true }
}, { tableName: "dependencias", timestamps: false });
// Ejemplos: Policía, Servicios Públicos, Salud, Educación