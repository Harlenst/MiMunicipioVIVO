import { Usuario } from "../models/index.js";
import bcrypt from "bcryptjs";

export const listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll({ attributes: { exclude: ["contrasena"] } });
  res.json(usuarios);
};

export const obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id, { attributes: { exclude: ["contrasena"] } });
  if (!usuario) return res.status(404).json({ message: "No encontrado" });
  res.json(usuario);
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (data.contrasena) {
    const salt = bcrypt.genSaltSync(10);
    data.contrasena = bcrypt.hashSync(data.contrasena, salt);
  }
  await Usuario.update(data, { where: { id_usuario: id } });
  res.json({ message: "Usuario actualizado" });
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  await Usuario.destroy({ where: { id_usuario: id } });
  res.json({ message: "Usuario eliminado" });
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo administradores pueden listar y eliminar usuarios
// Usuarios pueden ver y actualizar su propio perfil
// Los moderadores y funcionarios pueden ver perfiles de otros usuarios, pero no actualizar ni eliminar