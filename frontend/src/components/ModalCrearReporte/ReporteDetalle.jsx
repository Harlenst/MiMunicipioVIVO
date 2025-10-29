import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function ReporteDetalle() {
  const { id } = useParams();
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/reportes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReporte(res.data.reporte || res.data);
      } catch (err) {
        console.error("Error al cargar reporte:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchReporte();
  }, [id]);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        Cargando reporte...
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-red-500">
        <AlertTriangle className="w-8 h-8 mb-2" />
        No se encontró el reporte solicitado.
        <button
          onClick={() => navigate("/")}
          className="mt-3 text-blue-600 hover:underline"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const {
    categoria,
    titulo,
    descripcion,
    prioridad,
    direccion,
    ubicacion_lat,
    ubicacion_lng,
    estado,
    fecha_creacion,
    archivos,
  } = reporte;

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-700 mb-5"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Volver
      </button>

      {/* Encabezado */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-5 border">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          #{reporte.id_reporte} — {titulo || "Reporte sin título"}
        </h1>
        <p className="text-gray-600 text-sm mb-1">
          <Clock className="inline-block w-4 h-4 mr-1" />
          {new Date(fecha_creacion).toLocaleString()}
        </p>
        <span
          className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
            estado === "Recibido"
              ? "bg-blue-100 text-blue-700"
              : estado === "En proceso"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {estado}
        </span>
      </div>

      {/* Información general */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-gray-50 rounded-xl p-5 shadow-sm space-y-2">
          <p>
            <strong className="text-gray-700">Categoría:</strong>{" "}
            <span className="text-blue-700">{categoria}</span>
          </p>
          <p>
            <strong className="text-gray-700">Descripción:</strong>{" "}
            <span className="text-gray-700">{descripcion}</span>
          </p>
          <p>
            <strong className="text-gray-700">Prioridad:</strong>{" "}
            <span
              className={`${
                prioridad === "Alta"
                  ? "text-red-600 font-semibold"
                  : prioridad === "Media"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {prioridad}
            </span>
          </p>
          <p className="flex items-start">
            <MapPin className="w-4 h-4 mt-1 mr-1 text-blue-600" />
            <span>
              {direccion}
              <br />
              <small className="text-gray-500">
                ({ubicacion_lat?.toFixed(5)}, {ubicacion_lng?.toFixed(5)})
              </small>
            </span>
          </p>
        </div>

        {/* Mapa */}
        <div className="rounded-xl overflow-hidden shadow-md h-64">
          <MapContainer
            center={[ubicacion_lat || 0, ubicacion_lng || 0]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            <Marker position={[ubicacion_lat, ubicacion_lng]}>
              <Popup>{titulo || "Ubicación del reporte"}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Evidencias */}
      {archivos && archivos.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Evidencias
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {archivos.map((file, i) => {
              const esImagen = file.endsWith(".jpg") || file.endsWith(".png");
              const url = `http://localhost:5000/uploads/${file}`;
              return (
                <div
                  key={i}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {esImagen ? (
                    <img
                      src={url}
                      alt={`Evidencia ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <video
                      src={url}
                      controls
                      className="w-full h-32 object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
