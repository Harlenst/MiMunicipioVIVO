import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const enviarCorreo = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  });
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Usar TLS/SSL para conexiones de correo
// No exponer credenciales en el código fuente
// Limitar la tasa de envío para evitar ser marcado como spam