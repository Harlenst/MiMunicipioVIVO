import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  FileText,
  ImageIcon,
  Clock,
  User,
  Video,
  File,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Configurar icono de marcador Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

export default function DetalleReporte() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("⚠️ No hay sesión activa. Inicia sesión para ver este reporte.");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/reportes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data?.ok || !res.data?.reporte) {
          throw new Error("No se encontró el reporte solicitado");
        }

        setReporte(res.data.reporte);
      } catch (err) {
        console.error("❌ Error al cargar reporte:", err);
        setError("No se pudo cargar el reporte. Verifica tu sesión o el ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Cargando reporte...
      </div>
    );
  }

  if (error) {
    return <ErrorView message={error} onBack={() => navigate(-1)} />;
  }

  if (!reporte) {
    return (
      <ErrorView
        message="No se encontró el reporte solicitado."
        onBack={() => navigate(-1)}
      />
    );
  }

  const archivos = Array.isArray(reporte.archivos) ? reporte.archivos : [];

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🔙 Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Volver
      </button>

      {/* 🧾 Encabezado */}
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Reporte #{reporte.id_reporte}
        </h1>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <Clock size={14} />
          Creado el:{" "}
          {new Date(reporte.createdAt || Date.now()).toLocaleString()}
        </p>
      </div>

      {/* 👤 Usuario */}
      {reporte.Usuario && (
        <div className="mb-6 flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-md">
          <User size={16} />
          <span>
            Reportado por:{" "}
            <strong>{reporte.Usuario.nombre}</strong> (
            {reporte.Usuario.correo})
          </span>
        </div>
      )}

      {/* 📋 Detalles */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <InfoItem label="Título" value={reporte.titulo} />
        <InfoItem label="Categoría" value={reporte.categoria} color="text-blue-700" />
        <InfoItem
          label="Prioridad"
          value={reporte.prioridad}
          color={
            reporte.prioridad === "Alta"
              ? "text-red-600 font-bold"
              : reporte.prioridad === "Media"
              ? "text-yellow-600 font-semibold"
              : "text-green-600"
          }
        />
        <InfoItem
          label="Estado"
          value={reporte.estado}
          color={
            reporte.estado === "Resuelto"
              ? "text-green-700 font-semibold"
              : reporte.estado === "Pendiente"
              ? "text-orange-600 font-semibold"
              : "text-gray-700"
          }
        />
      </div>

      {/* 📖 Descripción */}
      <Section title="Descripción" icon={<FileText size={16} />}>
        {reporte.descripcion || "Sin descripción disponible."}
      </Section>

      {/* 📍 Ubicación */}
      <Section title="Ubicación" icon={<MapPin size={16} />}>
        <p className="text-gray-700 mb-2">
          {reporte.direccion || "Sin dirección registrada"} <br />
          {reporte.ubicacion_lat && (
            <small className="text-gray-500">
              ({reporte.ubicacion_lat}, {reporte.ubicacion_lng})
            </small>
          )}
        </p>

        {/* 🗺️ Mapa */}
        {reporte.ubicacion_lat && reporte.ubicacion_lng && (
          <MapContainer
            center={[reporte.ubicacion_lat, reporte.ubicacion_lng]}
            zoom={15}
            className="h-64 w-full rounded-lg shadow-md"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            <Marker
              position={[reporte.ubicacion_lat, reporte.ubicacion_lng]}
              icon={markerIcon}
            >
              <Popup>
                <strong>{reporte.titulo}</strong> <br />
                {reporte.direccion || "Ubicación del reporte"}
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </Section>

      {/* 🖼️ Archivos */}
      {archivos.length > 0 && (
        <Section title="Archivos adjuntos" icon={<ImageIcon size={16} />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {archivos.map((file, i) => {
              const url = `http://localhost:5000/uploads/${file}`;
              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
              const isVideo = /\.(mp4|mov|avi)$/i.test(file);
              const isPDF = /\.pdf$/i.test(file);

              return (
                <div
                  key={i}
                  className="border rounded-lg overflow-hidden shadow-sm bg-gray-50"
                >
                  {isImage ? (
                    <img
                      src={url}
                      alt={`Evidencia ${i}`}
                      className="w-full h-40 object-cover hover:scale-105 transition"
                    />
                  ) : isVideo ? (
                    <video
                      src={url}
                      controls
                      className="w-full h-40 object-cover"
                    />
                  ) : isPDF ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                      <File size={32} />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm mt-1 hover:underline"
                      >
                        Ver PDF
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                      <File size={28} />
                      <p className="text-xs mt-1">Archivo no compatible</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </motion.div>
  );
}

/* 🧩 Subcomponentes reutilizables */

function InfoItem({ label, value, color = "" }) {
  return (
    <div>
      <h3 className="text-gray-700 font-semibold mb-1">{label}</h3>
      <p className={`text-gray-800 ${color}`}>{value || "—"}</p>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="text-gray-700 bg-gray-50 p-3 rounded-md shadow-sm">
        {children}
      </div>
    </div>
  );
}

function ErrorView({ message, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-red-600">
      <p>{message}</p>
      <button
        onClick={onBack}
        className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
      >
        Volver
      </button>
    </div>
  );
}
