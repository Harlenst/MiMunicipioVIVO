import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Lightbulb,
  Trash2,
  Shield,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const categorias = [
  { nombre: "Vías y baches", icono: <Wrench size={22} color="#1976d2" /> },
  { nombre: "Alumbrado público", icono: <Lightbulb size={22} color="#ffb300" /> },
  { nombre: "Residuos y limpieza", icono: <Trash2 size={22} color="#43a047" /> },
  { nombre: "Seguridad", icono: <Shield size={22} color="#e53935" /> },
];

export default function Paso2Detalles({ data, setData, nextStep, prevStep }) {
  const [error, setError] = useState("");

  const handleContinuar = () => {
    if (!data.categoria || !data.titulo.trim() || !data.descripcion.trim()) {
      setError("⚠️ Por favor completa todos los campos antes de continuar.");
      return;
    }
    setError("");
    nextStep();
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
        Paso 2: Detalles del problema
      </h3>

      {/* === CATEGORÍAS === */}
      <div className="campo">
        <label className="block mb-2 font-medium">Categoría</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categorias.map((cat) => (
            <motion.button
              key={cat.nombre}
              whileTap={{ scale: 0.95 }}
              onClick={() => setData({ ...data, categoria: cat.nombre })}
              className={`p-3 flex flex-col items-center justify-center rounded-xl border text-sm font-medium transition ${
                data.categoria === cat.nombre
                  ? "bg-blue-100 border-blue-500 text-blue-700 shadow-md"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat.icono}
              <span className="mt-1">{cat.nombre}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* === TÍTULO === */}
      <div className="campo mt-4">
        <label className="block mb-2 font-medium">Título</label>
        <input
          className="input w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ej: Hueco grande frente al parque principal"
          value={data.titulo}
          onChange={(e) => setData({ ...data, titulo: e.target.value })}
        />
      </div>

      {/* === DESCRIPCIÓN === */}
      <div className="campo mt-4">
        <label className="block mb-2 font-medium">Descripción</label>
        <textarea
          className="input w-full border rounded-md p-2 h-28 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Describe brevemente el problema..."
          value={data.descripcion}
          onChange={(e) => setData({ ...data, descripcion: e.target.value })}
        />
        <div className="text-sm text-gray-500 mt-1">
          {data.descripcion.length}/300 caracteres
        </div>
      </div>

      {/* === PRIORIDAD === */}
      <div className="campo mt-4">
        <label className="block mb-2 font-medium">Prioridad</label>
        <div className="flex gap-3">
          {["Baja", "Media", "Alta"].map((nivel) => (
            <button
              key={nivel}
              onClick={() => setData({ ...data, prioridad: nivel })}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                // ✅ Usa “Media” solo como fallback visual si data.prioridad está vacía
                (data.prioridad || "Media") === nivel
                  ? nivel === "Alta"
                    ? "bg-red-100 border-red-500 text-red-700"
                    : nivel === "Media"
                    ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                    : "bg-green-100 border-green-500 text-green-700"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {nivel}
            </button>
          ))}
        </div>
      </div>

      {/* === ERROR === */}
      {error && (
        <div className="mt-3 flex items-center text-red-600 text-sm">
          <AlertTriangle size={16} className="mr-2" /> {error}
        </div>
      )}

      {/* === ACCIONES === */}
      <div className="acciones mt-6 flex justify-between">
        <button
          onClick={prevStep}
          className="btn-secundario flex items-center gap-1 text-gray-700 hover:text-blue-700 transition"
        >
          <ArrowLeft size={18} /> Atrás
        </button>
        <button
          onClick={handleContinuar}
          className="btn-primario flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Continuar a Evidencia <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
