import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Notificacion, Usuario } from "../models/index.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const enviarNotificacion = async (req, res) => {
  try {
    const { id_usuario, id_reporte, tipo, mensaje } = req.body;
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const mail = {
      from: process.env.MAIL_USER,
      to: usuario.correo,
      subject: `Notificación: ${tipo}`,
      text: mensaje
    };

    const info = await transporter.sendMail(mail);

    const noti = await Notificacion.create({ id_usuario, id_reporte, tipo, mensaje, estado_envio: "enviado" });
    res.json({ message: "Notificación enviada", info, noti });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error enviando notificación" });
  }
};

export const listarNotificaciones = async (req, res) => {
  const userId = req.userId;
  const items = await Notificacion.findAll({ where: { id_usuario: userId }, order: [["fecha_envio", "DESC"]] });
  res.json(items);
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo usuarios autenticados pueden enviar y ver notificaciones
// Los administradores pueden enviar notificaciones a todos los usuarios
// Los usuarios pueden ver sólo sus propias notificaciones