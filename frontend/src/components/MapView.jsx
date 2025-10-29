import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FaCrosshairs, FaEye, FaTimes, FaMapMarkerAlt,
  FaExclamationTriangle, FaCheckCircle, FaClock
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/mapaCiudadano.css";

// Fix íconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Íconos oficiales
const iconMap = {
  vias: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  residuos: "https://cdn-icons-png.flaticon.com/512/1265/1265540.png",
  alumbrado: "https://cdn-icons-png.flaticon.com/512/3063/3063179.png",
  seguridad: "https://cdn-icons-png.flaticon.com/512/1022/1022955.png",
  default: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
};

const createOfficialIcon = (categoria, estado) => {
  const iconUrl = iconMap[categoria?.toLowerCase()] || iconMap.default;
  const color = estado === "resuelto" ? "#10b981" : estado === "en proceso" ? "#3b82f6" : "#f97316";

  return new L.DivIcon({
    html: `
      <div style="position: relative; width: 36px; height: 36px;">
        <img src="${iconUrl}" style="width: 28px; height: 28px; position: absolute; top: 4px; left: 4px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));" />
        <div style="
          position: absolute; bottom: -2px; right: -2px;
          width: 16px; height: 16px; background: ${color};
          border: 2px solid white; border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    className: "custom-div-icon",
  });
};

// ESTADO BADGE - CORREGIDO
const EstadoBadge = ({ estado }) => {
  const estadoLower = estado?.toLowerCase() || "pendiente";

  const config = {
    pendiente: { color: "bg-orange-100 text-orange-800", icon: FaExclamationTriangle },
    "en proceso": { color: "bg-blue-100 text-blue-800", icon: FaClock },
    resuelto: { color: "bg-green-100 text-green-800", icon: FaCheckCircle },
  };

  const badge = config[estadoLower] || config.pendiente;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
      <Icon size={12} />
      {estado || "Pendiente"}
    </span>
  );
};

// Hook eventos
function MapEvents({ onSelectReporte, reportesFiltrados, selectedReporte, containerRef }) {
  const map = useMapEvents({});

  useEffect(() => {
    map.invalidateSize();
  }, [reportesFiltrados.length, map]);

  useEffect(() => {
    if (selectedReporte) {
      map.flyTo([selectedReporte.ubicacion_lat, selectedReporte.ubicacion_lng], 16, { duration: 1.5 });
    }
  }, [selectedReporte, map]);

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    if (containerRef?.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [map, containerRef]);

  return null;
}

export default function MapView({ selectedReporte, onSelectReporte, containerRef }) {
  const [categoria, setCategoria] = useState("todas");
  const [reportes, setReportes] = useState([]);
  const [center, setCenter] = useState([4.5709, -74.2973]);
  const [zoom, setZoom] = useState(11);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const navigate = useNavigate();

  const fetchReportes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/reportes", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error("Error de red");
      const data = await res.json();
      setReportes(data);
    } catch (error) {
      console.error("Error:", error);
      setReportes([
        {
          id_reporte: 1,
          titulo: "Bache en vía principal",
          descripcion: "Gran bache que afecta el tránsito vehicular",
          categoria: "Vías y baches",
          ubicacion_lat: 4.6097,
          ubicacion_lng: -74.0817,
          direccion: "Calle 100 # 10A-50",
          fecha_creacion: "2025-01-15",
          estado: "pendiente",
          nivel: "alto",
        },
        {
          id_reporte: 2,
          titulo: "Foco fundido en parque",
          descripcion: "Sin alumbrado público desde hace 3 días",
          categoria: "Alumbrado",
          ubicacion_lat: 4.6100,
          ubicacion_lng: -74.0800,
          direccion: "Calle 85 # 20-30",
          fecha_creacion: "2025-01-14",
          estado: "en proceso",
          nivel: "medio",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportes();
    const interval = setInterval(fetchReportes, 30000);
    return () => clearInterval(interval);
  }, [fetchReportes]);

  const geolocateUser = useCallback(() => {
    setIsGeolocating(true);
    if (!navigator.geolocation) {
      alert("Geolocalización no soportada");
      setIsGeolocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setZoom(16);
        setIsGeolocating(false);
      },
      () => {
        alert("No se pudo obtener ubicación");
        setIsGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const reportesFiltrados = categoria === "todas"
    ? reportes
    : reportes.filter(r => r.categoria?.toLowerCase().includes(categoria));

  const categorias = [
    { value: "todas", label: "Todas", icon: FaMapMarkerAlt },
    { value: "vias", label: "Vías", icon: FaExclamationTriangle },
    { value: "residuos", label: "Residuos", icon: FaExclamationTriangle },
    { value: "alumbrado", label: "Alumbrado", icon: FaExclamationTriangle },
    { value: "seguridad", label: "Seguridad", icon: FaExclamationTriangle },
  ];

  return (
    <div className="mapa-wrapper h-full w-full relative bg-gray-50" ref={containerRef}>
      {/* PANEL SUPERIOR */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-lg border-b border-gray-200"
      >
        <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            
            <div>
              <h2 className="text-lg font-bold text-gray-800">Sistema de Reportes Ciudadanos</h2>
              <p className="text-xs text-gray-600">Alcaldía Municipal - Reportes en tiempo real</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {categorias.map(cat => {
              const Icon = cat.icon;
              const active = categoria === cat.value;
              return (
                <motion.button
                  key={cat.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategoria(cat.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? "bg-blue-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </motion.button>
              );
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={geolocateUser}
              disabled={isGeolocating}
              className="p-2 bg-blue-900 text-white rounded-full shadow-md hover:shadow-lg disabled:opacity-50"
              title="Mi ubicación"
            >
              {isGeolocating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaCrosshairs size={14} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* MAPA */}
      <div className="h-full pt-20">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents
            onSelectReporte={onSelectReporte}
            reportesFiltrados={reportesFiltrados}
            selectedReporte={selectedReporte}
            containerRef={containerRef}
          />

          {reportesFiltrados.map(reporte => (
            <Marker
              key={reporte.id_reporte}
              position={[reporte.ubicacion_lat, reporte.ubicacion_lng]}
              icon={createOfficialIcon(reporte.categoria?.toLowerCase(), reporte.estado)}
              eventHandlers={{ click: () => onSelectReporte(reporte) }}
            >
              <Popup className="custom-popup" closeButton={false}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800 text-sm pr-2">
                      {reporte.titulo}
                    </h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectReporte(null); }}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <EstadoBadge estado={reporte.estado} />
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs font-medium text-gray-700">
                      {reporte.categoria}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {reporte.descripcion}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <div className="flex items-center gap-1">
                      <span>Dirección:</span>
                      <span className="font-medium">{reporte.direccion}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Fecha:</span>
                      <span className="font-medium">
                        {new Date(reporte.fecha_creacion).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/reportes/${reporte.id_reporte}`)}
                    className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-2 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaEye size={12} />
                    Ver reporte completo
                  </motion.button>
                </motion.div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* CONTADOR */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-2"
      >
        <span className="text-sm font-semibold text-gray-800">
          {reportesFiltrados.length} reportes activos
        </span>
      </motion.div>

      {/* LOADER */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/90 backdrop-blur-sm z-[2000] flex items-center justify-center"
          >
            <div className="text-center">
             
              <p className="text-sm font-medium text-gray-700">Cargando reportes...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}