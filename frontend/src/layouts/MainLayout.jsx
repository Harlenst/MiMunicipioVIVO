// src/layouts/MainLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaMap, FaSignInAlt } from "react-icons/fa";

export default function MainLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    ["/login", "/registro", "/recuperar"].includes(location.pathname);

  // Redirigir si ya está logueado y entra a login/registro
  useEffect(() => {
    if (user && isAuthPage) {
      navigate("/panel/mapa", { replace: true });
    }
  }, [user, isAuthPage, navigate]);

  // PÁGINAS DE AUTENTICACIÓN (sin navbar)
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      
      {/* NAVBAR PARA INVITADOS (h-16) */}
      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg z-50 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 flex justify-between w-full items-center">

          {/* LOGO + TÍTULO */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md"
            >
              <span className="text-white text-xl font-bold">MV</span>
            </motion.div>
            <motion.span
              className="font-bold text-lg group-hover:text-blue-100 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Municipio Vivo
            </motion.span>
          </Link>

          {/* ENLACES INVITADO */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <FaMap className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
            >
              <FaSignInAlt className="w-4 h-4" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Entrar</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}