// src/pages/Login.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaIdCard, FaCity, FaShieldAlt, FaSignInAlt, FaHome, FaUserPlus } from "react-icons/fa";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cedula: "",
    municipio: "",
    correo: "",
    contrasena: "",
    codigo: ""
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.correo,
          password: form.contrasena
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en login");

      const { token, usuario } = data.data;
      await login(token, usuario);

      setMensaje("Inicio de sesión exitoso. Bienvenido a Municipio Vivo");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/panel/mapa");
      }, 2500);

    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==== LAYOUT COMPLETO ==== */}
      <div className="registro-layout min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

        {/* ==== SIDEBAR INSTITUCIONAL ==== */}
        <aside className="registro-sidebar bg-white shadow-xl border-r border-gray-200 flex flex-col">
          <div className="sidebar-header p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-4"
            >
              <span className="text-white text-3xl font-bold">MV</span>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900">Municipio Vivo</h3>
            <p className="text-sm text-gray-600 mt-1">Portal Ciudadano</p>
          </div>

          <nav className="px-6 space-y-3">
            <button className="nav-btn active flex items-center gap-3">
              <FaSignInAlt /> Iniciar sesión
            </button>
            <button className="nav-btn flex items-center gap-3" onClick={() => navigate("/registro")}>
              <FaUserPlus /> Registrarme
            </button>
          </nav>

          <div className="px-6 mt-6">
            <p className="text-sm text-gray-600">
              ¿Solo quieres ver los reportes?{" "}
              <button
                onClick={() => navigate("/")}
                className="link-azul font-semibold"
                disabled={loading}
              >
                Ver como invitado
              </button>
            </p>
          </div>

          <div className="sidebar-footer mt-auto p-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700">Invitado</p>
            <span className="text-xs text-gray-500">Ciudadano</span>
          </div>
        </aside>

        {/* ==== CONTENIDO PRINCIPAL ==== */}
        <main className="registro-content flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-2xl"
          >
            <div className="registro-card bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <header className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
                <p className="text-gray-600 mt-1">Ingrese sus datos para acceder a su cuenta ciudadana</p>
              </header>

              <form onSubmit={handleSubmit} className="form-grid gap-5">
                {/* CÉDULA */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaIdCard className="w-4 h-4 text-blue-600" />
                    Cédula *
                  </label>
                  <input
                    name="cedula"
                    type="text"
                    value={form.cedula}
                    onChange={handleChange}
                    placeholder="12345678"
                    maxLength="10"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>

                {/* MUNICIPIO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaCity className="w-4 h-4 text-blue-600" />
                    Municipio (Antioquia) *
                  </label>
                  <input
                    name="municipio"
                    type="text"
                    value={form.municipio}
                    onChange={handleChange}
                    placeholder="Ej: Medellín, Bello..."
                    list="municipios-list"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                  <datalist id="municipios-list">
                    <option value="Medellín" />
                    <option value="Bello" />
                    <option value="Itagüí" />
                    <option value="Envigado" />
                    <option value="Rionegro" />
                  </datalist>
                </div>

                {/* CORREO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="w-4 h-4 text-blue-600" />
                    Correo electrónico *
                  </label>
                  <input
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="nombre@dominio.com"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>

                {/* CONTRASEÑA */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaLock className="w-4 h-4 text-blue-600" />
                    Contraseña *
                  </label>
                  <input
                    name="contrasena"
                    type="password"
                    value={form.contrasena}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>

                {/* CÓDIGO DE VERIFICACIÓN */}
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaShieldAlt className="w-4 h-4 text-blue-600" />
                    Verificación de identidad
                  </label>
                  <input
                    name="codigo"
                    type="text"
                    value={form.codigo}
                    onChange={handleChange}
                    placeholder="Código de 6 dígitos"
                    maxLength="6"
                    className="input-field mb-2"
                    disabled={loading}
                  />
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center text-lg font-bold text-gray-700 bg-gray-50"
                      >
                        {form.codigo[i - 1] || ""}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-3 text-center">
                    ¿No recibió el código?{" "}
                    <button
                      type="button"
                      className="text-blue-600 font-semibold hover:underline"
                      disabled={loading}
                      onClick={() => alert("Reenviando código...")}
                    >
                      Reenviar en 40s
                    </button>
                  </p>
                </div>
              </form>

              {/* MENSAJES */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mensaje error mt-5"
                  >
                    {error}
                  </motion.div>
                )}
                {mensaje && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mensaje success mt-5"
                  >
                    {mensaje}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BOTONES */}
              <div className="botones-form mt-6">
                <button
                  type="button"
                  className="btn-volver"
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  Volver
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn-registrar"
                  disabled={loading || !form.correo || !form.contrasena}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      Ingresando...
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>

              {/* ENLACES */}
              <div className="registro-links mt-6 text-center space-y-2">
                <p>
                  ¿Olvidó su contraseña?{" "}
                  <a href="/recuperar" className="link-azul font-semibold">
                    Recuperar acceso
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{" "}
                  <button
                    onClick={() => navigate("/registro")}
                    className="link-azul font-semibold"
                    disabled={loading}
                  >
                    Registrarse
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </main>

        {/* ==== MODAL DE ÉXITO ==== */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="registro-modal"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modal-content"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSignInAlt className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">¡Bienvenido!</h3>
                <p className="text-gray-600 mt-2">Acceso concedido</p>
                <p className="text-sm text-gray-500 mt-1">Redirigiendo al panel...</p>
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}