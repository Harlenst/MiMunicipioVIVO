import { Dependencia } from "../models/index.js";

export const crearDependencia = async (req, res) => {
  const { nombre, descripcion, correo_contacto } = req.body;
  const d = await Dependencia.create({ nombre, descripcion, correo_contacto });
  res.json({ message: "Dependencia creada", d });
};

export const listarDependencias = async (req, res) => {
  const deps = await Dependencia.findAll();
  res.json(deps);
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo administradores pueden crear dependencias
// La lista de dependencias es pública
// Cada dependencia tiene nombre, descripción, contacto (email/teléfono)