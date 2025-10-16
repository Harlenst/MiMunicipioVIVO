import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cedula: "",
    municipio: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.token);
      alert("Inicio de sesión exitoso ✅");
      navigate("/panel/mapa");
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales incorrectas ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ===== Sidebar ===== */}
      <aside className="login-sidebar">
        <div className="logo-container">
          <img
            src="https://cdn-icons-png.flaticon.com/512/639/639365.png"
            alt="Logo Municipio Vivo"
          />
          <h1>Municipio Vivo</h1>
        </div>
        <div className="menu-accesso">
          <h3>Acceso</h3>
          <button className="active-btn">🔑 Iniciar sesión</button>
        </div>
        <footer>
          <small>Invitado</small>
          <p>Ciudadano</p>
        </footer>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="login-content">
        {/* Barra superior con búsqueda y ayuda */}
        <div className="top-bar">
          <input
            type="text"
            placeholder="🔍 Buscar en Municipio Vivo"
            className="search-bar"
          />
          <button className="help-btn">❓ Ayuda</button>
        </div>

        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Iniciar sesión</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-msg">{error}</p>}

            {/* === Cédula y Municipio === */}
            <div className="form-grid">
              <div className="form-group">
                <label>Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  placeholder="1234567890"
                  value={form.cedula}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Municipio (Departamento de Antioquia)</label>
                <input
                  type="text"
                  name="municipio"
                  placeholder="Ej: Medellín, Bello, Itagüí..."
                  value={form.municipio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* === Correo y Contraseña === */}
            <div className="form-grid">
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  placeholder="nombre@dominio.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* === Acciones === */}
            <div className="acciones-login">
              <a href="/recuperar" className="link">
                ¿Olvidó su contraseña?
              </a>
              <button type="submit" disabled={loading}>
                {loading ? "Cargando..." : "Entrar"}
              </button>
            </div>

            <small className="nota-acceso">
              Para acceder, debe ingresar su cédula, el municipio del
              departamento de Antioquia donde reside y sus credenciales.
            </small>
          </form>
        </div>
      </main>
    </div>
  );
}
