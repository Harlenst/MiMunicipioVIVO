import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Notificacion, Usuario } from "../models/index.js";
dotenv.config();

/* =======================================================
   ✉️ CONFIGURACIÓN GLOBAL DEL TRANSPORTER (SMTP)
   ======================================================= */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* =======================================================
   📤 ENVIAR NOTIFICACIÓN A USUARIO
   ======================================================= */
export const enviarNotificacion = async (req, res) => {
  try {
    const { id_usuario, id_reporte, tipo, mensaje } = req.body;

    // ✅ Validación mínima
    if (!id_usuario || !tipo || !mensaje)
      return res.status(400).json({ message: "Datos incompletos para enviar notificación" });

    // ✅ Buscar usuario destino
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    // ✅ Enviar correo (opcional si MAIL_USER está configurado)
    let info = null;
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      info = await transporter.sendMail({
        from: `"Mi Municipio Vivo" <${process.env.MAIL_USER}>`,
        to: usuario.correo,
        subject: `Notificación: ${tipo}`,
        text: mensaje,
      });
    }

    // ✅ Registrar notificación en la base de datos
    const noti = await Notificacion.create({
      id_usuario,
      id_reporte,
      tipo,
      mensaje,
      estado_envio: "enviado",
      fecha_envio: new Date(),
    });

    res.json({
      message: "✅ Notificación enviada correctamente",
      correo: usuario.correo,
      info,
      notificacion: noti,
    });
  } catch (err) {
    console.error("❌ Error al enviar notificación:", err);
    res.status(500).json({ message: "Error enviando notificación", error: err.message });
  }
};

/* =======================================================
   📩 LISTAR NOTIFICACIONES DEL USUARIO AUTENTICADO
   ======================================================= */
export const listarNotificaciones = async (req, res) => {
  try {
    const userId = req.userId; // viene del JWT verificado por el middleware

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const notificaciones = await Notificacion.findAll({
      where: { id_usuario: userId },
      order: [["fecha_envio", "DESC"]],
    });

    res.json(notificaciones);
  } catch (err) {
    console.error("❌ Error al listar notificaciones:", err);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

/* =======================================================
   ⚙️ OPCIONAL: ENVIAR NOTIFICACIÓN A TODOS LOS USUARIOS
   ======================================================= */
export const notificarATodos = async (req, res) => {
  try {
    const { tipo, mensaje } = req.body;
    if (!tipo || !mensaje)
      return res.status(400).json({ message: "Faltan datos para enviar notificación" });

    const usuarios = await Usuario.findAll();

    const registros = [];

    for (const u of usuarios) {
      // Envío de correo (si se configuró)
      if (process.env.MAIL_USER && process.env.MAIL_PASS) {
        await transporter.sendMail({
          from: `"Mi Municipio Vivo" <${process.env.MAIL_USER}>`,
          to: u.correo,
          subject: `Notificación general: ${tipo}`,
          text: mensaje,
        });
      }

      const n = await Notificacion.create({
        id_usuario: u.id_usuario,
        tipo,
        mensaje,
        estado_envio: "enviado",
        fecha_envio: new Date(),
      });

      registros.push(n);
    }

    res.json({ message: "✅ Notificaciones enviadas a todos los usuarios", total: registros.length });
  } catch (err) {
    console.error("❌ Error al notificar a todos:", err);
    res.status(500).json({ message: "Error al enviar notificaciones masivas", error: err.message });
  }
};

// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo usuarios autenticados pueden enviar y ver notificaciones
// Los administradores pueden enviar notificaciones a todos los usuarios
// Los usuarios pueden ver sólo sus propias notificaciones