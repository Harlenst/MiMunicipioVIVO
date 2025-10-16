import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Joi from "joi";
import nodemailer from "nodemailer";
import { Usuario } from "../models/index.js";
import { success, failure } from "../utils/response.js";

dotenv.config();

/* ========================================
   🔹 SCHEMAS DE VALIDACIÓN (JOI)
======================================== */
const schemaRegistro = Joi.object({
  cedula: Joi.string().min(6).max(20).required(),
  nombre: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .required(),
  municipio: Joi.string().required(),
  tiempo: Joi.string().required(),
  terminos: Joi.boolean().valid(true).required(),
});

const schemaLogin = Joi.object({
  cedula: Joi.string().optional(),
  municipio: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

/* ========================================
   🔹 CONFIGURACIÓN DEL TRANSPORTER
======================================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ========================================
   🔹 REGISTRO DE USUARIO
======================================== */
export const registrar = async (req, res) => {
  try {
    const { error } = schemaRegistro.validate(req.body);
    if (error) return failure(res, error.details[0].message, 400);

    const { cedula, nombre, email, password, municipio, tiempo } = req.body;

    const existe = await Usuario.findOne({ where: { correo: email } });
    if (existe) return failure(res, "El correo ya está registrado", 400);

    const hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      cedula,
      nombre,
      correo: email,
      contrasena: hash,
      municipio,
      tiempo_residencia: tiempo,
      rol: "ciudadano",
    });

    return success(res, "Registro exitoso. Ya puedes iniciar sesión.", {
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      municipio: usuario.municipio,
    });
  } catch (error) {
    return failure(res, "Error al registrar usuario", 500, error.message);
  }
};

/* ========================================
   🔹 LOGIN DE USUARIO
======================================== */
export const login = async (req, res) => {
  try {
    const { error } = schemaLogin.validate(req.body);
    if (error) return failure(res, error.details[0].message, 400);

    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { correo: email } });

    if (!usuario) return failure(res, "Usuario no encontrado", 404);

    const valido = await bcrypt.compare(password, usuario.contrasena);
    if (!valido) return failure(res, "Contraseña incorrecta", 401);

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return success(res, "Inicio de sesión exitoso", {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        municipio: usuario.municipio,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    return failure(res, "Error al iniciar sesión", 500, error.message);
  }
};

/* ========================================
   🔹 RECUPERAR CONTRASEÑA
======================================== */
export const recuperar = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { correo: email } });
    if (!usuario) return failure(res, "Usuario no encontrado", 404);

    const resetToken = jwt.sign(
      { id_usuario: usuario.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5000/api/auth/restablecer/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de contraseña - Municipio Vivo",
      html: `
        <h3>Restablecer contraseña</h3>
        <p>Hola ${usuario.nombre},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}" style="color:#1976d2;">Restablecer contraseña</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

    return success(res, "Se ha enviado un enlace de recuperación a tu correo.", {});
  } catch (error) {
    return failure(res, "Error al enviar correo de recuperación", 500, error.message);
  }
};

/* ========================================
   🔹 RESTABLECER CONTRASEÑA
======================================== */
export const restablecer = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaPass } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id_usuario);
    if (!usuario) return failure(res, "Usuario no encontrado", 404);

    const hash = await bcrypt.hash(nuevaPass, 10);
    usuario.contrasena = hash;
    await usuario.save();

    return success(res, "Contraseña restablecida correctamente", {});
  } catch (error) {
    return failure(res, "Error al restablecer contraseña", 500, error.message);
  }
};
