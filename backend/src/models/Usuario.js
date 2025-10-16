import { DataTypes } from "sequelize";

export default (db) =>
  db.define(
    "Usuario",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cedula: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: true, // Asegura que sea numérica
          len: [8, 20], // Longitud mínima/máxima típica para cédulas
        },
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [3, 100], // Nombre no vacío
        },
      },
      correo: {
        type: DataTypes.STRING(150),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true, // Valida formato de email
        },
      },
      contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [8, 255], // Contraseña mínima de 8 chars (antes de hash)
        },
      },
      municipio: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      tiempo_residencia: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "ciudadano",
      },
      fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      estado: {
        type: DataTypes.STRING(20),
        defaultValue: "activo",
      },
      verified: { // Nuevo campo para verificación
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { tableName: "usuarios", timestamps: false }
  );