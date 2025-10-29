import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/registro.css";

export default function Recuperar() {
  const [correo, setCorreo] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [token, setToken] = useState("");
  const [fase, setFase] = useState(1); // 1 = solicitud, 2 = restablecer
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  /* =============================
     🔹 Enviar correo de recuperación
  ============================= */
  const solicitarRecuperacion = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/recuperar", {
        email: correo,
      });
      setMensaje(res.data.message || "📩 Se ha enviado un enlace a tu correo.");
      setFase(2);
    } catch (err) {
      console.error("❌ Error al enviar correo:", err);
      setError(err.response?.data?.message || "Error al enviar correo.");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     🔹 Restablecer contraseña
  ============================= */
  const restablecerContrasena = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (nuevaPass !== confirmarPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/restablecer/${token}`,
        { nuevaPass }
      );

      setMensaje(res.data.message || "✅ Contraseña restablecida correctamente.");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2500);
    } catch (err) {
      console.error("❌ Error al restablecer:", err);
      setError(err.response?.data?.message || "Error al restablecer contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-layout">
      {/* ==== SIDEBAR ==== */}
      <aside className="registro-sidebar">
        <div className="sidebar-header">
          <img src="/logo_municipio.png" alt="Logo" />
          <h3>Municipio Vivo</h3>
        </div>
        <nav>
          <button className="nav-btn" onClick={() => navigate("/login")}>
            🔐 Iniciar sesión
          </button>
          <button className="nav-btn" onClick={() => navigate("/registro")}>
            🧾 Registrarme
          </button>
          <button className="nav-btn active">🔁 Recuperar acceso</button>
        </nav>
      </aside>

      {/* ==== CONTENIDO ==== */}
      <main className="registro-content">
        <header className="registro-navbar">
          <h2>Recuperar contraseña</h2>
          <span>Restaura el acceso a tu cuenta ciudadana</span>
        </header>

        <div className="registro-form-wrapper">
          <div className="registro-card">
            {fase === 1 && (
              <form onSubmit={solicitarRecuperacion}>
                <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
                  <div>
                    <label>Correo electrónico registrado</label>
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="nombre@dominio.com"
                      required
                    />
                  </div>
                </div>

                {error && <p className="mensaje error fade-in">{error}</p>}
                {mensaje && <p className="mensaje success fade-in">{mensaje}</p>}

                <div className="botones-form">
                  <button
                    type="button"
                    className="btn-volver"
                    onClick={() => navigate("/login")}
                  >
                    Volver
                  </button>
                  <button type="submit" className="btn-registrar" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar enlace"}
                  </button>
                </div>
              </form>
            )}

            {fase === 2 && (
              <form onSubmit={restablecerContrasena}>
                <div className="form-grid">
                  <div>
                    <label>Token recibido en el correo</label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Pega aquí el código del correo"
                      required
                    />
                  </div>
                  <div>
                    <label>Nueva contraseña</label>
                    <input
                      type="password"
                      value={nuevaPass}
                      onChange={(e) => setNuevaPass(e.target.value)}
                      placeholder="Nueva contraseña"
                      required
                    />
                  </div>
                  <div>
                    <label>Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      value={confirmarPass}
                      onChange={(e) => setConfirmarPass(e.target.value)}
                      placeholder="Confirma la nueva contraseña"
                      required
                    />
                  </div>
                </div>

                {error && <p className="mensaje error fade-in">{error}</p>}
                {mensaje && <p className="mensaje success fade-in">{mensaje}</p>}

                <div className="botones-form">
                  <button
                    type="button"
                    className="btn-volver"
                    onClick={() => setFase(1)}
                  >
                    Volver atrás
                  </button>
                  <button type="submit" className="btn-registrar" disabled={loading}>
                    {loading ? "Guardando..." : "Restablecer contraseña"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* ==== MODAL CONFIRMACIÓN ==== */}
      {showModal && (
        <div className="registro-modal">
          <div className="modal-content">
            <h3>✅ Contraseña actualizada</h3>
            <p>Tu acceso ha sido restablecido correctamente.</p>
          </div>
        </div>
      )}
    </div>
  );
}
