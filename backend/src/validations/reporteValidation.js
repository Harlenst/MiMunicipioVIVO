import Joi from "joi";

export const reporteSchema = Joi.object({
  titulo: Joi.string().min(5).required(),
  descripcion: Joi.string().min(10).required(),
  categoria: Joi.string().required(),
  ubicacion_lat: Joi.number().optional(),
  ubicacion_lng: Joi.number().optional(),
  direccion: Joi.string().optional(),
});
