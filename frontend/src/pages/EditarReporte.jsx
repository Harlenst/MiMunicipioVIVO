// frontend/src/pages/EditarReporte.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/editarReporte.css";
import { useAuth } from "../context/AuthContext";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function DraggableMarker({ position, onChange }) {
  const [pos, setPos] = useState(position);

  useEffect(() => setPos(position), [position]);

  useMapEvents({
    click(e) {
      setPos(e.latlng);
      onChange(e.latlng);
    },
  });

  return (
    <Marker
      draggable
      position={pos}
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setPos({ lat, lng });
          onChange({ lat, lng });
        },
      }}
    />
  );
}

export default function EditarReporte() {
  const { id_reporte } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    direccion: "",
    ubicacion_lat: 6.2442, // Medellín por defecto
    ubicacion_lng: -75.5812,
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar reporte
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/reportes/${id_reporte}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const r = res.data;

        setForm((prev) => ({
          ...prev,
          titulo: r.titulo || "",
          descripcion: r.descripcion || "",
          categoria: r.categoria || "",
          direccion: r.direccion || "",
          ubicacion_lat: r.ubicacion_lat ?? prev.ubicacion_lat,
          ubicacion_lng: r.ubicacion_lng ?? prev.ubicacion_lng,
        }));

        const estado = (r.estado || "").toLowerCase();
        if (estado !== "recibido") {
          setError("Solo se pueden editar reportes en estado 'Recibido'.");}
      } catch (err) {
        console.error("❌ Error cargando reporte:", err);
        setError("No se pudo cargar el reporte.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id_reporte, token]);

  const center = useMemo(
    () => [form.ubicacion_lat || 6.2442, form.ubicacion_lng || -75.5812],
    [form.ubicacion_lat, form.ubicacion_lng]
  );

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensaje("");
    setError("");
  };

  const onMoveMarker = ({ lat, lng }) => {
    setForm((f) => ({ ...f, ubicacion_lat: lat, ubicacion_lng: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) {
      setError("Debes ingresar tu contraseña para confirmar los cambios.");
      return;
    }
    setGuardando(true);
    setMensaje("");
    setError("");

    try {
      const body = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        categoria: form.categoria,
        direccion: form.direccion,
        ubicacion_lat: form.ubicacion_lat,
        ubicacion_lng: form.ubicacion_lng,
        password: form.password,
      };

      const res = await axios.put(
        `http://localhost:5000/api/reportes/${id_reporte}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje(res.data?.message || "Reporte actualizado correctamente ✅");
      setTimeout(() => navigate("/panel/mis-reportes"), 1200);
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      const msg = err.response?.data?.message || "No se pudo actualizar el reporte.";
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="page-scroll">
          <div className="editar-reporte-container">
            <p>Cargando reporte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-scroll">
        <div className="editar-reporte-container animate">
          <header className="editar-header">
            <h2>Editar reporte</h2>
            <p>Modifica la información del incidente y confirma con tu contraseña.</p>
          </header>

          {mensaje && <p className="mensaje success">{mensaje}</p>}
          {error && <p className="mensaje error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={updateField}
                  required
                />
              </div>

              <div>
                <label>Categoría</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={updateField}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Vías">Vías</option>
                  <option value="Alumbrado">Alumbrado</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Aseo">Aseo</option>
                </select>
              </div>

              <div className="col-span-2">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  rows={4}
                  value={form.descripcion}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="col-span-2">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={updateField}
                  placeholder="Ej: Calle 45 #12-34"
                />
              </div>

              <div className="col-span-2">
                <label>Ubicación en el mapa</label>
                <div className="mapa-editar">
                  <MapContainer
                    center={center}
                    zoom={15}
                    style={{ height: 300, width: "100%" }}
                    scrollWheelZoom
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <DraggableMarker
                      position={{ lat: form.ubicacion_lat, lng: form.ubicacion_lng }}
                      onChange={onMoveMarker}
                    />
                  </MapContainer>
                </div>
                <small className="coords">
                  Lat: <b>{form.ubicacion_lat?.toFixed(6)}</b> — Lng:{" "}
                  <b>{form.ubicacion_lng?.toFixed(6)}</b>
                </small>
              </div>

              <div className="col-span-2">
                <label>Contraseña (confirmación)</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Ingresa tu contraseña para confirmar"
                  required
                />
              </div>
            </div>

            <div className="botones-form">
              <button
                type="button"
                className="btn-volver"
                onClick={() => navigate("/panel/mis-reportes")}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-guardar" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
