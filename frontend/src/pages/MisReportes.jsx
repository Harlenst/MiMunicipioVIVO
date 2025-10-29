import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/misReportes.css";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// 🔧 Normalización de estados (incluye "recibido")
function normalizarEstado(e) {
  if (!e) return "pendiente";
  const s = String(e).toLowerCase().trim();
  if (s.includes("recib")) return "recibido";
  if (s.includes("gest")) return "en gestión";
  if (s.includes("proce")) return "en proceso"; // por si llega así desde DB antigua
  if (s.includes("resu")) return "resuelto";
  if (s.includes("pend")) return "pendiente";
  return s;
}

function porcentajeProgreso(estado) {
  const s = normalizarEstado(estado);
  if (s === "pendiente") return 25;
  if (s === "recibido") return 40;
  if (s === "en proceso") return 60;
  if (s === "en gestión") return 80;
  if (s === "resuelto") return 100;
  return 25;
}

export default function MisReportes() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Modales
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalSeguimiento, setMostrarModalSeguimiento] = useState(false);
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
  const [mostrarNoEliminable, setMostrarNoEliminable] = useState(false);

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [reporteNoEditable, setReporteNoEditable] = useState(null);

  // Seguimiento dinámico
  const [eventos, setEventos] = useState([]);
  const [cargandoSeg, setCargandoSeg] = useState(false);
  const [errorSeg, setErrorSeg] = useState("");

  // ==============================
  // 🔹 Obtener reportes del usuario
  // ==============================
  useEffect(() => {
    const fetchReportes = async () => {
      if (!user?.id_usuario) return;
      try {
        setCargando(true);
        const res = await axios.get(
          `http://localhost:5000/api/reportes/usuario/${user.id_usuario}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReportes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Error al obtener reportes:", err);
        setError("No se pudieron cargar tus reportes");
      } finally {
        setCargando(false);
      }
    };
    fetchReportes();
  }, [user, token]);

  // ==============================
  // 🗑️ Eliminar (solo “Resuelto”)
  // ==============================
  const confirmarEliminar = (reporte) => {
    const estado = normalizarEstado(reporte.estado);
    if (estado !== "resuelto") {
      setReporteSeleccionado(reporte);
      setMostrarNoEliminable(true);
      return;
    }
    setReporteSeleccionado(reporte);
    setMostrarModalEliminar(true);
  };

const eliminarReporte = async (id) => {
  try {
    const respuesta = await fetch(`http://localhost:5000/api/reportes/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      throw new Error("Error al eliminar");
    }

    setReportes(reportes.filter((r) => r.id !== id));
    alert("✅ Reporte eliminado correctamente");
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
    alert("Error al eliminar el reporte");
  }
};
  

  // ==============================
  // ✏️ Editar (solo “Recibido”)
  // ==============================
  const editarReporte = (reporte) => {
    const estado = normalizarEstado(reporte.estado);
    if (estado === "recibido") {
      navigate(`/panel/reportes/editar/${reporte.id_reporte}`);
    } else {
      setReporteNoEditable(reporte);
      setMostrarAdvertencia(true);
    }
  };

  // ==============================
  // 📊 Ver seguimiento (con API)
  // ==============================
  const verSeguimiento = async (reporte) => {
    setReporteSeleccionado(reporte);
    setMostrarModalSeguimiento(true);
    setEventos([]);
    setErrorSeg("");
    setCargandoSeg(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reportes/${reporte.id_reporte}/historial`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const arr = Array.isArray(res.data) ? res.data : res.data?.historial || [];
      arr.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setEventos(arr);
    } catch (err) {
      console.warn("ℹ️ Historial no disponible, usando fallback");
      setErrorSeg("No hay historial disponible para este reporte.");
      setEventos([]);
    } finally {
      setCargandoSeg(false);
    }
  };

  // ==============================
  // 📋 Utilidades UI
  // ==============================
  const abrirEnMapas = (lat, lng, proveedor = "google") => {
    if (proveedor === "google") {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else {
      window.open(
        `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`,
        "_blank"
      );
    }
  };

  const copiar = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      setMensaje("Copiado al portapapeles");
      setTimeout(() => setMensaje(""), 1600);
    } catch {
      setError("No se pudo copiar");
      setTimeout(() => setError(""), 1600);
    }
  };

  const getGaleria = (r) => r?.evidencias || r?.imagenes || r?.fotos || [];

  return (
    <div className="misreportes-layout">
      <div className="misreportes-content scrollbar-thin">
        <div className="misreportes-container animate">
          <header className="misreportes-header">
            <div>
              <h2>Mis Reportes</h2>
              <p>Consulta el estado, seguimiento y gestiona tus reportes.</p>
            </div>
          </header>

          {cargando && <p className="estado-cargando">Cargando tus reportes…</p>}
          {error && <p className="mensaje error">{error}</p>}
          {mensaje && <p className="mensaje success">{mensaje}</p>}

          {!cargando && reportes.length === 0 && (
            <p className="sin-reportes">Aún no has realizado ningún reporte.</p>
          )}

          <div className="reportes-lista">
            {reportes.map((r) => {
              const estadoNorm = normalizarEstado(r.estado);
              const puedeEditar = estadoNorm === "recibido";
              const puedeEliminar = estadoNorm === "resuelto";

              return (
                <div key={r.id_reporte} className="reporte-card">
                  <div className="reporte-header">
                    <h4 className="reporte-titulo">{r.titulo}</h4>
                    <span className={`estado-badge ${estadoNorm.replace(" ", "-")}`}>
                      {r.estado || "Pendiente"}
                    </span>
                  </div>

                  <p className="reporte-descripcion">{r.descripcion}</p>

                  <div className="chips">
                    {r.categoria && <span className="chip categoria">{r.categoria}</span>}
                    {r.nivel && <span className="chip nivel">{r.nivel}</span>}
                    <span className="chip id">ID: {r.id_reporte}</span>
                  </div>

                  <div className="reporte-footer">
                    <small>📍 {r.direccion || "Ubicación no especificada"}</small>
                    <small>
                      {r.fecha_creacion
                        ? new Date(r.fecha_creacion).toLocaleDateString("es-CO")
                        : "—"}
                    </small>
                  </div>

                  <div className="reporte-botones">
                    <button
                      className="btn-accion"
                      onClick={() => verSeguimiento(r)}
                      title="Ver seguimiento"
                    >
                      Ver seguimiento
                    </button>

                    <button
                      className="btn-accion"
                      disabled={!puedeEditar}
                      onClick={() => puedeEditar && editarReporte(r)}
                      title={
                        puedeEditar
                          ? "Editar reporte"
                          : "Solo se puede editar cuando el estado es 'Recibido'"
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn-accion"
                      disabled={!puedeEliminar}
                      onClick={() => confirmarEliminar(r)}
                      title={
                        puedeEliminar
                          ? "Eliminar reporte"
                          : "Solo se puede eliminar cuando el estado es 'Resuelto'"
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🗑️ MODAL CONFIRMACIÓN ELIMINAR */}
          {mostrarModalEliminar && (
            <div className="modal-overlay" onMouseDown={() => setMostrarModalEliminar(false)}>
              <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
                <h4>¿Eliminar reporte?</h4>
                <p>
                  Esta acción no se puede deshacer. Confirma que deseas eliminar:{" "}
                  <b>{reporteSeleccionado?.titulo}</b>
                </p>
                <div className="modal-buttons">
                  <button className="btn-primario" onClick={eliminarReporte}>
                    Confirmar
                  </button>
                  <button className="btn-secundario" onClick={() => setMostrarModalEliminar(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ⚠️ MODAL NO ELIMINABLE */}
          {mostrarNoEliminable && (
            <div className="modal-overlay" onMouseDown={() => setMostrarNoEliminable(false)}>
              <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
                <h4>No puedes eliminar este reporte</h4>
                <p>
                  El reporte <b>{reporteSeleccionado?.titulo}</b> no está en estado{" "}
                  <b>Resuelto</b>. Solo los reportes resueltos pueden eliminarse.
                </p>
                <div className="modal-buttons">
                  <button className="btn-primario" onClick={() => setMostrarNoEliminable(false)}>
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ⚠️ MODAL NO EDITABLE */}
          {mostrarAdvertencia && (
            <div className="modal-overlay" onMouseDown={() => setMostrarAdvertencia(false)}>
              <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
                <h4>Reporte no editable</h4>
                <p>
                  El reporte <b>{reporteNoEditable?.titulo}</b> no puede ser modificado porque
                  su estado es <b>{reporteNoEditable?.estado?.toUpperCase()}</b>.
                </p>
                <p className="nota-info">
                  Solo los reportes con estado <b>Recibido</b> pueden editarse.
                </p>
                <div className="modal-buttons">
                  <button className="btn-primario" onClick={() => setMostrarAdvertencia(false)}>
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 📊 MODAL SEGUIMIENTO */}
          {mostrarModalSeguimiento && (
            <div className="modal-overlay" onMouseDown={() => setMostrarModalSeguimiento(false)}>
              <div className="modal-box modal-seguimiento" onMouseDown={(e) => e.stopPropagation()}>
                <div className="cabecera-seguimiento">
                  <div>
                    <h4 className="titulo-seguimiento">{reporteSeleccionado?.titulo}</h4>
                    <p className="detalle-estado">
                      Estado:{" "}
                      <b
                        className={`estado-inline ${normalizarEstado(
                          reporteSeleccionado?.estado
                        ).replace(" ", "-")}`}
                      >
                        {reporteSeleccionado?.estado}
                      </b>
                    </p>
                    <div className="chips">
                      {reporteSeleccionado?.categoria && (
                        <span className="chip categoria">{reporteSeleccionado.categoria}</span>
                      )}
                      {reporteSeleccionado?.nivel && (
                        <span className="chip nivel">{reporteSeleccionado.nivel}</span>
                      )}
                      <span className="chip id">ID: {reporteSeleccionado?.id_reporte}</span>
                    </div>
                  </div>
                </div>

                <div className="barra-progreso">
                  <div
                    className="progreso"
                    style={{ width: `${porcentajeProgreso(reporteSeleccionado?.estado)}%` }}
                  />
                </div>

                <div className="grid-seguimiento">
                  {/* Datos */}
                  <div className="bloque-info card">
                    <h5>Detalles del reporte</h5>
                    <p className="descripcion-larga">
                      {reporteSeleccionado?.descripcion || "—"}
                    </p>

                    <div className="info-linea">
                      <span className="muted">Dirección</span>
                      <strong>{reporteSeleccionado?.direccion || "—"}</strong>
                    </div>
                    <div className="info-linea">
                      <span className="muted">Creado</span>
                      <strong>
                        {reporteSeleccionado?.fecha_creacion
                          ? new Date(reporteSeleccionado.fecha_creacion).toLocaleDateString("es-CO")
                          : "—"}
                      </strong>
                    </div>
                    {reporteSeleccionado?.fecha_actualizacion && (
                      <div className="info-linea">
                        <span className="muted">Actualizado</span>
                        <strong>
                          {new Date(reporteSeleccionado.fecha_actualizacion).toLocaleDateString(
                            "es-CO"
                          )}
                        </strong>
                      </div>
                    )}

                    <div className="coordenadas">
                      <div>
                        <span className="muted">Coordenadas</span>
                        <strong>
                          {reporteSeleccionado?.ubicacion_lat && reporteSeleccionado?.ubicacion_lng
                            ? `${reporteSeleccionado.ubicacion_lat}, ${reporteSeleccionado.ubicacion_lng}`
                            : "—"}
                        </strong>
                      </div>
                      {reporteSeleccionado?.ubicacion_lat && (
                        <div className="acciones-ubicacion">
                          <button
                            className="enlace-mapa"
                            onClick={() =>
                              abrirEnMapas(
                                reporteSeleccionado.ubicacion_lat,
                                reporteSeleccionado.ubicacion_lng,
                                "google"
                              )
                            }
                          >
                            Abrir en Google Maps
                          </button>
                          <button
                            className="enlace-mapa"
                            onClick={() =>
                              abrirEnMapas(
                                reporteSeleccionado.ubicacion_lat,
                                reporteSeleccionado.ubicacion_lng,
                                "osm"
                              )
                            }
                          >
                            Abrir en OpenStreetMap
                          </button>
                          <button
                            className="enlace-mapa"
                            onClick={() =>
                              copiar(
                                `${reporteSeleccionado.ubicacion_lat}, ${reporteSeleccionado.ubicacion_lng}`
                              )
                            }
                          >
                            Copiar coordenadas
                          </button>
                        </div>
                      )}
                    </div>

                    {getGaleria(reporteSeleccionado).length > 0 && (
                      <>
                        <h5 style={{ marginTop: 10 }}>Evidencias</h5>
                        <div className="galeria">
                          {getGaleria(reporteSeleccionado).map((src, i) => (
                            <a
                              href={src}
                              key={i}
                              target="_blank"
                              rel="noreferrer"
                              className="thumb"
                              title={`Evidencia ${i + 1}`}
                            >
                              <img src={src} alt={`Evidencia ${i + 1}`} />
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mapa */}
                  <div className="bloque-mapa card">
                    <h5>Mapa de ubicación</h5>
                    {reporteSeleccionado?.ubicacion_lat ? (
                      <div className="mini-map">
                        <MapContainer
                          center={[
                            reporteSeleccionado.ubicacion_lat,
                            reporteSeleccionado.ubicacion_lng,
                          ]}
                          zoom={15}
                          style={{ height: "230px", borderRadius: "12px" }}
                          scrollWheelZoom={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker
                            position={[
                              reporteSeleccionado.ubicacion_lat,
                              reporteSeleccionado.ubicacion_lng,
                            ]}
                            icon={icon}
                          >
                            <Popup>{reporteSeleccionado.titulo}</Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    ) : (
                      <p className="muted">Sin coordenadas geográficas.</p>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="timeline-container card">
                  <h5>Historial</h5>

                  {cargandoSeg && <p className="muted">Cargando historial…</p>}
                  {errorSeg && !cargandoSeg && <p className="muted">{errorSeg}</p>}

                  {(!cargandoSeg && eventos.length === 0) && (
                    <div className="timeline">
                      <div className="timeline-item active">
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                          <h6>Reporte registrado</h6>
                          <p>
                            Enviado el{" "}
                            <b>
                              {reporteSeleccionado?.fecha_creacion
                                ? new Date(reporteSeleccionado.fecha_creacion).toLocaleDateString("es-CO")
                                : "—"}
                            </b>.
                          </p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                          <h6>Recibido por la entidad</h6>
                          <p>Validación y clasificación del caso.</p>
                        </div>
                      </div>
                      {["en gestión", "en proceso", "resuelto"].includes(
                        normalizarEstado(reporteSeleccionado?.estado)
                      ) && (
                        <div className="timeline-item">
                          <div className="timeline-dot" />
                          <div className="timeline-content">
                            <h6>Gestión en curso</h6>
                            <p>Seguimiento y acciones por el área responsable.</p>
                          </div>
                        </div>
                      )}
                      {normalizarEstado(reporteSeleccionado?.estado) === "resuelto" && (
                        <div className="timeline-item resolved">
                          <div className="timeline-dot" />
                          <div className="timeline-content">
                            <h6>Reporte resuelto</h6>
                            <p>Caso cerrado satisfactoriamente.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(!cargandoSeg && eventos.length > 0) && (
                    <div className="timeline">
                      {eventos.map((ev, idx) => (
                        <div
                          className={`timeline-item ${ev.estado?.toLowerCase() === "resuelto" ? "resolved" : ""}`}
                          key={idx}
                        >
                          <div className="timeline-dot" />
                          <div className="timeline-content">
                            <h6>{ev.titulo || ev.tipo || "Actualización"}</h6>
                            <p>
                              {ev.descripcion || "—"}{" "}
                              {ev.fecha && (
                                <>
                                  — <b>{new Date(ev.fecha).toLocaleDateString("es-CO")}</b>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-buttons end">
                  <button
                    className="btn-secundario"
                    onClick={() => setMostrarModalSeguimiento(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* /Modal seguimiento */}
        </div>
      </div>
    </div>
  );
}
