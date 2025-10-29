import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { XCircle, Upload, Image, Video, ArrowLeft, ArrowRight } from "lucide-react";

export default function Paso3Evidencia({ data, setData, nextStep, prevStep }) {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef();

  // 🧠 Manejo de archivos nuevos (drag & drop o input)
  const handleFiles = (files) => {
    const validFiles = [];
    const previewUrls = [];

    for (const file of files) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("❌ Solo se permiten imágenes o videos.");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("⚠️ El archivo supera los 10 MB permitidos.");
        continue;
      }
      validFiles.push(file);
      previewUrls.push({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      });
    }

    if (validFiles.length) {
      setError("");
      setData({ ...data, archivos: validFiles });
      setPreviews(previewUrls);
    }
  };

  const handleFileChange = (e) => handleFiles(e.target.files);

  // 📤 Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
    const nuevosArchivos = data.archivos.filter((_, i) => i !== index);
    const nuevasPreviews = previews.filter((_, i) => i !== index);
    setData({ ...data, archivos: nuevosArchivos });
    setPreviews(nuevasPreviews);
  };

  return (
    <motion.div
      className="paso-contenido"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <h3 className="titulo-paso text-[#1565c0] mb-3 text-lg font-semibold">
        Paso 3: Evidencia del reporte
      </h3>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 rounded-xl p-6 text-center cursor-pointer transition"
      >
        <Upload className="mx-auto mb-2 text-blue-500" size={36} />
        <p className="text-blue-700 font-medium">Arrastra tus archivos aquí o haz clic para subir</p>
        <p className="text-xs text-gray-500 mt-1">Formatos permitidos: JPG, PNG, MP4 (máx. 10 MB)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* 🖼️ Previsualización */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {previews.map((file, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="relative border rounded-lg overflow-hidden shadow-sm group"
            >
              {file.type.startsWith("image/") ? (
                <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
              ) : (
                <video src={file.url} className="w-full h-32 object-cover" controls />
              )}

              <button
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                title="Eliminar archivo"
              >
                <XCircle size={18} />
              </button>

              <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-xs p-1 truncate">
                {file.name}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!previews.length && (
        <p className="text-sm text-gray-500 italic text-center mt-3">
          No has subido ninguna evidencia todavía.
        </p>
      )}

      {/* ⚠️ Error */}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* 🔘 Navegación */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevStep}
          className="btn-secundario flex items-center gap-1 text-gray-700 hover:text-blue-700 transition"
        >
          <ArrowLeft size={18} /> Atrás
        </button>
        <button
          onClick={nextStep}
          className="btn-primario flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Continuar a Confirmación <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
