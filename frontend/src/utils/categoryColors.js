// src/utils/categoryColors.js
export const categoryColors = {
  vias: '#10B981',        // Verde
  residuos: '#3B82F6',    // Azul
  alumbrado: '#F59E0B',   // Amarillo
  seguridad: '#EF4444',   // Rojo
  todas: '#6B7280',       // Gris
  default: '#9CA3AF'      // Fallback
};

export const getCategoryColor = (categoria) => {
  if (!categoria) return categoryColors.default;
  const cleanCategoria = categoria.toLowerCase().replace(/[^a-z]/g, '');
  return categoryColors[cleanCategoria] || categoryColors.default;
};