import { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaPlusCircle } from "react-icons/fa";
import ModalCrearReporte from "../components/ModalCrearReporte";
import "../styles/reportes.css";

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarReportes = async () => {
    try {
      const params = {};
      if (categoria) params.categoria = categoria;
      if (estado) params.estado = estado;

      const res = await axios.get("http://localhost:5000/api/reportes", { params });
      setReportes(res.data);
    } catch (err) {
      console.error("Error al cargar reportes:", err);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, [categoria, estado]);

  return (
    <div className="reportes-container">
      {/* ===== HEADER ===== */}
      <header className="reportes-header">
        <h2>📋 Reportes Ciudadanos</h2>
        <button
          className="nuevo-reporte-btn"
          onClick={() => setMostrarModal(true)}
        >
          <FaPlusCircle /> Nuevo Reporte
        </button>
      </header>

      {/* ===== FILTROS ===== */}
      <div className="filtros-reportes">
        <div className="filtro">
          <FaFilter className="icon" />
          <label>Categoría:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas</option>
            <option value="Infraestructura">Infraestructura</option>
            <option value="Aseo">Aseo</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Agua">Agua</option>
          </select>
        </div>

        <div className="filtro">
          <label>Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="Recibido">Recibido</option>
            <option value="En gestión">En gestión</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
      </div>

      {/* ===== LISTA ===== */}
      <div className="lista-reportes">
        {reportes.length === 0 ? (
          <p className="sin-reportes">No hay reportes disponibles</p>
        ) : (
          reportes.map((rep) => (
            <div key={rep.id_reporte} className="reporte-card">
              <div className="reporte-header">
                <h3>{rep.titulo}</h3>
                <span className={`estado ${rep.estado.toLowerCase()}`}>{rep.estado}</span>
              </div>
              <p className="descripcion">{rep.descripcion}</p>
              <div className="reporte-footer">
                <small>📍 {rep.direccion || "Ubicación no especificada"}</small>
                <small>📅 {new Date(rep.fecha_creacion).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== MODAL CREAR REPORTE ===== */}
      {mostrarModal && (
        <ModalCrearReporte
          onClose={() => setMostrarModal(false)}
          onReporteCreado={() => {
            setMostrarModal(false);
            cargarReportes();
          }}
        />
      )}
    </div>
  );
}
