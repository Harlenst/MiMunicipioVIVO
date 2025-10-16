import { useState } from "react";
import axios from "axios";

export default function Registro() {
  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    municipio: "",
    tiempo: "",
    terminos: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones frontend
    if (form.password !== form.confirmPassword) {
      setError("❌ Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError("❌ Contraseña debe tener min 8 chars, una mayúscula y un número");
      return;
    }
    if (!form.terminos) {
      setError("❌ Debes aceptar los términos y condiciones");
      return;
    }
    if (!form.municipio) {
      setError("❌ El municipio es obligatorio");
      return;
    }

    setLoading(true);
    setError(null);

    // Crear objeto sin confirmPassword
    const { confirmPassword, ...dataToSend } = form;

    try {
      console.log("📤 Enviando datos:", dataToSend); // DEBUG

      // Usar el endpoint correcto (coincide con el backend original)
      const res = await axios.post("http://localhost:5000/api/auth/register", dataToSend);

      console.log("✅ Respuesta:", res.data); // DEBUG
      alert("✅ Registro exitoso. Revisa tu correo para verificar tu cuenta.");

      // Limpiar formulario
      setForm({
        cedula: "",
        nombre: "",
        email: "",
        password: "",
        confirmPassword: "",
        municipio: "",
        tiempo: "",
        terminos: false,
      });
    } catch (err) {
      console.error("❌ ERROR COMPLETO:", err); // DEBUG DETALLADO
      if (err.response?.status === 400) {
        setError(`❌ ${err.response.data.message || "Datos inválidos"}`);
      } else if (err.response?.status === 404) {
        setError("❌ Endpoint no encontrado. Verifica el servidor.");
      } else {
        setError(`❌ Error: ${err.response?.data?.message || err.message || "Error desconocido"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-2xl w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>

        {/* Mostrar error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3">
            {error}
          </div>
        )}

        <input
          type="text"
          name="cedula"
          placeholder="Cédula"
          value={form.cedula}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
          disabled={loading}
        />

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
          disabled={loading}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
          disabled={loading}
        />

        <input
          type="text"
          name="municipio"
          placeholder="Municipio"
          value={form.municipio}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
          disabled={loading}
        />

        <select
          name="tiempo"
          value={form.tiempo}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          disabled={loading}
        >
          <option value="">¿Desde hace cuánto vive en el municipio?</option>
          <option>Menos de 1 año</option>
          <option>1 a 5 años</option>
          <option>Más de 5 años</option>
        </select>

        <label className="flex items-center mb-3 text-sm">
          <input
            type="checkbox"
            name="terminos"
            checked={form.terminos}
            onChange={handleChange}
            disabled={loading}
            className="mr-2"
          />
          <span>Acepto términos y tratamiento de datos</span>
        </label>

        <button
          type="submit"
          disabled={loading || !form.terminos}
          className={`w-full p-2 rounded ${
            loading || !form.terminos
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "⏳ Registrando..." : "✅ Registrarme"}
        </button>

        <p className="text-sm text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}