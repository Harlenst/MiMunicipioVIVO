import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaComments, FaUsers, FaUserFriends, FaSearch, FaPlus, FaLock, 
  FaPaperclip, FaImage, FaPaperPlane, FaCheckCircle, FaClock, FaExclamationTriangle 
} from "react-icons/fa";
import ChatLista from "./ChatLista";
import ComunidadLista from "./ComunidadLista";
import GrupoLista from "./GrupoLista";
import ChatReporte from "./ChatReporte";
import ChatComunidad from "./ChatComunidad";
import ChatGrupo from "./ChatGrupo";
import ChatDetalles from "./ChatDetalles";
import ComunidadDetalles from "./ComunidadDetalles";
import GrupoDetalles from "./GrupoDetalles";
import EmptyChat from "./EmptyChat";

import { useAuth } from "../../context/AuthContext";

export default function ChatCiudadano() {
  const { user } = useAuth();
  const [seccion, setSeccion] = useState("reportes");
  const [reportes, setReportes] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    if (!user?.id_usuario) return;

    const fetchAll = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          fetch(`http://localhost:5000/api/reportes/usuario/${user.id_usuario}`),
          fetch(`http://localhost:5000/api/comunidades/usuario/${user.id_usuario}`),
          fetch(`http://localhost:5000/api/grupos/usuario/${user.id_usuario}`)
        ]);

        const [data1, data2, data3] = await Promise.all([res1.json(), res2.json(), res3.json()]);
        setReportes(Array.isArray(data1) ? data1 : []);
        setComunidades(Array.isArray(data2) ? data2 : []);
        setGrupos(Array.isArray(data3) ? data3 : []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const getSeleccionado = () => {
    switch (seccion) {
      case "reportes": return { seleccionado: reporteSeleccionado, set: setReporteSeleccionado, lista: reportes };
      case "comunidades": return { seleccionado: comunidadSeleccionada, set: setComunidadSeleccionada, lista: comunidades };
      case "grupos": return { seleccionado: grupoSeleccionado, set: setGrupoSeleccionado, lista: grupos };
      default: return { seleccionado: null, set: () => {}, lista: [] };
    }
  };

  const { seleccionado, lista } = getSeleccionado();
  const total = reportes.length + comunidades.length + grupos.length;

  const tabs = [
    { key: "reportes", label: "Reportes", icon: FaComments, count: reportes.length, color: "blue" },
    { key: "comunidades", label: "Comunidades", icon: FaUsers, count: comunidades.length, color: "indigo" },
    { key: "grupos", label: "Grupos", icon: FaUserFriends, count: grupos.length, color: "emerald" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          
          <p className="text-gray-600 font-medium">Cargando mensajes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER INSTITUCIONAL */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Centro de Mensajes</h1>
                <p className="text-sm text-gray-600">Comunicación oficial con la ciudadanía</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                {total} conversaciones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = seccion === tab.key;
            return (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSeccion(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
                  active
                    ? `bg-${tab.color}-600 text-white`
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    active ? "bg-white/20" : `bg-${tab.color}-100 text-${tab.color}-700`
                  }`}>
                    {tab.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            {seccion === "reportes" && (
              <ChatLista reportes={reportes} onSelect={setReporteSeleccionado} seleccionado={reporteSeleccionado} />
            )}
            {seccion === "comunidades" && (
              <ComunidadLista comunidades={comunidades} onSelect={setComunidadSeleccionada} seleccionada={comunidadSeleccionada} />
            )}
            {seccion === "grupos" && (
              <GrupoLista grupos={grupos} onSelect={setGrupoSeleccionado} seleccionado={grupoSeleccionado} />
            )}
          </div>

          {/* CHAT CENTRAL */}
          <div className="lg:col-span-5">
            {seccion === "reportes" && (
              reporteSeleccionado ? <ChatReporte id_reporte={reporteSeleccionado.id_reporte} usuario={user} /> : <EmptyChat type="reporte" />
            )}
            {seccion === "comunidades" && (
              comunidadSeleccionada ? <ChatComunidad id_comunidad={comunidadSeleccionada.id_comunidad} usuario={user} /> : <EmptyChat type="comunidad" />
            )}
            {seccion === "grupos" && (
              grupoSeleccionado ? <ChatGrupo id_grupo={grupoSeleccionado.id_grupo} usuario={user} /> : <EmptyChat type="grupo" />
            )}
          </div>

          {/* DETALLES */}
          <div className="lg:col-span-3">
            {seccion === "reportes" && <ChatDetalles reporte={reporteSeleccionado} />}
            {seccion === "comunidades" && <ComunidadDetalles comunidad={comunidadSeleccionada} />}
            {seccion === "grupos" && <GrupoDetalles grupo={grupoSeleccionado} />}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex justify-center lg:justify-end gap-3 mt-8">
          {seccion === "comunidades" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg font-medium"
            >
              <FaPlus /> Unirse a Comunidad
            </motion.button>
          )}
          {seccion === "grupos" && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg font-medium"
              >
                <FaPlus /> Crear Grupo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg font-medium"
              >
                <FaLock /> Unirse por Código
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}