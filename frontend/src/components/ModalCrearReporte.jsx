import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import "../styles/modalReporte.css";

export default function ModalCrearReporte({ onClose, onReporteCreado }) {
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    direccion: "",
    ubicacion_lat: null,
    ubicacion_lng: null,
  });
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const pasosTotales = 4;
  const progreso = (paso / pasosTotales) * 100;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCrearReporte = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/reportes", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const id_reporte = res.data.reporte.id_reporte;

      if (archivo) {
        const formData = new FormData();
        formData.append("file", archivo);
        await axios.post(
          `http://localhost:5000/api/reportes/${id_reporte}/evidencia`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      onReporteCreado();
      onClose();
    } catch (err) {
      console.error("Error al crear reporte:", err);
      alert("⚠️ Error al crear el reporte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const stepAnim = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.35 },
  };

  const etiquetas = ["Ubicación", "Detalles", "Evidencia", "Confirmar"];

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-box"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>📋 Crear reporte ciudadano</h2>
          <button className="btn-cerrar" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="progress-bar-superior">
          <div className="progress-fill-line" style={{ width: `${progreso}%` }} />
          <div className="progress-etapas">
            {etiquetas.map((etiqueta, i) => (
              <div key={i} className={`etapa ${i + 1 <= paso ? "active" : ""}`}>
                <span className="numero">{i + 1}</span>
                <p>{etiqueta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido dinámico */}
        <AnimatePresence mode="wait">
          {paso === 1 && (
            <motion.div key="paso1" className="modal-step" {...stepAnim}>
              <h3>Paso 1: Ubicación</h3>
              <input
                name="direccion"
                placeholder="Ej. Calle 10 #5-25, Barrio Centro"
                value={form.direccion}
                onChange={handleChange}
              />
              <div className="acciones">
                <button
                  className="btn-continuar"
                  onClick={() => setPaso(2)}
                >
                  Continuar <FaArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {paso === 2 && (
            <motion.div key="paso2" className="modal-step" {...stepAnim}>
              <h3>Paso 2: Detalles del reporte</h3>
              <input
                name="titulo"
                placeholder="Título del reporte"
                value={form.titulo}
                onChange={handleChange}
              />
              <textarea
                name="descripcion"
                placeholder="Describe el problema..."
                value={form.descripcion}
                onChange={handleChange}
              />
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">Selecciona categoría</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Aseo">Aseo</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Agua">Agua</option>
              </select>

              <div className="acciones">
                <button className="btn-atras" onClick={() => setPaso(1)}>
                  <FaArrowLeft /> Atrás
                </button>
                <button className="btn-continuar" onClick={() => setPaso(3)}>
                  Continuar <FaArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {paso === 3 && (
            <motion.div key="paso3" className="modal-step" {...stepAnim}>
              <h3>Paso 3: Evidencia</h3>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setArchivo(e.target.files[0])}
              />
              {archivo && <p className="archivo-cargado">📎 {archivo.name}</p>}
              <div className="acciones">
                <button className="btn-atras" onClick={() => setPaso(2)}>
                  <FaArrowLeft /> Atrás
                </button>
                <button className="btn-continuar" onClick={() => setPaso(4)}>
                  Continuar <FaArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {paso === 4 && (
            <motion.div key="paso4" className="modal-step" {...stepAnim}>
              <h3>Paso 4: Confirmar envío</h3>
              <p>Revisa la información antes de enviar:</p>
              <div className="confirm-box">
                <pre>{JSON.stringify(form, null, 2)}</pre>
              </div>
              <div className="acciones">
                <button className="btn-atras" onClick={() => setPaso(3)}>
                  <FaArrowLeft /> Atrás
                </button>
                <button
                  className="btn-continuar enviar"
                  onClick={handleCrearReporte}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : <>Enviar <FaCheck /></>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
