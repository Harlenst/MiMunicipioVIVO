import { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaPlusCircle, FaExclamationCircle, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ModalCrearReporte from "../components/ModalCrearReporte/ModalCrearReporte.jsx";
import "../styles/reportes.css";

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarReportes = async () => {
    try {
      const params = {};
      if (categoria) params.categoria = categoria;
      if (estado) params.estado = estado;
      if (busqueda) params.busqueda = busqueda;

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/reportes", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const cleanedReports = res.data.map((rep) => ({
        ...rep,
        titulo: rep.titulo || "Sin título",
        descripcion: rep.descripcion || "Sin descripción",
        direccion: rep.direccion || "Ubicación no especificada",
      }));
      setReportes(cleanedReports);
    } catch (err) {
      console.error("Error al cargar reportes:", err);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, [categoria, estado, busqueda]);

  const handleSearch = (query) => {
    setBusqueda(query);
  };

  // Icono y color por estado
  const getEstadoInfo = (estado) => {
    switch (estado?.toLowerCase()) {
      case "recibido":
        return { icon: <FaExclamationCircle />, color: "bg-orange-100 text-orange-700 border-orange-300" };
      case "en gestión":
        return { icon: <FaClock />, color: "bg-blue-100 text-blue-700 border-blue-300" };
      case "resuelto":
        return { icon: <FaCheckCircle />, color: "bg-green-100 text-green-700 border-green-300" };
      default:
        return { icon: <FaClock />, color: "bg-gray-100 text-gray-700 border-gray-300" };
    }
  };

  return (
    <div className="reportes-container min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Botón flotante móvil */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMostrarModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 md:hidden"
        aria-label="Nuevo reporte"
      >
        <FaPlusCircle size={24} />
      </motion.button>

      <div className="reportes-content max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="reportes-header mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                Reportes Ciudadanos
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {reportes.length} reportes encontrados
              </p>
            </div>
            <button
              onClick={() => setMostrarModal(true)}
              className="nuevo-reporte-btn hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <FaPlusCircle size={20} />
              Nuevo Reporte
            </button>
          </div>
        </motion.header>

        {/* Filtros */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="filtros-reportes bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, descripción o dirección..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Categoría */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Todas las categorías</option>
                <option value="Vías y baches">Vías y baches</option>
                <option value="Residuos y limpieza">Residuos y limpieza</option>
                <option value="Alumbrado público">Alumbrado público</option>
                <option value="Seguridad">Seguridad</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Todos los estados</option>
                <option value="Recibido">Recibido</option>
                <option value="En gestión">En gestión</option>
                <option value="Resuelto">Resuelto</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Lista de Reportes */}
        <div className="lista-reportes">
          {reportes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaExclamationCircle size={32} className="text-gray-400" />
              </div>
              <p className="text-lg text-gray-600">No hay reportes disponibles</p>
              <p className="text-sm text-gray-500 mt-1">Prueba ajustar los filtros</p>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {reportes.map((rep, index) => {
                  const estadoInfo = getEstadoInfo(rep.estado);
                  return (
                    <motion.div
                      key={rep.id_reporte}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="reporte-card bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 border border-gray-200 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-800 flex-1 pr-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {rep.titulo}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${estadoInfo.color}`}
                        >
                          {estadoInfo.icon}
                          {rep.estado}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {rep.descripcion}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1 mb-1 sm:mb-0">
                          <span className="truncate">{rep.direccion}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            {new Date(rep.fecha_creacion).toLocaleDateString("es-CO", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {mostrarModal && (
          <ModalCrearReporte
            onClose={() => setMostrarModal(false)}
            onReporteCreado={() => {
              setMostrarModal(false);
              cargarReportes();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}