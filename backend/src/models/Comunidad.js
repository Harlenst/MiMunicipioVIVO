import { DataTypes } from "sequelize";

export default (db) => db.define("Comunidad", {
  id_comunidad: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  descripcion: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    defaultValue: "Comunidad pública para discutir temas locales"
  },
  es_publica: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  id_usuario_creador: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "usuarios", key: "id_usuario" }
  },
  fecha_creacion: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  // Moderadores (JSON array de IDs)
  moderadores: { 
    type: DataTypes.JSON, 
    defaultValue: [] 
  },
  activo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: "comunidades", 
  timestamps: false,
  indexes: [
    { fields: ['nombre'] }, // Para búsqueda
    { fields: ['es_publica'] },
    { fields: ['activo'] }
  ]
});