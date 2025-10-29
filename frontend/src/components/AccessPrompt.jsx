import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AccessPrompt() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/"); // 🔹 Cierra el modal y vuelve al mapa público
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
      >
        {/* 🔹 Botón de cierre */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          🔒 Acceso restringido
        </h2>
        <p className="text-gray-600 mb-6">
          Para acceder a esta sección, inicia sesión o crea una cuenta nueva.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/registro")}
            className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Registrarme
          </button>
        </div>

        {/* 👇 Texto informativo opcional */}
        <p className="text-sm text-gray-400 mt-6">
          O continúa como visitante en el mapa público.
        </p>
      </motion.div>
    </div>
  );
}
