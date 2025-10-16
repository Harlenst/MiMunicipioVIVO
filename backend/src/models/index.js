import { sequelize } from "../config/db.js";
import UsuarioModel from "./Usuario.js";
import ReporteModel from "./Reporte.js";
import EvidenciaModel from "./Evidencia.js";
import VotoModel from "./Voto.js";
import DependenciaModel from "./Dependencia.js";
import AsignacionModel from "./Asignacion.js";
import NotificacionModel from "./Notificacion.js";
import MetricaReporteModel from "./MetricaReporte.js";
import ComentarioModel from "./Comentario.js";
import HistorialModel from "./Historial.js";

// ✅ Primero definimos la constante db correctamente
const db = sequelize;

// ✅ Inicializamos todos los modelos con la conexión
export const Usuario = UsuarioModel(db);
export const Reporte = ReporteModel(db);
export const Evidencia = EvidenciaModel(db);
export const Voto = VotoModel(db);
export const Dependencia = DependenciaModel(db);
export const Asignacion = AsignacionModel(db);
export const Notificacion = NotificacionModel(db);
export const MetricaReporte = MetricaReporteModel(db);
export const Comentario = ComentarioModel(db);
export const Historial = HistorialModel(db);

// ✅ Relaciones entre tablas

// Usuarios y reportes
Usuario.hasMany(Reporte, { foreignKey: "id_usuario" });
Reporte.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Reportes y evidencias
Reporte.hasMany(Evidencia, { foreignKey: "id_reporte" });
Evidencia.belongsTo(Reporte, { foreignKey: "id_reporte" });

// Votos
Reporte.hasMany(Voto, { foreignKey: "id_reporte" });
Voto.belongsTo(Reporte, { foreignKey: "id_reporte" });
Usuario.hasMany(Voto, { foreignKey: "id_usuario" });
Voto.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Dependencias y asignaciones
Dependencia.hasMany(Asignacion, { foreignKey: "id_dependencia" });
Asignacion.belongsTo(Dependencia, { foreignKey: "id_dependencia" });
Reporte.hasMany(Asignacion, { foreignKey: "id_reporte" });
Asignacion.belongsTo(Reporte, { foreignKey: "id_reporte" });

// Notificaciones
Usuario.hasMany(Notificacion, { foreignKey: "id_usuario" });
Notificacion.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Métricas
Reporte.hasMany(MetricaReporte, { foreignKey: "id_reporte" });
MetricaReporte.belongsTo(Reporte, { foreignKey: "id_reporte" });

// Comentarios
Comentario.belongsTo(Usuario, { foreignKey: "id_usuario" });
Comentario.belongsTo(Reporte, { foreignKey: "id_reporte" });
Reporte.hasMany(Comentario, { foreignKey: "id_reporte" });

// Historial
Historial.belongsTo(Usuario, { foreignKey: "id_usuario" });
Historial.belongsTo(Reporte, { foreignKey: "id_reporte" });
Reporte.hasMany(Historial, { foreignKey: "id_reporte" });

// ✅ Sincronización global
export const syncAll = async () => {
  await db.sync({ alter: true });
};

export { db };
