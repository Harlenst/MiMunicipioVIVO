import bcrypt from "bcryptjs";
import { Usuario } from "../models/index.js";

/* ============================================================
   🧾 Obtener configuración actual del usuario
============================================================ */
export const obtenerConfiguracionUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (req.userId !== parseInt(id_usuario, 10) && req.userRol !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: [
        "id_usuario",
        "nombre",
        "correo",
        "telefono1",
        "telefono2",
        "direccion",
        "barrio",
        "ciudad",
        "tema",
        "color",
        "fuente",
        "notif_email",
        "notif_push",
        "notif_whatsapp",
        "notif_resumen"
      ]
    });

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuario);
  } catch (err) {
    console.error("❌ Error al obtener configuración:", err);
    res.status(500).json({ message: "Error al obtener configuración" });
  }
};

/* ============================================================
   👤 Actualizar perfil (requiere contraseña)
============================================================ */
export const actualizarPerfil = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { nombre, correo, telefono1, telefono2, direccion, barrio, ciudad, password } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(password, usuario.contrasena);
    if (!coincide) return res.status(401).json({ message: "Contraseña incorrecta" });

    usuario.nombre = nombre || usuario.nombre;
    usuario.correo = correo || usuario.correo;
    usuario.telefono1 = telefono1 || usuario.telefono1;
    usuario.telefono2 = telefono2 || usuario.telefono2;
    usuario.direccion = direccion || usuario.direccion;
    usuario.barrio = barrio || usuario.barrio;
    usuario.ciudad = ciudad || usuario.ciudad;

    await usuario.save();

    res.json({ message: "✅ Perfil actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar perfil:", err);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};

/* ============================================================
   🔒 Actualizar contraseña
============================================================ */
export const actualizarContrasena = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { actual, nueva } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(actual, usuario.contrasena);
    if (!coincide) return res.status(401).json({ message: "Contraseña actual incorrecta" });

    const hashNueva = await bcrypt.hash(nueva, 10);
    usuario.contrasena = hashNueva;
    await usuario.save();

    res.json({ message: "🔒 Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar contraseña:", err);
    res.status(500).json({ message: "Error al actualizar contraseña" });
  }
};

/* ============================================================
   🎨 Actualizar preferencias de personalización
============================================================ */
export const actualizarPersonalizacion = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { tema, color, fuente, password } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(password, usuario.contrasena);
    if (!coincide) return res.status(401).json({ message: "Contraseña incorrecta" });

    usuario.tema = tema || usuario.tema;
    usuario.color = color || usuario.color;
    usuario.fuente = fuente || usuario.fuente;

    await usuario.save();

    res.json({ message: "🎨 Personalización actualizada correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar personalización:", err);
    res.status(500).json({ message: "Error al actualizar personalización" });
  }
};

/* ============================================================
   🔔 Actualizar preferencias de notificaciones
============================================================ */
export const actualizarNotificaciones = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { email, push, whatsapp, resumen, password } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(password, usuario.contrasena);
    if (!coincide) return res.status(401).json({ message: "Contraseña incorrecta" });

    usuario.notif_email = email;
    usuario.notif_push = push;
    usuario.notif_whatsapp = whatsapp;
    usuario.notif_resumen = resumen;

    await usuario.save();

    res.json({ message: "🔔 Preferencias de notificación actualizadas correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar notificaciones:", err);
    res.status(500).json({ message: "Error al actualizar notificaciones" });
  }
};
