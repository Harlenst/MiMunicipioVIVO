import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaMap,
  FaClipboardList,
  FaChartBar,
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
  FaAddressBook,
  FaCog,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PanelLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const menuItems = [
    { icon: FaMap, label: "Mapa", path: "/panel/mapa" },
    { icon: FaClipboardList, label: "Reportes", path: "/panel/reportes" },
    { icon: FaChartBar, label: "Estadísticas", path: "/panel/estadisticas" },
    { icon: FaAddressBook, label: "Chat", path: "/panel/chat/:id_reporte" },
  ];

  const dropdownItems = [
    { icon: FaUser, label: "Perfil", path: "/panel/perfil" },
    { icon: FaBell, label: "Notificaciones", path: "/panel/notificaciones" },
    { icon: FaClipboardList, label: "Mis Reportes", path: "/panel/mis-reportes" },
    { icon: FaCog, label: "Configuración", path: "/panel/configuracion" },
    { icon: FaSignOutAlt, label: "Cerrar Sesión", action: () => handleLogout() },
  ];

  // Disparar resize para Leaflet
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [sidebarOpen]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const isActive = (path) => location.pathname.startsWith(path.replace(":id_reporte", ""));

  return (
    <div className="relative h-screen bg-gray-100 overflow-hidden">
      {/* NAVBAR BLANCA - ELEGANTE */}
      <motion.header
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 h-16 bg-white text-gray-800 z-50 shadow-sm border-b border-gray-200"
      >
        <div className="flex items-center h-full px-4">
          {/* Botón hamburguesa */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaBars className="h-6 w-6 text-gray-700" />
          </motion.button>

          {/* Logo + Título */}
          <div className="flex items-center gap-3 ml-4">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">MV</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Mi Municipio Vivo</h1>
          </div>

          <div className="flex-1" />

          {/* AVATAR + DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleDropdown}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {/* Avatar */}
              <div className="relative">
                {user?.foto_perfil ? (
                  <img
                    src={user.foto_perfil}
                    alt={user.nombre}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-xs ring-2 ring-gray-200">
                    {getInitials(user?.nombre)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
              <span className="text-sm font-medium hidden md:block">
                {user?.nombre?.split(" ")[0]}
              </span>
              <FaChevronDown className="h-4 w-4 text-gray-600 hidden md:block" />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                >
                  {dropdownItems.map((item, i) => (
                    <div key={item.label}>
                      {item.path ? (
                        <Link
                          to={item.path}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <item.icon className="mr-2 h-4 w-4 text-gray-600" />
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            item.action();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </button>
                      )}
                      {i === dropdownItems.length - 2 && (
                        <div className="h-px bg-gray-200 mx-4 my-1"></div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* SIDEBAR - MISMO TAMAÑO w-64 */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out overflow-y-auto`}
      >
        <nav className="flex-1 px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-blue-50 text-blue-900 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: active ? 360 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${active ? "text-blue-900" : "text-gray-600"}`} />
                  </motion.div>
                  <span>{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900 rounded-r-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            © 2025 Alcaldía Municipal
          </p>
        </div>
      </motion.div>

      {/* OVERLAY MÓVIL */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* MAIN - 100% IGUAL AL ORIGINAL */}
      <main
        className={`mt-16 h-[calc(100vh-4rem)] transition-all duration-200 ease-in-out ${
          sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
        } ${location.pathname === "/panel/mapa" ? "p-0 overflow-hidden" : "p-6 overflow-auto"}`}
      >
        <Outlet />
      </main>
    </div>
  );
}