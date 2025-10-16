export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
  });
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Manejo centralizado de errores para toda la aplicación
// No exponer detalles sensibles en mensajes de error
// Diferenciar entre errores del cliente (4xx) y del servidor (5xx)