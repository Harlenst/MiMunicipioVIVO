import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Joi from "joi";
import { Usuario } from "../models/index.js";
import { success, failure } from "../utils/response.js";

dotenv.config();

/* =======================
   🔹 VALIDACIÓN (JOI)
======================= */
const schemaRegistro = Joi.object({
  tipo_sociedad: Joi.string().required(),
  tipo_entidad: Joi.string().required(),
  tipo_identificacion: Joi.string().required(),
  numero_identificacion: Joi.string().min(4).max(20).required(),
  nombre: Joi.string().min(3).max(120).required(),
  genero: Joi.string().required(),
  correo: Joi.string().email().required(),
  direccion: Joi.string().min(5).max(200).required(),
  barrio: Joi.string().allow(null, ""),
  telefono1: Joi.string().min(6).max(20).required(),
  telefono2: Joi.string().allow(null, ""),
  pais: Joi.string().required(),
  departamento: Joi.string().required(),
  ciudad: Joi.string().required(),
  contrasena: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

/* =======================
   🔹 TRANSPORTER EMAIL
======================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =======================
   🔹 REGISTRO DE USUARIO
======================= */
export const registrar = async (req, res) => {
  try {
    const { error } = schemaRegistro.validate(req.body);
    if (error) return failure(res, error.details[0].message, 400);

    const {
      tipo_sociedad,
      tipo_entidad,
      tipo_identificacion,
      numero_identificacion,
      nombre,
      genero,
      correo,
      direccion,
      barrio,
      telefono1,
      telefono2,
      pais,
      departamento,
      ciudad,
      contrasena,
    } = req.body;

    const existeCorreo = await Usuario.findOne({ where: { correo } });
    if (existeCorreo)
      return failure(res, "El correo ya está registrado", 400);

    const existeCedula = await Usuario.findOne({
      where: { numero_identificacion },
    });
    if (existeCedula)
      return failure(res, "El número de identificación ya existe", 400);

    const hash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await Usuario.create({
      tipo_sociedad,
      tipo_entidad,
      tipo_identificacion,
      numero_identificacion,
      nombre,
      genero,
      correo,
      direccion,
      barrio,
      telefono1,
      telefono2,
      pais,
      departamento,
      ciudad,
      contrasena: hash,
      rol: "ciudadano",
    });

    return success(res, "✅ Registro exitoso. Ya puedes iniciar sesión.", {
      id_usuario: nuevoUsuario.id_usuario,
      correo: nuevoUsuario.correo,
      nombre: nuevoUsuario.nombre,
    });
  } catch (error) {
    console.error("❌ Error al registrar:", error.message);
    return failure(res, "Error al registrar usuario", 500, error.message);
  }
};

/* =======================
   🔹 LOGIN
======================= */
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
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    return failure(res, "Error al iniciar sesión", 500, error.message);
  }
};

/* =======================
   🔹 RECUPERAR CONTRASEÑA
======================= */
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
        <a href="${resetLink}" style="color:#2563eb;">Restablecer contraseña</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

    return success(res, "Se ha enviado un enlace de recuperación a tu correo.", {});
  } catch (error) {
    console.error("❌ Error al enviar correo:", error.message);
    return failure(res, "Error al enviar correo de recuperación", 500, error.message);
  }
};

/* =======================
   🔹 RESTABLECER CONTRASEÑA
======================= */
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
    console.error("❌ Error al restablecer contraseña:", error.message);
    return failure(res, "Error al restablecer contraseña", 500, error.message);
  }
};
