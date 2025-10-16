import { Historial, Usuario } from "../models/index.js";
import { success, failure } from "../utils/response.js";

/**
 * 🧾 Registrar una acción
 */
export const registrarAccion = async (id_usuario, accion, descripcion) => {
  try {
    await Historial.create({ id_usuario, accion, descripcion });
  } catch (error) {
    console.error("Error al registrar historial:", error.message);
  }
};

/**
 * 📜 Listar historial (solo admin)
 */
export const listarHistorial = async (req, res) => {
  try {
    const historial = await Historial.findAll({
      include: [{ model: Usuario, attributes: ["nombre", "correo"] }],
      order: [["createdAt", "DESC"]],
    });

    return success(res, "Historial del sistema", historial);
  } catch (error) {
    return failure(res, "Error al obtener historial", 500, error.message);
  }
};
