// src/pages/Notificaciones.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No hay sesión activa. Inicia sesión para ver tus notificaciones.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/notificaciones`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotificaciones(res.data.data || res.data);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
        setError("No se pudieron obtener tus notificaciones. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, []);

  // Loader institucional
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-3 text-blue-600 font-medium"
        >
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando notificaciones...
        </motion.div>
      </div>
    );
  }

  // Error institucional
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error de conexión</h3>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER INSTITUCIONAL */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Notificaciones</h1>
          </div>
          <p className="text-gray-600">Actualizaciones sobre tus reportes y actividad en el portal</p>
        </motion.header>

        {/* LISTA DE NOTIFICACIONES */}
        <div className="space-y-4">
          <AnimatePresence>
            {notificaciones.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No tienes notificaciones por el momento</p>
                <p className="text-sm text-gray-400 mt-2">Aquí aparecerán actualizaciones de tus reportes</p>
              </motion.div>
            ) : (
              notificaciones.map((n, index) => (
                <motion.div
                  key={n.id_notificacion || index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-white rounded-2xl shadow-md p-5 border-l-4 transition-all ${
                    n.tipo.includes("estado")
                      ? "border-blue-600"
                      : n.tipo.includes("nuevo")
                      ? "border-emerald-600"
                      : "border-indigo-600"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Ícono según tipo */}
                    <div className="flex-shrink-0">
                      {n.tipo.includes("estado") ? (
                        <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {n.tipo}
                        {n.leida === false && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </h3>
                      <p className="text-gray-700 text-sm mt-1">{n.mensaje}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3" />
                        {new Date(n.fecha_envio).toLocaleString("es-CO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>

                      {/* Enlace al reporte */}
                      {n.id_reporte && (
                        <a
                          href={`/panel/reportes/${n.id_reporte}`}
                          className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Ver reporte →
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Municipio Vivo • Portal Ciudadano
          </p>
        </div>
      </div>
    </div>
  );
}