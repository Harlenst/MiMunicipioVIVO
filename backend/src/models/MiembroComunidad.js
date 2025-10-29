import { DataTypes } from "sequelize";

export default (db) => db.define("MiembroComunidad", {
  id_miembro_comunidad: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  id_comunidad: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "comunidades", key: "id_comunidad" }
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
  es_moderador: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  activo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: "miembros_comunidades",
  timestamps: false,
  indexes: [
    { 
      unique: true, 
      fields: ['id_comunidad', 'id_usuario'] 
    }, // Un usuario solo en una comunidad una vez
    { fields: ['id_comunidad'] },
    { fields: ['id_usuario'] }
  ]
});