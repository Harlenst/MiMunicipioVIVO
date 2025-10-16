import { Comentario, Reporte, Usuario } from "../models/index.js";
import { success, failure } from "../utils/response.js";

/**
 * 💬 Crear un comentario
 */
export const crearComentario = async (req, res) => {
  try {
    const { id_reporte, texto } = req.body;
    const id_usuario = req.userId;

    if (!texto) return failure(res, "El comentario no puede estar vacío", 400);

    const nuevoComentario = await Comentario.create({
      id_reporte,
      id_usuario,
      texto,
    });

    return success(res, "Comentario agregado correctamente", nuevoComentario);
  } catch (error) {
    return failure(res, "Error al agregar comentario", 500, error.message);
  }
};

/**
 * 📜 Listar comentarios de un reporte
 */
export const listarComentariosPorReporte = async (req, res) => {
  try {
    const { id_reporte } = req.params;

    const comentarios = await Comentario.findAll({
      where: { id_reporte },
      include: [{ model: Usuario, attributes: ["nombre", "correo"] }],
      order: [["createdAt", "DESC"]],
    });

    return success(res, "Comentarios obtenidos correctamente", comentarios);
  } catch (error) {
    return failure(res, "Error al listar comentarios", 500, error.message);
  }
};
