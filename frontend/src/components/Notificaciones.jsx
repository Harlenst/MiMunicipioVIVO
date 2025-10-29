import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaTimes } from "react-icons/fa";
import "../styles/notificaciones.css";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        setCargando(true);
        const res = await axios.get("http://localhost:5000/api/notificaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificaciones(res.data);
      } catch (err) {
        console.error("Error cargando notificaciones:", err);
        setError(
          err.response?.data?.message ||
            "No se pudieron cargar las notificaciones"
        );
      } finally {
        setCargando(false);
      }
    };
    cargarNotificaciones();
  }, []);

  return (
    <div className="notificaciones-container">
      {/* 🔔 Icono de campana */}
      <div className="bell-wrapper" onClick={() => setAbierto(!abierto)}>
        <FaBell className="bell-icon" />
        {notificaciones.length > 0 && (
          <span className="badge">{notificaciones.length}</span>
        )}
      </div>

      {/* 📨 Panel desplegable */}
      {abierto && (
        <div className="dropdown animate">
          <div className="dropdown-header">
            <h4>Notificaciones</h4>
            <button className="mark-read" onClick={() => setNotificaciones([])}>
              Marcar como leídas
            </button>
            <FaTimes
              className="cerrar-btn"
              onClick={() => setAbierto(false)}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="notificaciones-list">
            {cargando && <p className="loading">Cargando...</p>}
            {error && <p className="error">{error}</p>}

            {!cargando && !error && (
              <>
                {notificaciones.length === 0 ? (
                  <p className="sin-notificaciones">
                    No tienes notificaciones nuevas
                  </p>
                ) : (
                  notificaciones.map((n) => (
                    <div key={n.id_notificacion} className="notificacion-item">
                      <div className="texto">
                        <p>
                          <strong>{n.tipo}:</strong> {n.mensaje}
                        </p>
                        <small>
                          {new Date(n.fecha_envio).toLocaleString("es-CO")}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          <div className="ver-todo">
            <button onClick={() => (window.location.href = "/panel/notificaciones")}>
              Ver todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
