import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🧩 Middleware para verificar que el token JWT sea válido.
 * Se usa en rutas protegidas (por ejemplo, reportes, notificaciones, perfil, etc.)
 */
export const verificarToken = (req, res, next) => {
  try {
    let token = req.headers["authorization"] || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token" });
    }

    // 🔹 Quita el prefijo 'Bearer ' si está presente
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    // 🧠 Depuración opcional (ver qué token llega)
    // console.log("🔍 Token recibido:", token);

    // 🔐 Verifica el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Guarda info del usuario en la request
    req.userId = decoded.id_usuario;
    req.userRol = decoded.rol;

    next(); // continúa al siguiente middleware o controlador
    } catch (error) {
    console.error("❌ Error al verificar token:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        message: "Token expirado, inicia sesión nuevamente",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        ok: false,
        message: "Token inválido o mal formado",
      });
    }

    return res.status(401).json({
      ok: false,
      message: "Error de autenticación. Por favor, inicia sesión nuevamente",
    });
  }
};


/**
 * 🛡️ Middleware para verificar si el usuario tiene rol ADMIN
 */
export const esAdmin = (req, res, next) => {
  if (req.userRol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: requiere rol de administrador" });
  }
  next();
};

/**
 * 🧱 Middleware opcional: permite acceso a funcionarios
 */
export const esFuncionario = (req, res, next) => {
  if (!["admin", "funcionario"].includes(req.userRol)) {
    return res.status(403).json({ message: "Acceso restringido a funcionarios o administradores" });
  }
  next();
};
