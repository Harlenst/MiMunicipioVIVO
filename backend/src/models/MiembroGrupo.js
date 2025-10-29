import { DataTypes } from "sequelize";

export default (db) => db.define("MiembroGrupo", {
  id_miembro_grupo: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  id_grupo: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "grupos", key: "id_grupo" }
  },
  id_usuario: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "usuarios", key: "id_usuario" }
  },
  fecha_union: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  rol: { 
    type: DataTypes.ENUM('miembro', 'admin', 'creador'),
    defaultValue: 'miembro'
  },
  activo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: "miembros_grupos",
  timestamps: false,
  indexes: [
    { 
      unique: true, 
      fields: ['id_grupo', 'id_usuario'] 
    },
    { fields: ['id_grupo'] },
    { fields: ['id_usuario'] },
    { fields: ['rol'] }
  ]
});