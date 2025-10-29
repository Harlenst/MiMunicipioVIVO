import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaList, FaMap, FaComments } from "react-icons/fa";
import MapView from "../components/MapView";
import ReportesPanel from "../components/ReportesPanel";
import "../styles/mapaCiudadano.css";

const MapaCiudadano = () => {
  const [panelVisible, setPanelVisible] = useState(true);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [viewMode, setViewMode] = useState("mapa"); // "mapa" o "lista"
  const mapContainerRef = useRef(null);

  // Alternar panel con resize para Leaflet
  const togglePanel = useCallback(() => {
    setPanelVisible((prev) => !prev);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, []);

  // Alternar vista mapa/lista
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "mapa" ? "lista" : "mapa"));
    if (!panelVisible) setPanelVisible(true);
  };

  // Resize para Leaflet
  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event("resize"));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mapa-ciudadano h-full w-full overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-full w-full" ref={mapContainerRef}>
        {/* VISTA PRINCIPAL: MAPA O LISTA */}
        <div
          className={`relative h-full transition-all duration-300 ease-in-out ${
            panelVisible && viewMode === "mapa" ? "flex-1" : "w-full"
          }`}
        >
          <AnimatePresence mode="wait">
            {viewMode === "mapa" ? (
              <motion.div
                key="mapa"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <MapView
                  selectedReporte={selectedReporte}
                  onSelectReporte={setSelectedReporte}
                  containerRef={mapContainerRef}
                />
              </motion.div>
            ) : (
              <motion.div
                key="lista"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full bg-white overflow-y-auto"
              >
                <div className="p-4 md:p-6">
                  <ReportesPanel
                    selectedReporte={selectedReporte}
                    onSelectReporte={setSelectedReporte}
                    panelVisible={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTÓN ALTERNAR PANEL (MÓVIL) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePanel}
            className="absolute top-4 left-4 z-[1000] bg-white text-blue-900 p-3 rounded-full shadow-lg border border-gray-200 md:hidden"
            aria-label={panelVisible ? "Ocultar panel" : "Mostrar panel"}
          >
            {panelVisible ? <FaTimes size={16} /> : <FaList size={16} />}
          </motion.button>

          {/* BOTÓN ALTERNAR MODO (MAPA/LISTA) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleViewMode}
            className="absolute top-4 right-4 z-[1000] bg-white text-blue-900 p-3 rounded-full shadow-lg border border-gray-200"
            aria-label={viewMode === "mapa" ? "Ver lista" : "Ver mapa"}
          >
            {viewMode === "mapa" ? <FaList size={16} /> : <FaMap size={16} />}
          </motion.button>
        </div>

        {/* PANEL LATERAL INSTITUCIONAL (solo en modo mapa) */}
        <AnimatePresence>
          {panelVisible && viewMode === "mapa" && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full md:w-96 lg:w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-10 h-full"
            >
              {/* HEADER DEL PANEL */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-4 border-b border-blue-600/30 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    
                    <div>
                      <h2 className="text-lg font-bold">Reportes en Tiempo Real</h2>
                      <p className="text-xs text-blue-100">
                        {selectedReporte
                          ? `Seleccionado: ${selectedReporte.titulo}`
                          : "Haz clic en un marcador"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePanel}
                    className="p-2 rounded-full hover:bg-white/20 transition-all"
                    aria-label="Cerrar panel"
                  >
                    <FaTimes size={16} />
                  </motion.button>
                </div>
              </div>

              {/* LISTA DE REPORTES */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <ReportesPanel
                  selectedReporte={selectedReporte}
                  onSelectReporte={setSelectedReporte}
                  panelVisible={panelVisible}
                />
              </div>

              {/* SECCIÓN CHAT (fija abajo) */}
              <div className="h-52 bg-white border-t border-gray-200 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <FaComments className="text-blue-600" />
                    Chat del Reporte
                  </h3>
                                    
                </div>

                <AnimatePresence mode="wait">
                  {selectedReporte ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex-1 space-y-2 overflow-y-auto"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-600">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-blue-900 text-sm">
                            {selectedReporte.titulo}
                          </h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {selectedReporte.categoria}
                          </span>
                        </div>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          {selectedReporte.descripcion}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Dirección:</span>
                          <span className="truncate">{selectedReporte.direccion}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <span className="font-medium">Usuario:</span>
                          <span>{selectedReporte.nombre_usuario || "Anónimo"}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <FaComments size={14} />
                        Iniciar Chat
                        <span className="text-xs opacity-90">(0 mensajes)</span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-gray-400"
                    >
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <FaComments size={24} />
                      </div>
                      <p className="text-sm font-medium text-center">Selecciona un reporte</p>
                      <p className="text-xs opacity-75 mt-1">para ver detalles y chatear</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapaCiudadano;