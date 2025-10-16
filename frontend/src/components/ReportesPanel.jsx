import React from "react";
import "../styles/reportesPanel.css";

export default function ReportesPanel() {
  const reportes = [
    { id: 1, titulo: "Bache en la calle 3", prioridad: "Alta" },
    { id: 2, titulo: "Fuga de agua", prioridad: "Media" },
    { id: 3, titulo: "Alumbrado público dañado", prioridad: "Baja" },
  ];

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h3>📋 Reportes Prioritarios</h3>
        <span className="subtitulo">Incidentes más recientes en tu zona</span>
      </div>

      <div className="reportes-lista">
        {reportes.map((r) => (
          <div key={r.id} className="reporte-card">
            <div className="reporte-info">
              <h4>{r.titulo}</h4>
              <span className={`prioridad ${r.prioridad}`}>
                {r.prioridad}
              </span>
            </div>
            <p className="reporte-descripcion">
              {r.prioridad === "Alta"
                ? "Requiere atención inmediata ⚠️"
                : r.prioridad === "Media"
                ? "Debe atenderse pronto ⏱️"
                : "Puede programarse posteriormente ✅"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
