export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: error.details.map((d) => d.message),
    });
  }
};
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Validación centralizada de datos de entrada
// Usar esquemas específicos para cada ruta
// No exponer detalles sensibles en mensajes de error