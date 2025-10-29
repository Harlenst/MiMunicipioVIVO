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
// 🆕 NUEVOS MODELOS
import ComunidadModel from "./Comunidad.js";
import MiembroComunidadModel from "./MiembroComunidad.js";
import GrupoModel from "./Grupo.js";
import MiembroGrupoModel from "./MiembroGrupo.js";
import MensajeModel from "./Mensaje.js";

// ✅ Inicializamos todos los modelos con la conexión
export const Usuario = UsuarioModel(sequelize);
export const Reporte = ReporteModel(sequelize);
export const Evidencia = EvidenciaModel(sequelize);
export const Voto = VotoModel(sequelize);
export const Dependencia = DependenciaModel(sequelize);
export const Asignacion = AsignacionModel(sequelize);
export const Notificacion = NotificacionModel(sequelize);
export const MetricaReporte = MetricaReporteModel(sequelize);
export const Comentario = ComentarioModel(sequelize);
export const Historial = HistorialModel(sequelize);
// 🆕 NUEVAS EXPORTACIONES
export const Comunidad = ComunidadModel(sequelize);
export const MiembroComunidad = MiembroComunidadModel(sequelize);
export const Grupo = GrupoModel(sequelize);
export const MiembroGrupo = MiembroGrupoModel(sequelize);
export const Mensaje = MensajeModel(sequelize);

// ✅ Relaciones EXISTENTES (mantener igual)
Usuario.hasMany(Reporte, { foreignKey: "id_usuario" });
Reporte.belongsTo(Usuario, { foreignKey: "id_usuario" });

Reporte.hasMany(Evidencia, { foreignKey: "id_reporte" });
Evidencia.belongsTo(Reporte, { foreignKey: "id_reporte" });

Reporte.hasMany(Voto, { foreignKey: "id_reporte" });
Voto.belongsTo(Reporte, { foreignKey: "id_reporte" });
Usuario.hasMany(Voto, { foreignKey: "id_usuario" });
Voto.belongsTo(Usuario, { foreignKey: "id_usuario" });

Dependencia.hasMany(Asignacion, { foreignKey: "id_dependencia" });
Asignacion.belongsTo(Dependencia, { foreignKey: "id_dependencia" });
Reporte.hasMany(Asignacion, { foreignKey: "id_reporte" });
Asignacion.belongsTo(Reporte, { foreignKey: "id_reporte" });

Usuario.hasMany(Notificacion, { foreignKey: "id_usuario" });
Notificacion.belongsTo(Usuario, { foreignKey: "id_usuario" });

Reporte.hasMany(MetricaReporte, { foreignKey: "id_reporte" });
MetricaReporte.belongsTo(Reporte, { foreignKey: "id_reporte" });

Comentario.belongsTo(Usuario, { foreignKey: "id_usuario" });
Comentario.belongsTo(Reporte, { foreignKey: "id_reporte" });
Reporte.hasMany(Comentario, { foreignKey: "id_reporte" });

Historial.belongsTo(Usuario, { foreignKey: "id_usuario" });
Historial.belongsTo(Reporte, { foreignKey: "id_reporte" });
Reporte.hasMany(Historial, { foreignKey: "id_reporte" });

// 🆕 NUEVAS RELACIONES - COMUNIDADES
// Comunidad ↔ MiembroComunidad
Comunidad.hasMany(MiembroComunidad, { foreignKey: "id_comunidad" });
MiembroComunidad.belongsTo(Comunidad, { foreignKey: "id_comunidad" });

// MiembroComunidad ↔ Usuario
MiembroComunidad.belongsTo(Usuario, { 
  foreignKey: "id_usuario", 
  as: "Usuario" 
});
Usuario.hasMany(MiembroComunidad, { 
  foreignKey: "id_usuario", 
  as: "MiembrosComunidades" 
});

// Comunidad ↔ Mensaje
Comunidad.hasMany(Mensaje, { foreignKey: "id_comunidad" });
Mensaje.belongsTo(Comunidad, { foreignKey: "id_comunidad" });

// Mensaje ↔ Usuario
Mensaje.belongsTo(Usuario, { 
  foreignKey: "id_usuario", 
  as: "Usuario" 
});
Usuario.hasMany(Mensaje, { 
  foreignKey: "id_usuario", 
  as: "Mensajes" 
});

// 🆕 NUEVAS RELACIONES - GRUPOS
// Grupo ↔ MiembroGrupo
Grupo.hasMany(MiembroGrupo, { foreignKey: "id_grupo" });
MiembroGrupo.belongsTo(Grupo, { foreignKey: "id_grupo" });

// MiembroGrupo ↔ Usuario
MiembroGrupo.belongsTo(Usuario, { 
  foreignKey: "id_usuario", 
  as: "Usuario" 
});
Usuario.hasMany(MiembroGrupo, { 
  foreignKey: "id_usuario", 
  as: "MiembrosGrupos" 
});

// Grupo ↔ Mensaje
Grupo.hasMany(Mensaje, { foreignKey: "id_grupo" });
Mensaje.belongsTo(Grupo, { foreignKey: "id_grupo" });

// Comunidad ↔ Usuario (creador)
Comunidad.belongsTo(Usuario, { 
  foreignKey: "id_usuario_creador", 
  as: "Creador" 
});
Usuario.hasMany(Comunidad, { 
  foreignKey: "id_usuario_creador", 
  as: "ComunidadesCreadas" 
});

// Grupo ↔ Usuario (creador y admin)
Grupo.belongsTo(Usuario, { 
  foreignKey: "id_usuario_creador", 
  as: "Creador" 
});
Grupo.belongsTo(Usuario, { 
  foreignKey: "id_usuario_admin", 
  as: "Admin" 
});
Usuario.hasMany(Grupo, { 
  foreignKey: "id_usuario_creador", 
  as: "GruposCreados" 
});
Usuario.hasMany(Grupo, { 
  foreignKey: "id_usuario_admin", 
  as: "GruposAdmin" 
});

// ✅ Sincronización global
export const syncAll = async () => {
  await sequelize.sync({ alter: true });
};

export { sequelize as db };

export default {
  db: sequelize,
  Usuario,
  Reporte,
  Evidencia,
  Voto,
  Dependencia,
  Asignacion,
  Notificacion,
  MetricaReporte,
  Comentario,
  Historial,
  // 🆕 NUEVAS EXPORTACIONES
  Comunidad,
  MiembroComunidad,
  Grupo,
  MiembroGrupo,
  Mensaje
};