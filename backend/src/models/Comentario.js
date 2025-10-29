import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Comentario = sequelize.define(
    "Comentario",
    {
      id_comentario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "id_comentario"
      },
      id_reporte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_reporte",
        references: {
          model: "reportes",
          key: "id_reporte"
        }
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_usuario",
        references: {
          model: "usuarios",
          key: "id_usuario"
        }
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "comentario"
      },
      tipo: {
        type: DataTypes.ENUM("texto", "imagen", "archivo", "audio"),
        defaultValue: "texto",
        allowNull: false,
        field: "tipo"
      },
      nombre_archivo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "nombre_archivo"
      },
      archivo_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "archivo_url"
      },
      reacciones: {
        type: DataTypes.JSONB,  // 👈 POSTGRESQL: JSONB
        defaultValue: {},
        allowNull: true,
        field: "reacciones"
      },
      mencionados: {
        type: DataTypes.JSONB,  // 👈 POSTGRESQL: JSONB
        defaultValue: [],
        allowNull: true,
        field: "mencionados"
      },
      es_editado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "es_editado"
      }
    },
    {
      tableName: "comentarios",
      timestamps: true,
      createdAt: "created_at",   // 👈 snake_case
      updatedAt: "updated_at",   // 👈 snake_case
      underscored: true,         // 👈 PostgreSQL naming
      indexes: [
        {
          name: "idx_comentario_reporte",
          fields: ["id_reporte"]
        },
        {
          name: "idx_comentario_usuario",
          fields: ["id_usuario"]
        },
        {
          name: "idx_comentario_fecha",
          fields: ["created_at"]
        }
      ]
    }
  );

  Comentario.associate = (models) => {
    Comentario.belongsTo(models.Reporte, { foreignKey: "id_reporte", as: "Reporte" });
    Comentario.belongsTo(models.Usuario, { foreignKey: "id_usuario", as: "Usuario" });
    models.Usuario.hasMany(Comentario, { foreignKey: "id_usuario", as: "Comentarios" });
    models.Reporte.hasMany(Comentario, { foreignKey: "id_reporte", as: "Comentarios" });
  };

  return Comentario;
};