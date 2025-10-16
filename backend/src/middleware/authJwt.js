import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verificarToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided." });

  const tokenClean = token.startsWith("Bearer ") ? token.slice(7) : token;
  jwt.verify(tokenClean, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized." });
    req.userId = decoded.id_usuario;
    req.userRol = decoded.rol;
    next();
  });
};

export const esAdmin = (req, res, next) => {
  if (req.userRol !== "admin" && req.userRol !== "funcionario") {
    return res.status(403).json({ message: "Require admin or funcionario role." });
  }
  next();
};
