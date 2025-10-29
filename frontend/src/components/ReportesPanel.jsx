import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSync,
  FaExclamationCircle,
} from "react-icons/fa";
import axios from "axios";
import "../styles/reportesPanel.css";
import { categoryColors } from "../utils/categoryColors.js";

export default function ReportesPanel({ selectedReporte, onSelectReporte, panelVisible }) {
  const [reportes, setReportes] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerReportes = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/reportes", {
        timeout: 10000,
      });

      const data = response.data;
      const ordenados = data.sort((a, b) => {
        const prioridadA = { alto: 3, medio: 2, bajo: 1 }[a.nivel?.toLowerCase()] || 0;
        const prioridadB = { alto: 3, medio: 2, bajo: 1 }[b.nivel?.toLowerCase()] || 0;
        return (
          prioridadB - prioridadA ||
          new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
      });

      setReportes(ordenados);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar los reportes. Verifique su conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerReportes();
    const interval = setInterval(obtenerReportes, 60000);
    return () => clearInterval(interval);
  }, [obtenerReportes]);

  const getPriorityConfig = (nivel) => {
    const config = {
      alto: { color: "bg-red-100 text-red-800", icon: FaExclamationTriangle, label: "Alta" },
      medio: { color: "bg-yellow-100 text-yellow-800", icon: FaClock, label: "Media" },
      bajo: { color: "bg-blue-100 text-blue-800", icon: FaMapMarkerAlt, label: "Baja" },
    };
    return config[nivel?.toLowerCase()] || config.bajo;
  };

  const reportesFiltrados = filtro === "todos"
    ? reportes
    : reportes.filter(r => r.nivel?.toLowerCase() === filtro);

  const isSelected = (reporte) => selectedReporte?.id_reporte === reporte.id_reporte;

  const filtros = [
    { value: "todos", label: "Todos", icon: FaMapMarkerAlt },
    { value: "alto", label: "Alta", icon: FaExclamationTriangle },
    { value: "medio", label: "Media", icon: FaClock },
    { value: "bajo", label: "Baja", icon: FaMapMarkerAlt },
  ];

  return (
    <div className={`panel-reportes h-full flex flex-col bg-gray-50 ${panelVisible ? "block" : "hidden md:block"}`}>
      {/* HEADER INSTITUCIONAL */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              
              <div>
                <h2 className="text-lg font-bold text-gray-800">Reportes Ciudadanos</h2>
                <p className="text-xs text-gray-600">Alcaldía Municipal</p>
              </div>
            </div>
            <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {reportesFiltrados.length}
            </span>
          </div>

          {/* FILTROS TIPO CHIP */}
          <div className="flex items-center gap-2 flex-wrap">
            {filtros.map(f => {
              const Icon = f.icon;
              const active = filtro === f.value;
              const config = getPriorityConfig(f.value);
              return (
                <motion.button
                  key={f.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFiltro(f.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-blue-900 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={13} />
                  {f.label}
                </motion.button>
              );
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={obtenerReportes}
              className="p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-all"
              title="Actualizar"
            >
              <FaSync size={14} className="text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* LISTA DE REPORTES */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {/* LOADER INSTITUCIONAL */}
          {cargando && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-12 text-gray-600"
            >
              
              <p className="text-sm font-medium">Cargando reportes...</p>
            </motion.div>
          )}

          {/* ERROR INSTITUCIONAL */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationCircle size={16} />
                <span className="font-medium">Error de conexión</span>
              </div>
              <p className="text-sm mb-3">{error}</p>
              <button
                onClick={obtenerReportes}
                className="text-sm underline hover:no-underline font-medium"
              >
                Reintentar
              </button>
            </motion.div>
          )}

          {/* SIN REPORTES */}
          {!cargando && reportesFiltrados.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-12 text-gray-500"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">Empty</span>
              </div>
              <p className="text-sm font-medium">No hay reportes disponibles</p>
              <p className="text-xs mt-1">Pruebe cambiar el filtro</p>
            </motion.div>
          )}

          {/* REPORTES */}
          {!cargando &&
            reportesFiltrados.map((reporte, index) => {
              const config = getPriorityConfig(reporte.nivel);
              const Icon = config.icon;
              const categoriaColor = categoryColors[reporte.categoria?.toLowerCase().replace(/[^a-z]/g, '')] || '#6B7280';

              return (
                <motion.div
                  key={reporte.id_reporte}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`reporte-card mb-3 mx-2 p-4 bg-white rounded-xl shadow-sm border-l-4 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected(reporte)
                      ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  style={{ borderLeftColor: categoriaColor }}
                  onClick={() => onSelectReporte(reporte)}
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-lg ${config.color} shadow-sm`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {reporte.titulo}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {reporte.descripcion}
                        </p>
                      </div>
                    </div>
                    {isSelected(reporte) && (
                      <div className="flex-shrink-0">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-lg"></div>
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                    <span className="flex items-center truncate flex-1 mr-2">
                      <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                      <span className="truncate">{reporte.direccion || "Sin ubicación"}</span>
                    </span>
                    <span className="flex-shrink-0">
                      {new Date(reporte.fecha_creacion).toLocaleDateString("es-CO")}
                    </span>
                  </div>

                  {/* ESTADO RESUELTO */}
                  {reporte.estado === "resuelto" && (
                    <div className="flex items-center mt-3 p-1.5 bg-green-100 rounded-lg text-xs text-green-800 font-medium">
                      <FaCheckCircle className="mr-1.5" size={13} />
                      Reporte resuelto
                    </div>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}