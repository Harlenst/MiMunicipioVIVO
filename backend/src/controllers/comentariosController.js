import { Op } from "sequelize";
import { Comentario, Usuario, Reporte } from "../models/index.js";
import { success, failure } from "../utils/response.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// =========================
// ⚙️ CONFIGURACIÓN MULTER PARA ARCHIVOS
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/comentarios/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mp3/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes, PDF, Word, audio y video"));
    }
  }
});

// =========================
// 📨 OBTENER MENSAJES DE UN REPORTE
// =========================
export const obtenerMensajesReporte = async (req, res) => {
  try {
    const { id_reporte } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Verificar que el reporte existe
    const reporte = await Reporte.findByPk(id_reporte);
    if (!reporte) {
      return failure(res, "Reporte no encontrado", 404);
    }

    // Obtener mensajes con paginación
    const { count, rows: mensajes } = await Comentario.findAndCountAll({
      where: { id_reporte: parseInt(id_reporte) },
      include: [
        { 
          model: Usuario, 
          as: "Usuario",
          attributes: ["id_usuario", "nombre", "correo", "rol"]
        },
        { 
          model: Reporte, 
          as: "Reporte",
          attributes: ["titulo", "estado", "nivel"]
        }
      ],
      order: [["createdAt", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Formatear mensajes para frontend
    const mensajesFormateados = mensajes.map(msg => ({
      id_mensaje: msg.id_comentario,
      id_usuario: msg.id_usuario,
      nombre: msg.Usuario?.nombre || "Usuario Anónimo",
      rol: msg.Usuario?.rol || "ciudadano",
      avatar: msg.Usuario?.avatar || null,
      mensaje: msg.comentario,
      tipo: msg.tipo,
      nombre_archivo: msg.nombre_archivo,
      archivo_url: msg.archivo_url ? `${process.env.BASE_URL || "http://localhost:5000"}/uploads/comentarios/${msg.archivo_url}` : null,
      fecha_envio: msg.createdAt,
      es_editado: msg.es_editado,
      reacciones: msg.reacciones || {},
      mencionados: msg.mencionados || [],
      respuestas_count: 0 // Para futuras implementaciones de respuestas
    }));

    return success(res, "Mensajes obtenidos correctamente", {
      mensajes: mensajesFormateados,
      paginacion: {
        total: count,
        pagina: parseInt(page),
        limite: parseInt(limit),
        total_paginas: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error("❌ Error obteniendo mensajes:", err);
    return failure(res, "Error obteniendo mensajes del reporte", 500, err.message);
  }
};

// =========================
// 📤 ENVIAR MENSAJE A REPORTE (TEXTO)
// =========================
export const enviarMensajeReporte = async (req, res) => {
  try {
    const { id_reporte } = req.params;
    const { mensaje, tipo = "texto", mencionados = [] } = req.body;
    const id_usuario = req.userId;

    if (!mensaje?.trim()) {
      return failure(res, "El mensaje no puede estar vacío", 400);
    }

    if (mensaje.length > 10000) {
      return failure(res, "El mensaje es demasiado largo (máx 10,000 caracteres)", 400);
    }

    // Verificar reporte
    const reporte = await Reporte.findByPk(id_reporte);
    if (!reporte) {
      return failure(res, "Reporte no encontrado", 404);
    }

    // Verificar usuario
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return failure(res, "Usuario no encontrado", 404);
    }

    // Crear mensaje
    const nuevoMensaje = await Comentario.create({
      id_reporte: parseInt(id_reporte),
      id_usuario,
      comentario: mensaje.trim(),
      tipo,
      mencionados,
      es_editado: false
    });

    // Obtener mensaje completo con relaciones
    const mensajeCompleto = await Comentario.findByPk(nuevoMensaje.id_comentario, {
      include: [
        { model: Usuario, as: "Usuario", attributes: ["id_usuario", "nombre", "rol", "avatar"] }
      ]
    });

    const mensajeFormateado = {
      id_mensaje: mensajeCompleto.id_comentario,
      id_usuario: mensajeCompleto.id_usuario,
      nombre: mensajeCompleto.Usuario?.nombre || "Usuario Anónimo",
      rol: mensajeCompleto.Usuario?.rol || "ciudadano",
      avatar: mensajeCompleto.Usuario?.avatar || null,
      mensaje: mensajeCompleto.comentario,
      tipo: mensajeCompleto.tipo,
      fecha_envio: mensajeCompleto.createdAt,
      es_editado: mensajeCompleto.es_editado,
      reacciones: mensajeCompleto.reacciones || {},
      mencionados: mensajeCompleto.mencionados || [],
      archivo_url: null
    };

    // Actualizar contador de mensajes no leídos (opcional)
    // await actualizarMensajesNoLeidos(id_reporte, id_usuario);

    return success(res, "Mensaje enviado correctamente", mensajeFormateado, 201);
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err);
    return failure(res, "Error enviando mensaje", 500, err.message);
  }
};

// =========================
// 🖼️ ENVIAR ARCHIVO/MEDIA
// =========================
export const enviarArchivoReporte = [
  upload.single("archivo"),
  async (req, res) => {
    try {
      const { id_reporte } = req.params;
      const { mensaje = "", tipo = "archivo" } = req.body;
      const id_usuario = req.userId;

      if (!req.file) {
        return failure(res, "No se recibió ningún archivo", 400);
      }

      // Determinar tipo basado en MIME
      const mimeType = req.file.mimetype;
      let tipoArchivo = tipo;
      
      if (mimeType.startsWith("image/")) tipoArchivo = "imagen";
      else if (mimeType.startsWith("audio/")) tipoArchivo = "audio";
      else if (mimeType.startsWith("video/")) tipoArchivo = "video";
      else tipoArchivo = "archivo";

      // Verificar reporte
      const reporte = await Reporte.findByPk(id_reporte);
      if (!reporte) {
        // Eliminar archivo si el reporte no existe
        fs.unlinkSync(req.file.path);
        return failure(res, "Reporte no encontrado", 404);
      }

      // Crear comentario con archivo
      const nuevoMensaje = await Comentario.create({
        id_reporte: parseInt(id_reporte),
        id_usuario,
        comentario: mensaje.trim() || `Archivo: ${req.file.originalname}`,
        tipo: tipoArchivo,
        nombre_archivo: req.file.originalname,
        archivo_url: req.file.filename,
        es_editado: false
      });

      const mensajeFormateado = {
        id_mensaje: nuevoMensaje.id_comentario,
        id_usuario,
        nombre: "Usuario", // Se puede obtener del token
        mensaje: nuevoMensaje.comentario,
        tipo: nuevoMensaje.tipo,
        nombre_archivo: nuevoMensaje.nombre_archivo,
        archivo_url: `${process.env.BASE_URL || "http://localhost:5000"}/uploads/comentarios/${nuevoMensaje.archivo_url}`,
        fecha_envio: nuevoMensaje.createdAt,
        es_editado: false,
        reacciones: {},
        mencionados: []
      };

      return success(res, "Archivo enviado correctamente", mensajeFormateado, 201);
    } catch (err) {
      console.error("❌ Error enviando archivo:", err);
      
      // Limpiar archivo en caso de error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return failure(res, "Error enviando archivo", 500, err.message);
    }
  }
];

// =========================
// 🗑️ ELIMINAR MENSAJE
// =========================
export const eliminarMensaje = async (req, res) => {
  try {
    const { id_mensaje } = req.params;
    const id_usuario = req.userId;

    const mensaje = await Comentario.findByPk(id_mensaje, {
      include: [{ model: Usuario, as: "Usuario" }]
    });

    if (!mensaje) {
      return failure(res, "Mensaje no encontrado", 404);
    }

    // Solo el propietario o admin puede eliminar
    if (mensaje.id_usuario !== id_usuario && req.userRol !== "admin") {
      return failure(res, "No tienes permisos para eliminar este mensaje", 403);
    }

    // Eliminar archivo asociado si existe
    if (mensaje.archivo_url) {
      const filePath = path.join("uploads/comentarios", mensaje.archivo_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await mensaje.destroy();

    return success(res, "Mensaje eliminado correctamente", { id_mensaje });
  } catch (err) {
    console.error("❌ Error eliminando mensaje:", err);
    return failure(res, "Error eliminando mensaje", 500);
  }
};

// =========================
// ❤️ REACCIONES
// =========================
export const reaccionarMensaje = async (req, res) => {
  try {
    const { id_mensaje } = req.params;
    const { emoji } = req.body;
    const id_usuario = req.userId;

    if (!emoji || emoji.length > 2) {
      return failure(res, "Emoji inválido", 400);
    }

    const mensaje = await Comentario.findByPk(id_mensaje);
    if (!mensaje) {
      return failure(res, "Mensaje no encontrado", 404);
    }

    const reacciones = mensaje.reacciones || {};
    const usuarioKey = `u${id_usuario}`;

    // Toggle reacción
    if (reacciones[emoji]?.includes(usuarioKey)) {
      // Quitar reacción
      reacciones[emoji] = reacciones[emoji].filter(u => u !== usuarioKey);
      if (reacciones[emoji].length === 0) {
        delete reacciones[emoji];
      }
    } else {
      // Agregar reacción
      if (!reacciones[emoji]) reacciones[emoji] = [];
      reacciones[emoji].push(usuarioKey);
    }

    await mensaje.update({ reacciones });

    return success(res, "Reacción actualizada", {
      id_mensaje,
      reacciones: mensaje.reacciones
    });
  } catch (err) {
    console.error("❌ Error reaccionando mensaje:", err);
    return failure(res, "Error procesando reacción", 500);
  }
};

// =========================
// 📊 CONTAR MENSAJES NO LEÍDOS
// =========================
export const contarMensajesNoLeidos = async (req, res) => {
  try {
    const { id_reporte } = req.params;
    const id_usuario = req.userId;

    const mensajesNoLeidos = await Comentario.count({
      where: {
        id_reporte: parseInt(id_reporte),
        id_usuario: { [Op.ne]: id_usuario }, // Mensajes de otros usuarios
        createdAt: { [Op.gt]: req.query.ultima_lectura || new Date(0) }
      }
    });

    return success(res, "Contador actualizado", { no_leidos: mensajesNoLeidos });
  } catch (err) {
    console.error("❌ Error contando mensajes:", err);
    return failure(res, "Error contando mensajes", 500);
  }
};

export { upload as comentarioUpload };