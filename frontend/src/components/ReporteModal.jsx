import { useState } from "react";
import axios from "axios";

export default function ReporteModal({ onClose }) {
  const [form, setForm] = useState({
    tipo: "",
    descripcion: "",
    latitud: "",
    longitud: "",
    evidencia: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para reportar un problema");
      return;
    }

    // Validación básica de coordenadas
    const lat = parseFloat(form.latitud);
    const lng = parseFloat(form.longitud);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("Coordenadas inválidas");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));

      await axios.post("http://localhost:5000/api/reportes", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Reporte enviado correctamente ✅");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al enviar el reporte ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[450px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Reportar un problema</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecciona tipo de problema</option>
            <option>Hueco</option>
            <option>Basura</option>
            <option>Alumbrado</option>
            <option>Seguridad</option>
          </select>

          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe brevemente el problema"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 h-24 resize-none"
            required
          />

          <div className="flex gap-4">
            <input
              type="number"
              name="latitud"
              value={form.latitud}
              onChange={handleChange}
              placeholder="Latitud"
              className="border border-gray-300 p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-blue-400"
              step="0.000001"
              required
            />
            <input
              type="number"
              name="longitud"
              value={form.longitud}
              onChange={handleChange}
              placeholder="Longitud"
              className="border border-gray-300 p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-blue-400"
              step="0.000001"
              required
            />
          </div>

          <input
            type="file"
            name="evidencia"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Enviar reporte
          </button>
        </form>
      </div>
    </div>
  );
}