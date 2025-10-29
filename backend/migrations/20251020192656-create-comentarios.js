/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('comentarios', {
    id_comentario: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    id_reporte: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'reportes',
        key: 'id_reporte'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_usuario: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    comentario: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    tipo: {
      type: Sequelize.ENUM('texto', 'imagen', 'archivo', 'audio'),
      allowNull: false,
      defaultValue: 'texto'
    },
    nombre_archivo: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    archivo_url: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    reacciones: {
      type: Sequelize.JSONB,  // 👈 POSTGRESQL: JSONB mejor rendimiento
      allowNull: true,
      defaultValue: Sequelize.literal("'{}'")
    },
    mencionados: {
      type: Sequelize.JSONB,  // 👈 POSTGRESQL: JSONB
      allowNull: true,
      defaultValue: Sequelize.literal("'[]'")
    },
    es_editado: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {  // 👈 snake_case para PostgreSQL
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // 👈 POSTGRESQL: Triggers para updated_at
  await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_comentarios_updated_at 
    BEFORE UPDATE ON comentarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);

  // Índices PostgreSQL
  await queryInterface.addIndex('comentarios', ['id_reporte'], {
    name: 'idx_comentario_reporte',
    concurrently: true  // 👈 PostgreSQL: menos bloqueo
  });
  await queryInterface.addIndex('comentarios', ['id_usuario'], {
    name: 'idx_comentario_usuario',
    concurrently: true
  });
  await queryInterface.addIndex('comentarios', ['created_at'], {
    name: 'idx_comentario_fecha',
    concurrently: true
  });
}

export async function down(queryInterface, Sequelize) {
  // Eliminar trigger primero
  await queryInterface.sequelize.query(`
    DROP TRIGGER IF EXISTS update_comentarios_updated_at ON comentarios;
    DROP FUNCTION IF EXISTS update_updated_at_column();
  `);
  
  await queryInterface.dropTable('comentarios');
}