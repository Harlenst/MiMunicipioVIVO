import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Crear la instancia de conexión
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // para no llenar la consola
  }
);

// Función para conectar
export const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
};
