import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Historial = sequelize.define("Historial", {
    id_historial: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Historial;
};
