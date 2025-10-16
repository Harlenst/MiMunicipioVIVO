import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaChartBar, FaListAlt, FaCog, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import "../styles/sidebar.css";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div>
        {/* ----- HEADER ----- */}
        <div className="sidebar-header">
          <h2>Mi Municipio Vivo</h2>
        </div>

        {/* ----- NAVEGACIÓN ----- */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/panel/mapa"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaHome className="icon" /> Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/panel/reportes"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaListAlt className="icon" /> Reportes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/panel/estadisticas"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaChartBar className="icon" /> Estadísticas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/panel/configuracion"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaCog className="icon" /> Configuración
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* ----- FOOTER ----- */}
      <div className="sidebar-footer">
        {!user ? (
          <>
            <button className="login-btn" onClick={handleLogin}>
              <FaSignInAlt className="icon" /> Iniciar sesión
            </button>
            <p>© 2025 Mi Municipio Vivo</p>
          </>
        ) : (
          <>
            <button className="login-btn logout" onClick={handleLogout}>
              <FaSignOutAlt className="icon" /> Cerrar sesión
            </button>
            <p>© 2025 Mi Municipio Vivo</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
