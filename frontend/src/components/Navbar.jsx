import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaUserCog,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/navbar.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef();

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* ---- IZQUIERDA ---- */}
      <div className="navbar-left">
        <h3 className="navbar-title">🗺️ Mi Municipio Vivo</h3>
      </div>

      {/* ---- CENTRO (Buscador) ---- */}
      <div className="navbar-center">
        <div className="search-bar">
          <FaSearch className="icon-search" />
          <input
            type="text"
            placeholder="Buscar reportes, lugares o ciudadanos..."
          />
        </div>
      </div>

      {/* ---- DERECHA ---- */}
      <div className="navbar-right">
        <div className="icon-wrapper">
          <FaBell className="icon-bell" title="Notificaciones" />
          <span className="notif-badge">3</span>
        </div>

        {/* Usuario */}
        <div className="user-dropdown" ref={menuRef}>
          <div
            className="user-info"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <img
              src={
                user
                  ? "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
                  : "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
              }
              alt="usuario"
            />
            <span>{user ? user.nombre : "Invitado"}</span>
          </div>

          {menuAbierto && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/perfil")}
                  >
                    <FaUserCircle /> Ver perfil
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/configuracion")}
                  >
                    <FaUserCog /> Configuración
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/reportes")}
                  >
                    <FaClipboardList /> Mis reportes
                  </button>
                  <hr />
                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    <FaSignOutAlt /> Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
