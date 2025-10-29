// src/pages/Perfil.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaHome, FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Perfil() {
  const { token } = useAuth();
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${API_BASE}/api/usuarios/perfil`, { headers });
        setPerfil(res.data?.data || res.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError("No se pudo cargar la información del usuario");
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, [headers]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-blue-600 font-medium text-lg"
        >
          Cargando perfil...
        </motion.div>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600">{error || "No se pudo obtener la información del usuario."}</p>
        </motion.div>
      </div>
    );
  }

  const Campo = ({ icon: Icon, label, valor }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
    >
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900">
          {valor || <span className="text-gray-400 italic">No especificado</span>}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil Ciudadano</h1>
          <p className="text-gray-600 mt-2">Tu información registrada en Municipio Vivo</p>
        </motion.header>

        {/* TARJETA PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >

          {/* SECCIÓN SUPERIOR - IDENTIDAD */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg text-4xl font-bold"
              >
                {perfil.nombre.charAt(0).toUpperCase()}
              </motion.div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold">{perfil.nombre}</h2>
                <p className="text-blue-100 flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <FaEnvelope className="w-4 h-4" />
                  {perfil.correo}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                    {perfil.rol}
                  </span>
                  {perfil.fecha_registro && (
                    <span className="flex items-center gap-1 text-blue-100">
                      <FaCalendarAlt className="w-4 h-4" />
                      {new Date(perfil.fecha_registro).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DETALLES */}
          <div className="p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <Campo icon={FaHome} label="Dirección" valor={perfil.direccion} />
              <Campo icon={FaMapMarkerAlt} label="Barrio" valor={perfil.barrio} />
              <Campo icon={FaPhone} label="Teléfono principal" valor={perfil.telefono1} />
              <Campo icon={FaPhone} label="Teléfono secundario" valor={perfil.telefono2} />
              <Campo icon={FaMapMarkerAlt} label="Ciudad" valor={perfil.ciudad} />
              <Campo icon={FaMapMarkerAlt} label="Departamento" valor={perfil.departamento} />
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-gray-50 border-t border-gray-200 px-8 py-5 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Municipio Vivo • Portal Ciudadano
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}