import Joi from "joi";

export const registerSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  correo: Joi.string().email().required(),
  contrasena: Joi.string().min(6).required(),
  rol: Joi.string().valid("ciudadano", "funcionario", "admin").optional(),
});

export const loginSchema = Joi.object({
  correo: Joi.string().email().required(),
  contrasena: Joi.string().min(6).required(),
});
