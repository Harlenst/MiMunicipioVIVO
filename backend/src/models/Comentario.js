import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Comentario = sequelize.define("Comentario", {
    id_comentario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Comentario;
};
    // Relaciones se definen en src/models/index.js