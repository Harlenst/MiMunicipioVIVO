import { DataTypes } from "sequelize";

export default (db) => db.define("Grupo", {
  id_grupo: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  descripcion: { 
    type: DataTypes.TEXT 
  },
  id_usuario_creador: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "usuarios", key: "id_usuario" }
  },
  id_usuario_admin: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "usuarios", key: "id_usuario" },
    defaultValue: db.col('id_usuario_creador') // Admin inicial = creador
  },
  es_privado: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  codigo_invitacion: { 
    type: DataTypes.STRING(20), 
    unique: true 
  },
  fecha_creacion: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  activo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: "grupos", 
  timestamps: false,
  indexes: [
    { fields: ['nombre'] },
    { fields: ['codigo_invitacion'] },
    { fields: ['es_privado'] }
  ]
});