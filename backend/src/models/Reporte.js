import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Reporte = sequelize.define(
    "Reporte",
    {
      id_reporte: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nivel: {
        type: DataTypes.STRING,
        allowNull: true, // ahora puede estar vacío o nulo
        defaultValue: null, // ya no forzamos "Medio"
        comment: "Nivel de prioridad (Bajo, Medio, Alto)",
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      ubicacion_lat: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      ubicacion_lng: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      direccion: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      archivos: {
        type: DataTypes.JSON, // Guarda un array con nombres de archivos
        allowNull: true,
      },
      estado: {
        type: DataTypes.STRING(20),
        defaultValue: "Recibido",
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "reportes",
      timestamps: false,
    }
  );

  return Reporte;
};
