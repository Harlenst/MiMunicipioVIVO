// src/pages/Registro.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaIdCard, FaUser, FaVenusMars, FaEnvelope, FaPhone, FaHome,
  FaMapMarkerAlt, FaCity, FaLock, FaCheckCircle, FaArrowLeft, FaUserPlus,
  FaSignInAlt
} from "react-icons/fa";

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo_sociedad: "Natural",
    tipo_entidad: "Ciudadano",
    tipo_identificacion: "",
    numero_identificacion: "",
    nombre: "",
    genero: "",
    correo: "",
    direccion: "",
    barrio: "",
    telefono1: "",
    telefono2: "",
    pais: "Colombia",
    departamento: "Antioquia",
    ciudad: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMensaje("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.contrasena !== form.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/registro", form);

      setMensaje("Registro exitoso. Bienvenido a Municipio Vivo");
      setShowModal(true);

      setForm({
        tipo_sociedad: "Natural",
        tipo_entidad: "Ciudadano",
        tipo_identificacion: "",
        numero_identificacion: "",
        nombre: "",
        genero: "",
        correo: "",
        direccion: "",
        barrio: "",
        telefono1: "",
        telefono2: "",
        pais: "Colombia",
        departamento: "Antioquia",
        ciudad: "",
        contrasena: "",
        confirmarContrasena: "",
      });

      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar. Intenta nuevamente.");
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
              <FaUserPlus /> Registro
            </button>
            <button className="nav-btn flex items-center gap-3" onClick={() => navigate("/login")}>
              <FaSignInAlt /> Iniciar sesión
            </button>
          </nav>

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
            className="w-full max-w-4xl"
          >
            <div className="registro-card bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <header className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Registro ciudadano</h2>
                <p className="text-gray-600 mt-1">Plataforma de participación y transparencia municipal</p>
              </header>

              <form onSubmit={handleSubmit} className="form-grid gap-5">
                {/* TIPO DOCUMENTO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaIdCard className="w-4 h-4 text-blue-600" />
                    Tipo de documento *
                  </label>
                  <select
                    name="tipo_identificacion"
                    value={form.tipo_identificacion}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="NIT">NIT</option>
                  </select>
                </div>

                {/* NÚMERO DOCUMENTO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaIdCard className="w-4 h-4 text-blue-600" />
                    Número de documento *
                  </label>
                  <input
                    type="text"
                    name="numero_identificacion"
                    value={form.numero_identificacion}
                    onChange={handleChange}
                    placeholder="12345678"
                    className="input-field"
                    required
                  />
                </div>

                {/* NOMBRE */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="w-4 h-4 text-blue-600" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: María Fernanda Pérez"
                    className="input-field"
                    required
                  />
                </div>

                {/* GÉNERO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaVenusMars className="w-4 h-4 text-blue-600" />
                    Género *
                  </label>
                  <select
                    name="genero"
                    value={form.genero}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro / Prefiere no decir</option>
                  </select>
                </div>

                {/* CORREO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="w-4 h-4 text-blue-600" />
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="nombre@dominio.com"
                    className="input-field"
                    required
                  />
                </div>

                {/* TELÉFONO 1 */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaPhone className="w-4 h-4 text-blue-600" />
                    Teléfono principal *
                  </label>
                  <input
                    type="text"
                    name="telefono1"
                    value={form.telefono1}
                    onChange={handleChange}
                    placeholder="3001234567"
                    className="input-field"
                    required
                  />
                </div>

                {/* TELÉFONO 2 */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaPhone className="w-4 h-4 text-blue-600" />
                    Teléfono secundario (opcional)
                  </label>
                  <input
                    type="text"
                    name="telefono2"
                    value={form.telefono2}
                    onChange={handleChange}
                    placeholder="3009876543"
                    className="input-field"
                  />
                </div>

                {/* DIRECCIÓN */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaHome className="w-4 h-4 text-blue-600" />
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Calle 45 #12-34"
                    className="input-field"
                    required
                  />
                </div>

                {/* BARRIO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                    Barrio
                  </label>
                  <input
                    type="text"
                    name="barrio"
                    value={form.barrio}
                    onChange={handleChange}
                    placeholder="Ej: El Poblado"
                    className="input-field"
                  />
                </div>

                {/* CIUDAD */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaCity className="w-4 h-4 text-blue-600" />
                    Ciudad / Municipio *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    placeholder="Ej: Medellín, Bello..."
                    className="input-field"
                    required
                  />
                </div>

                {/* CONTRASEÑA */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaLock className="w-4 h-4 text-blue-600" />
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className="input-field"
                    required
                  />
                </div>

                {/* CONFIRMAR CONTRASEÑA */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaLock className="w-4 h-4 text-blue-600" />
                    Confirmar contraseña *
                  </label>
                  <input
                    type="password"
                    name="confirmarContrasena"
                    value={form.confirmarContrasena}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </form>

              {/* MENSAJES */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mensaje error mt-6"
                  >
                    {error}
                  </motion.p>
                )}
                {mensaje && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mensaje success mt-6"
                  >
                    {mensaje}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* BOTONES */}
              <div className="botones-form mt-8">
                <button
                  type="button"
                  className="btn-volver"
                  onClick={() => navigate("/login")}
                  disabled={loading}
                >
                  <FaArrowLeft className="mr-2" /> Volver al inicio
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn-registrar"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      Registrando...
                    </span>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2" /> Registrarse
                    </>
                  )}
                </button>
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
                  <FaCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">¡Registro exitoso!</h3>
                <p className="text-gray-600 mt-2">Tu cuenta ha sido creada correctamente.</p>
                <p className="text-sm text-gray-500 mt-1">Redirigiendo al inicio de sesión...</p>
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