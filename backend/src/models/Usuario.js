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
      tipo_sociedad: DataTypes.STRING(50),
      tipo_entidad: DataTypes.STRING(50),
      tipo_identificacion: DataTypes.STRING(30),
      numero_identificacion: {
        type: DataTypes.STRING(30),
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      genero: DataTypes.STRING(30),
      correo: {
        type: DataTypes.STRING(150),
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      direccion: DataTypes.STRING(200),
      barrio: DataTypes.STRING(100),
      telefono1: DataTypes.STRING(20),
      telefono2: DataTypes.STRING(20),
      pais: DataTypes.STRING(100),
      departamento: DataTypes.STRING(100),
      ciudad: DataTypes.STRING(100),
      contrasena: DataTypes.STRING(255),
      rol: {
        type: DataTypes.STRING(20),
        defaultValue: "ciudadano",
      },
      estado: {
        type: DataTypes.STRING(20),
        defaultValue: "activo",
      },
      fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // ======================
      // 🎨 PERSONALIZACIÓN
      // ======================
      tema: {
        type: DataTypes.STRING(20),
        defaultValue: "claro",
      },
      color: {
        type: DataTypes.STRING(20),
        defaultValue: "#2563eb",
      },
      fuente: {
        type: DataTypes.STRING(40),
        defaultValue: "Inter",
      },

      // ======================
      // 🔔 NOTIFICACIONES
      // ======================
      notif_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      notif_push: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notif_whatsapp: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notif_resumen: {
        type: DataTypes.STRING(20),
        defaultValue: "semanal",
      },
    },
    {
      tableName: "usuarios",
      timestamps: false,
    }
  );
