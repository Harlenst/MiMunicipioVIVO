// 📄 src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR DETECTADO:");
  console.error({
    ruta: req.originalUrl,
    metodo: req.method,
    mensaje: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : "Oculto en producción",
  });

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Error interno del servidor",
    ruta: req.originalUrl,
  });
};

// Nota: Considerar restricciones de seguridad y privacidad en producción
// Manejo centralizado de errores para toda la aplicación
// No exponer detalles sensibles en mensajes de error
// Diferenciar entre errores del cliente (4xx) y del servidor (5xx)