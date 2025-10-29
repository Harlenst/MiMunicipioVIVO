import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Loader2,
  ArrowLeft,
  Send,
  MapPin,
  ImageIcon,
  ExternalLink,
} from "lucide-react";

export default function Paso4Confirmacion({ data, prevStep, onClose }) {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEnviar = async () => {
    setEnviando(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "archivos") {
          data.archivos.forEach((file) => formData.append("archivos", file));
        } else {
          formData.append(key, data[key]);
        }
      });

      const res = await axios.post(
        "http://localhost:5000/api/reportes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTicket(res.data.reporte.id_reporte);
      setEnviado(true);
    } catch (err) {
      console.error(err);
      setError("⚠️ No se pudo enviar el reporte. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  // ✅ Pantalla de éxito
  if (enviado) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center text-center p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CheckCircle className="text-green-500 w-16 h-16 mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold text-green-700 mb-2">
          ¡Reporte enviado con éxito!
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Tu ticket de seguimiento es <strong>#{ticket}</strong>.<br />
          Estado inicial:{" "}
          <span className="text-blue-600 font-medium">Recibido</span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/reportes/${ticket}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Ver mi reporte
          </button>

          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    );
  }

  // ✅ Vista previa antes de enviar
  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Paso 4: Confirmar y Enviar
      </h2>

      {/* 🗂️ Resumen de datos */}
      <div className="border rounded-xl bg-gray-50 p-5 shadow-sm space-y-2">
        <p>
          <strong className="text-gray-700">📂 Categoría:</strong>{" "}
          <span className="text-blue-700">{data.categoria || "No especificada"}</span>
        </p>
        <p>
          <strong className="text-gray-700">📝 Título:</strong>{" "}
          {data.titulo || "Sin título"}
        </p>
        <p>
          <strong className="text-gray-700">📖 Descripción:</strong>{" "}
          <span className="text-gray-700">
            {data.descripcion || "Sin descripción"}
          </span>
        </p>
        <p>
          <strong className="text-gray-700">⚡ Prioridad:</strong>{" "}
          <span
            className={`${
              data.prioridad === "Alta"
                ? "text-red-600 font-semibold"
                : data.prioridad === "Media"
                ? "text-yellow-600 font-medium"
                : "text-green-600"
            }`}
          >
            {data.prioridad || "No asignada"}
          </span>
        </p>
        <p>
          <strong className="text-gray-700 flex items-center gap-1">
            <MapPin size={16} /> Ubicación:
          </strong>
          <span className="ml-5 text-gray-700">
            {data.direccion || "Sin dirección"} <br />
            {data.ubicacion_lat && (
              <small className="text-gray-500">
                ({data.ubicacion_lat.toFixed(5)}, {data.ubicacion_lng.toFixed(5)})
              </small>
            )}
          </span>
        </p>
      </div>

      {/* 🖼️ Vista previa de evidencias */}
      {data.archivos && data.archivos.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
            <ImageIcon size={16} /> Evidencias cargadas:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.archivos.map((file, i) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={i}
                  className="relative border rounded-lg overflow-hidden shadow-sm"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={url}
                      alt={file.name}
                      className="w-full h-28 object-cover"
                    />
                  ) : (
                    <video
                      src={url}
                      className="w-full h-28 object-cover"
                      controls
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <motion.p
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* 🔘 Botones */}
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={prevStep}
          disabled={enviando}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-700 transition"
        >
          <ArrowLeft size={18} /> Atrás
        </button>

        <button
          onClick={handleEnviar}
          disabled={enviando}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white transition ${
            enviando
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {enviando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Enviar reporte
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
