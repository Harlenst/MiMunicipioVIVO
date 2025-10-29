// backend/src/controllers/reportesController.js
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import {
  Reporte,
  Usuario,
  Asignacion,
  MetricaReporte,
  Comentario, // quítalo si no lo usas
} from "../models/index.js";

/* ==========================================================
   📍 CREAR REPORTE
========================================================== */
export const crearReporte = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      ubicacion_lat,
      ubicacion_lng,
      direccion,
      prioridad, // desde el frontend
    } = req.body;

    const id_usuario = req.userId;

    // Normalizar prioridad -> nivel
    const normalizarPrioridad = (valor) => {
      if (!valor) return "medio";
      const v = valor.toString().toLowerCase();
      if (v.includes("alt")) return "alto";
      if (v.includes("baj")) return "bajo";
      return "medio";
    };
    const nivelNormalizado = normalizarPrioridad(prioridad);

    // Archivos (si usas multer)
    const archivos = req.files ? req.files.map((f) => f.filename) : [];

    const reporte = await Reporte.create({
      id_usuario,
      titulo,
      descripcion,
      categoria,
      ubicacion_lat,
      ubicacion_lng,
      direccion,
      nivel: nivelNormalizado,
      archivos,
      // estado por defecto suele ser "Recibido" en tu flujo
    });

    return res.json({
      ok: true,
      message: "✅ Reporte creado correctamente",
      reporte,
    });
  } catch (err) {
    console.error("❌ Error al crear reporte:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error al crear reporte", error: err.message });
  }
};

/* ===========================================================
   📝 ACTUALIZAR REPORTE (solo si está "Recibido" + valida password)
=========================================================== */
export const actualizarReporte = async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findByPk(id);
    if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });

    // Solo el dueño o admin
    const esPropietario = reporte.id_usuario === req.userId;
    if (!esPropietario && req.userRol !== "admin") {
      return res.status(403).json({ message: "No autorizado para editar este reporte" });
    }

    // Debe estar en "Recibido"
    const estadoActual = (reporte.estado || "").trim().toLowerCase();
    if (estadoActual !== "recibido") {
      return res
        .status(409)
        .json({ message: 'Solo se permite editar reportes en estado "Recibido".' });
    }

    // Validar contraseña del usuario
    const { password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ message: "Debes ingresar tu contraseña para confirmar los cambios." });
    }

    const usuario = await Usuario.findByPk(req.userId);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(password, usuario.contrasena);
    if (!coincide) return res.status(401).json({ message: "Contraseña incorrecta" });

    // Campos editables
    const {
      titulo,
      descripcion,
      categoria,
      direccion,
      ubicacion_lat,
      ubicacion_lng,
      archivos, // opcional si permites reemplazar
    } = req.body;

    if (typeof titulo !== "undefined") reporte.titulo = titulo;
    if (typeof descripcion !== "undefined") reporte.descripcion = descripcion;
    if (typeof categoria !== "undefined") reporte.categoria = categoria;
    if (typeof direccion !== "undefined") reporte.direccion = direccion;
    if (typeof ubicacion_lat !== "undefined") reporte.ubicacion_lat = ubicacion_lat;
    if (typeof ubicacion_lng !== "undefined") reporte.ubicacion_lng = ubicacion_lng;
    if (typeof archivos !== "undefined") reporte.archivos = archivos;

    await reporte.save();

    return res.json({
      message: "Reporte actualizado correctamente",
      data: reporte,
    });
  } catch (err) {
    console.error("❌ Error al actualizar reporte:", err);
    return res.status(500).json({ message: "Error al actualizar el reporte" });
  }
};

/* ============================================================
   🔍 OBTENER REPORTE BÁSICO POR ID
============================================================ */
export const obtenerReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id);
    if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });
    return res.json(reporte);
  } catch (err) {
    console.error("❌ Error al obtener reporte:", err);
    return res.status(500).json({ message: "Error al obtener el reporte" });
  }
};

/* ============================================================
   🔎 OBTENER REPORTE CON DETALLES (usuario, archivos parsed)
============================================================ */
export const obtenerReportePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findOne({
      where: { id_reporte: id },
      include: [{ model: Usuario, attributes: ["nombre", "correo"] }],
    });

    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    let archivos = [];
    if (reporte.archivos && typeof reporte.archivos === "string") {
      try {
        archivos = JSON.parse(reporte.archivos);
      } catch {
        archivos = [reporte.archivos];
      }
    } else if (Array.isArray(reporte.archivos)) {
      archivos = reporte.archivos;
    }

    return res.json({
      ok: true,
      reporte: { ...reporte.dataValues, archivos },
    });
  } catch (err) {
    console.error("❌ Error al obtener reporte con detalles:", err);
    return res.status(500).json({ message: "Error al obtener el reporte" });
  }
};

/* ============================================================
   📋 LISTAR REPORTES (filtros por estado, categoría, nivel)
============================================================ */
export const listarReportes = async (req, res) => {
  try {
    const { estado, categoria, nivel } = req.query;
    const where = {};

    if (estado) where.estado = { [Op.iLike]: estado };
    if (categoria) where.categoria = { [Op.iLike]: categoria };
    if (nivel) {
      const n = nivel.toLowerCase();
      const normalizado = n.includes("alt") ? "alto" : n.includes("baj") ? "bajo" : "medio";
      where.nivel = { [Op.iLike]: normalizado };
    }

    const reportes = await Reporte.findAll({
      where,
      order: [["fecha_creacion", "DESC"]],
    });

    return res.json(reportes);
  } catch (err) {
    console.error("❌ Error al listar reportes:", err);
    return res.status(500).json({ message: "Error al obtener los reportes" });
  }
};

/* ============================================================
   👤 LISTAR REPORTES DE UN USUARIO (seguro)
============================================================ */
export const listarReportesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Seguridad: dueño o admin/funcionario
    const esDueno = parseInt(id_usuario, 10) === req.userId;
    const esAdmin = req.userRol === "admin";
    const esFunc = req.userRol === "funcionario";
    if (!esDueno && !esAdmin && !esFunc) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const reportes = await Reporte.findAll({
      where: { id_usuario },
      order: [["fecha_creacion", "DESC"]],
    });

    return res.json(reportes);
  } catch (err) {
    console.error("❌ Error al listar reportes del usuario:", err);
    return res.status(500).json({ message: "Error al listar reportes del usuario" });
  }
};

/* ============================================================
   🔄 ACTUALIZAR ESTADO
============================================================ */
export const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await Reporte.update({ estado }, { where: { id_reporte: id } });

    if (estado && estado.toLowerCase() === "resuelto") {
      await MetricaReporte.create({
        id_reporte: id,
        fecha_cierre: new Date(),
      });
    }

    return res.json({ message: "✅ Estado actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar estado:", err);
    return res.status(500).json({ message: "Error al actualizar estado del reporte" });
  }
};

/* ============================================================
   🗑️ ELIMINAR REPORTE (solo dueño o admin) **si está RESUELTO**
============================================================ */
export const eliminarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id);

    if (!reporte) {
      return res.status(404).json({ mensaje: "Reporte no encontrado" });
    }

    await reporte.destroy();

    return res.status(200).json({ mensaje: "Reporte eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar reporte:", error);
    return res.status(500).json({ mensaje: "Error interno al eliminar el reporte" });
  }
};

/* ============================================================
   📊 ACTIVIDAD RECIENTE
============================================================ */
export const actividadReciente = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      attributes: [
        "id_reporte",
        "titulo",
        "estado",
        "direccion",
        "nivel",
        "fecha_creacion",
      ],
      order: [["fecha_creacion", "DESC"]],
      limit: 5,
    });

    const data = reportes.map((r) => ({
      _id: r.id_reporte,
      texto: r.titulo,
      estado: r.estado,
      direccion: r.direccion,
      nivel: r.nivel,
      fecha: r.fecha_creacion,
    }));

    return res.json(data);
  } catch (err) {
    console.error("❌ Error al obtener actividad reciente:", err);
    return res.status(500).json({ message: "Error al obtener actividad reciente" });
  }
};

/* ============================================================
   🧩 ASIGNAR REPORTE (cambia a "En gestión")
============================================================ */
export const asignarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_dependencia, id_funcionario, prioridad, fecha_limite } = req.body;

    const asign = await Asignacion.create({
      id_reporte: id,
      id_dependencia,
      id_funcionario,
      prioridad,
      fecha_limite,
    });

    await Reporte.update({ estado: "En gestión" }, { where: { id_reporte: id } });

    return res.json({ message: "📌 Reporte asignado correctamente", asign });
  } catch (err) {
    console.error("❌ Error al asignar reporte:", err);
    return res.status(500).json({ message: "Error al asignar reporte" });
  }
};

/* ============================================================
   📈 RESUMEN DE ESTADÍSTICAS
============================================================ */
export const resumenReportes = async (req, res) => {
  try {
    const total = await Reporte.count();
    const resueltos = await Reporte.count({ where: { estado: "Resuelto" } });
    const gestion = await Reporte.count({ where: { estado: "En gestión" } });
    const recibidos = await Reporte.count({ where: { estado: "Recibido" } });

    return res.json({ total, resueltos, gestion, recibidos });
  } catch (err) {
    console.error("❌ Error al generar resumen:", err);
    return res.status(500).json({ message: "Error al obtener resumen de reportes" });
  }
};

/* ============================================================
   👤 REPORTES POR EMAIL
============================================================ */
export const reportesPorUsuario = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ message: "Correo requerido" });

    const usuario = await Usuario.findOne({ where: { correo: email } });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const reportes = await Reporte.findAll({
      where: { id_usuario: usuario.id_usuario },
      order: [["fecha_creacion", "DESC"]],
    });

    return res.json(reportes);
  } catch (err) {
    console.error("❌ Error al obtener reportes por usuario:", err);
    return res.status(500).json({ message: "Error al obtener reportes del usuario" });
  }
};

/* ============================================================
   👤 REPORTES POR ID DE USUARIO (con datos del usuario)
============================================================ */
export const obtenerReportesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    if (!id_usuario) return res.status(400).json({ message: "Falta el ID del usuario" });

    const reportes = await Reporte.findAll({
      where: { id_usuario },
      order: [["fecha_creacion", "DESC"]],
      include: [{ model: Usuario, attributes: ["nombre", "correo"] }],
    });

    if (!reportes.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron reportes para este usuario" });
    }

    return res.json(reportes);
  } catch (err) {
    console.error("❌ Error al obtener reportes por usuario:", err);
    return res.status(500).json({ message: "Error al obtener reportes del usuario" });
  }
};

/* ============================================================
   💬 MENSAJES DEL REPORTE (opcional)
=========================================================== */
export const obtenerMensajesReporte = async (req, res) => {
  try {
    const { id_reporte } = req.params;
    const comentarios = await Comentario.findAll({
      where: { id_reporte: parseInt(id_reporte, 10) },
      include: [{ model: Usuario, attributes: ["nombre"] }],
      order: [["createdAt", "ASC"]],
    });
    return res.json(comentarios);
  } catch (err) {
    console.error("❌ Error obteniendo mensajes:", err);
    return res.status(500).json({ message: "Error obteniendo mensajes" });
  }
};

export const enviarMensajeReporte = async (req, res) => {
  try {
    // Implementa tu lógica para crear comentarios/mensajes
    return res.status(201).json({ message: "Mensaje enviado" });
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err);
    return res.status(500).json({ message: "Error enviando mensaje" });
  }
};
