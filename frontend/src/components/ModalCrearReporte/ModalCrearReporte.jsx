import { useState } from "react";
import Paso1Ubicacion from "./Paso1Ubicacion";
import Paso2Detalles from "./Paso2Detalles";
import Paso3Evidencia from "./Paso3Evidencia";
import Paso4Confirmacion from "./Paso4Confirmacion";
import { motion, AnimatePresence } from "framer-motion";
import "./modalReporte.css";

export default function ModalCrearReporte({ onClose }) {
  const [step, setStep] = useState(1);

  // ✅ No inicializamos prioridad en “Media”, la dejamos vacía.
  const [data, setData] = useState({
    ubicacion_lat: null,
    ubicacion_lng: null,
    direccion: "",
    categoria: "",
    titulo: "",
    descripcion: "",
    prioridad: "", // antes era "Media"
    archivos: [],
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const steps = ["Ubicación", "Detalles", "Evidencia", "Confirmar"];

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-box"
      >
        {/* ===== HEADER ===== */}
        <div className="modal-header">
          <h2>📝 Reportar problema ciudadano</h2>
          <button onClick={onClose} className="btn-cerrar">
            ✕
          </button>
        </div>

        {/* ===== PROGRESS BAR ===== */}
        <div className="progress-bar-superior">
          <div
            className="progress-fill-line"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
          <div className="progress-etapas">
            {steps.map((label, i) => (
              <div key={i} className={`etapa ${i + 1 <= step ? "active" : ""}`}>
                <div className="numero">{i + 1}</div>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== STEP CONTENT ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <Paso1Ubicacion data={data} setData={setData} nextStep={nextStep} />
            )}
            {step === 2 && (
              <Paso2Detalles
                data={data}
                setData={setData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 3 && (
              <Paso3Evidencia
                data={data}
                setData={setData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 4 && (
              <Paso4Confirmacion
                data={data}
                prevStep={prevStep}
                onClose={onClose}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
