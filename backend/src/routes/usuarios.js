import express from "express";
import {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerPerfil,
  actualizarPerfil
} from "../controllers/usuarioController.js";

import {
  verificarToken,
  esAdmin,
  esFuncionario
} from "../middleware/authJwt.js"

const router = express.Router();

/* ============================================
   🔒 PERFIL DEL USUARIO AUTENTICADO
   (Usado por AuthContext.jsx)
============================================ */
router.get("/perfil", verificarToken, obtenerPerfil);

/* ============================================
   ✏ ACTUALIZAR PERFIL PERSONAL (VALIDA CONTRASEÑA)
============================================ */
router.put("/perfil", verificarToken, actualizarPerfil);

/* ============================================
   👥 LISTAR TODOS LOS USUARIOS (ADMIN / FUNCIONARIO)
============================================ */
router.get("/", verificarToken, esFuncionario, listarUsuarios);

/* ============================================
   👤 OBTENER USUARIO POR ID
============================================ */
router.get("/:id", verificarToken, obtenerUsuario);

/* ============================================
   🧩 ACTUALIZAR USUARIO POR ID
   (Solo el propio usuario o admin)
============================================ */
router.put("/:id", verificarToken, actualizarUsuario);

/* ============================================
   🗑 ELIMINAR USUARIO (Solo Admin)
============================================ */
router.delete("/:id", verificarToken, esAdmin, eliminarUsuario);

export default router;