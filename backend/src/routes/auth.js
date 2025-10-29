import express from "express";
import {
  registrar,
  login,
  recuperar,
  restablecer,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/registro", registrar);
router.post("/login", login);
router.post("/recuperar", recuperar);
router.post("/restablecer/:token", restablecer);

export default router;
