import { DataTypes } from "sequelize";

export default (db) => db.define("Mensaje", {
  id_mensaje: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  id_comunidad: { 
    type: DataTypes.INTEGER, 
    references: { model: "comunidades", key: "id_comunidad" }
  },
  id_grupo: { 
    type: DataTypes.INTEGER, 
    references: { model: "grupos", key: "id_grupo" }
  },
  id_usuario: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: "usuarios", key: "id_usuario" }
  },
  mensaje: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  tipo: { 
    type: DataTypes.ENUM('texto', 'imagen', 'archivo', 'sistema'),
    defaultValue: 'texto'
  },
  mencionados: { 
    type: DataTypes.JSON, // Array de IDs de usuarios mencionados
    defaultValue: []
  },
  reacciones: { 
    type: DataTypes.JSON, // { "👍": 5, "❤️": 2 }
    defaultValue: {}
  },
  fecha_envio: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  // Validación: debe tener comunidad O grupo, pero no ambos
}, { 
  tableName: "mensajes", 
  timestamps: false,
  indexes: [
    { fields: ['id_comunidad'] },
    { fields: ['id_grupo'] },
    { fields: ['id_usuario'] },
    { fields: ['fecha_envio'] }
  ],
  validate: {
    eitherCommunityOrGroup() {
      if (!this.id_comunidad && !this.id_grupo) {
        throw new Error('Debe pertenecer a una comunidad o grupo');
      }
      if (this.id_comunidad && this.id_grupo) {
        throw new Error('No puede pertenecer a ambos');
      }
    }
  }
});