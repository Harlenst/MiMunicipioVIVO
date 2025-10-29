import { Usuario } from "../models/index.js";
import bcrypt from "bcryptjs";

/* ============================================
   📋 LISTAR USUARIOS (Solo Admin o Funcionario)
============================================ */
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["contrasena"] },
      order: [["nombre", "ASC"]],
    });
    res.json(usuarios);
  } catch (err) {
    console.error("❌ Error al listar usuarios:", err);
    res.status(500).json({ message: "Error al listar usuarios" });
  }
};

/* ============================================
   👤 OBTENER USUARIO POR ID (o por token si no hay id)
============================================ */
export const obtenerUsuario = async (req, res) => {
  try {
    const id = req.params.id || req.userId;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ["contrasena"] },
    });

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuario);
  } catch (err) {
    console.error("❌ Error al obtener usuario:", err);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

/* ============================================
   ✏️ ACTUALIZAR USUARIO / PERFIL (por id)
============================================ */
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (req.userId !== parseInt(id, 10) && req.userRol !== "admin") {
      return res.status(403).json({ message: "No autorizado para actualizar este usuario" });
    }

    if (data.contrasena) {
      const salt = bcrypt.genSaltSync(10);
      data.contrasena = bcrypt.hashSync(data.contrasena, salt);
    }

    await Usuario.update(data, { where: { id_usuario: id } });
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar usuario:", err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

/* ============================================
   🗑️ ELIMINAR USUARIO (Solo Admin)
============================================ */
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.userRol !== "admin") {
      return res.status(403).json({ message: "No autorizado para eliminar usuarios" });
    }

    const eliminado = await Usuario.destroy({ where: { id_usuario: id } });
    if (!eliminado) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

/* =======================================================
   🔹 OBTENER PERFIL DEL USUARIO AUTENTICADO (USADO POR FRONT)
   👉 Devuelve el usuario plano (sin wrapper success/data)
======================================================= */
export const obtenerPerfil = async (req, res) => {
  try {
    const id_usuario = req.userId;

    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: [
        "id_usuario",
        "tipo_sociedad",
        "tipo_entidad",
        "tipo_identificacion",
        "numero_identificacion",
        "nombre",
        "genero",
        "correo",
        "direccion",
        "barrio",
        "telefono1",
        "telefono2",
        "pais",
        "departamento",
        "ciudad",
        "rol",
        "fecha_registro",
        // Si estás usando personalización y notificaciones en este proyecto base:
        "tema", "color", "fuente",
        "notif_email", "notif_push", "notif_whatsapp", "notif_resumen"
      ],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // ✅ DEVOLVEMOS EL USUARIO PLANO (como espera el frontend actual)
    return res.json(usuario);

  } catch (error) {
    console.error("❌ Error al obtener perfil:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/* =======================================================
   🔹 ACTUALIZAR PERFIL (VALIDA CONTRASEÑA ACTUAL)
   👉 Usado por: PUT /api/usuarios/perfil
======================================================= */
export const actualizarPerfil = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const {
      nombre,
      correo,
      direccion,
      barrio,
      telefono1,
      telefono2,
      ciudad,
      departamento,
      contrasena_actual,
      nueva_contrasena,
    } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    // Requerimos contraseña actual para cualquier cambio sensible
    if (!contrasena_actual) {
      return res.status(401).json({ message: "Debes ingresar tu contraseña actual" });
    }

    const coincide = await bcrypt.compare(contrasena_actual, usuario.contrasena);
    if (!coincide) return res.status(401).json({ message: "Contraseña actual incorrecta" });

    // Si cambia correo, validar que no exista en otro usuario
    if (correo && correo !== usuario.correo) {
      const correoExistente = await Usuario.findOne({ where: { correo } });
      if (correoExistente) {
        return res.status(400).json({ message: "El correo ya está en uso por otro usuario" });
      }
      usuario.correo = correo;
    }

    // Actualiza campos básicos
    usuario.nombre = nombre ?? usuario.nombre;
    usuario.direccion = direccion ?? usuario.direccion;
    usuario.barrio = barrio ?? usuario.barrio;
    usuario.telefono1 = telefono1 ?? usuario.telefono1;
    usuario.telefono2 = telefono2 ?? usuario.telefono2;
    usuario.ciudad = ciudad ?? usuario.ciudad;
    usuario.departamento = departamento ?? usuario.departamento;

    // Cambiar contraseña si se envió nueva
    if (nueva_contrasena && nueva_contrasena.length >= 8) {
      usuario.contrasena = await bcrypt.hash(nueva_contrasena, 10);
    }

    await usuario.save();

    return res.json({
      message: "Perfil actualizado correctamente",
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        direccion: usuario.direccion,
        telefono1: usuario.telefono1,
        ciudad: usuario.ciudad,
        departamento: usuario.departamento,
      },
    });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    return res.status(500).json({ message: "Error al actualizar perfil" });
  }
};
