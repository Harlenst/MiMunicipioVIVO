import express from "express";
import { verificarToken, esAdmin } from "../middleware/authJwt.js";
import { listarUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario } from "../controllers/usuariosController.js";
const router = express.Router();

router.get("/", verificarToken, esAdmin, listarUsuarios);
router.get("/:id", verificarToken, obtenerUsuario);
router.put("/:id", verificarToken, actualizarUsuario);
router.delete("/:id", verificarToken, esAdmin, eliminarUsuario);

export default router;
// Sólo administradores pueden listar y eliminar usuarios
// Usuarios pueden ver y actualizar su propio perfil
// Los moderadores y funcionarios pueden ver perfiles de otros usuarios, pero no actualizar ni eliminar