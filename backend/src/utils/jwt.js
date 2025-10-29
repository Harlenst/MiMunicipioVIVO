import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_ultrasecreta";
const JWT_EXPIRES = "7d";

// ✅ Generar token
export const generarToken = (usuario) => {
  const payload = {
    id_usuario: usuario.id_usuario,
    email: usuario.email,
    rol: usuario.rol,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

// ✅ Verificar token
export const verificarToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
