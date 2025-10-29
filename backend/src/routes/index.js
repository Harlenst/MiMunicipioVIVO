import express from "express";
import authRoutes from "./auth.js";
import usuariosRoutes from "./usuarios.js";
import reportesRoutes from "./reportes.js";
import evidenciasRoutes from "./evidencias.js";
import votosRoutes from "./votos.js";
import dependenciasRoutes from "./dependencias.js";
import notificacionesRoutes from "./notificaciones.js";
import metricasRoutes from "./metricas.js";
import mapaRoutes from "./mapa.js";
import comentariosRoutes from "./comentarios.js";
import historialRoutes from "./historial.js";
import mapaPoligonoRoutes from "./mapaPoligono.js";
import comunidadesRoutes from "./comunidades.js";
import gruposRoutes from "./grupos.js";

const router = express.Router();

router.get("/", (req, res) =>
  res.json({ message: "API Mi Municipio Vivo v2 🚀" })
);

router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/reportes", reportesRoutes);
router.use("/votos", votosRoutes);
router.use("/evidencias", evidenciasRoutes);
router.use("/dependencias", dependenciasRoutes);
router.use("/notificaciones", notificacionesRoutes);
router.use("/metricas", metricasRoutes);
router.use("/mapa", mapaRoutes);
router.use("/comentarios", comentariosRoutes);
router.use("/historial", historialRoutes);
router.use("/mapa-poligono", mapaPoligonoRoutes);
router.use("/comunidades", comunidadesRoutes);
router.use("/grupos", gruposRoutes);

export default router;
// Nota: Considerar restricciones de seguridad y privacidad en producción
// Sólo usuarios autenticados pueden acceder a la mayoría de endpoints
// Algunos endpoints son públicos (listar dependencias, ver reportes, etc.)