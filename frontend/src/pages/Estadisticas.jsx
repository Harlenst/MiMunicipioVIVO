import React, { useEffect, useState } from "react";
import "../styles/estadisticas.css";
import {
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaInbox,
  FaCommentDots,
} from "react-icons/fa";
import axios from "axios";

export default function Estadisticas() {
  const [resumen, setResumen] = useState({
    total: 0,
    resueltos: 0,
    gestion: 0,
    recibidos: 0,
  });

  const [actividad, setActividad] = useState([]);

  useEffect(() => {
    // Datos simulados (luego puedes traerlos del backend)
    setResumen({
      total: 128,
      resueltos: 46,
      gestion: 38,
      recibidos: 30,
    });
    setActividad([
      { id: 1, texto: "Basurero retirado en Calle 10", estado: "Resuelto" },
      { id: 2, texto: "Brigada enviada a Barrio Norte", estado: "En gestión" },
      { id: 3, texto: "Nuevo reporte: semáforo dañado", estado: "Recibido" },
    ]);
  }, []);

  const getColor = (estado) => {
    switch (estado) {
      case "Resuelto":
        return "estado verde";
      case "En gestión":
        return "estado naranja";
      default:
        return "estado gris";
    }
  };

  return (
    <div className="main-content">
      <div className="page-scroll">
        <div className="estadisticas-dashboard animate">
          <div className="dashboard-header">
            <h2>
              <FaChartBar /> Panel de Transparencia
            </h2>
            <div className="dashboard-tabs">
              <button className="active">Mis reportes</button>
              <button>Todos</button>
              <button>Resultados</button>
            </div>
          </div>

          {/* ---- TARJETAS DE RESUMEN ---- */}
          <div className="dashboard-cards animate">
            <div className="dash-card">
              <FaCheckCircle className="icon verde" />
              <div>
                <h4>Resueltos</h4>
                <p>{resumen.resueltos} / {resumen.total}</p>
              </div>
            </div>
            <div className="dash-card">
              <FaClock className="icon naranja" />
              <div>
                <h4>En gestión</h4>
                <p>{resumen.gestion} / {resumen.total}</p>
              </div>
            </div>
            <div className="dash-card">
              <FaInbox className="icon azul" />
              <div>
                <h4>Recibidos</h4>
                <p>{resumen.recibidos} / {resumen.total}</p>
              </div>
            </div>
          </div>

          {/* ---- TABLA PRINCIPAL ---- */}
          <div className="tabla-reportes animate">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Reporte</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Votos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    Poste sin luz<br /><small>Calle 23 #15</small>
                  </td>
                  <td><span className="etiqueta naranja">En gestión</span></td>
                  <td>82</td>
                  <td>64</td>
                  <td><button className="btn-accion">Votar</button></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    Punto crítico de basura<br /><small>Barrio Centro</small>
                  </td>
                  <td><span className="etiqueta verde">Resuelto</span></td>
                  <td>90</td>
                  <td>120</td>
                  <td>
                    <button className="btn-accion secundario">Compartir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ---- PANEL LATERAL ---- */}
          <aside className="panel-lateral animate">
            <div className="box resumen">
              <h4>Resumen</h4>
              <p><strong>{resumen.total}</strong> Total de reportes</p>
              <p><strong>{resumen.resueltos}%</strong> Resueltos</p>
              <p><strong>{resumen.gestion}</strong> En gestión</p>
              <p><strong>{resumen.recibidos}</strong> Recibidos</p>
            </div>

            <div className="box actividad">
              <h4>Actividad reciente</h4>
              {actividad.map((a) => (
                <div key={a.id} className="actividad-item">
                  <span className={getColor(a.estado)}></span>
                  <p>{a.texto}</p>
                  <small>{a.estado}</small>
                </div>
              ))}
            </div>

            <div className="box politica">
              <h4>Política de transparencia</h4>
              <p>
                Todos los reportes muestran su estado, tiempos de respuesta y evidencia pública de resolución.
              </p>
            </div>
          </aside>

          {/* ---- BOTÓN FLOTANTE DE CHAT ---- */}
          <button className="btn-chat-flotante animate">
            <FaCommentDots />
            <span>Chat Ciudadano</span>
          </button>
        </div>
      </div>
    </div>
  );
}
