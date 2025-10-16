import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/mapaCiudadano.css";

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -28],
});

// Recalcula el tamaño del mapa
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 400);
  }, [map]);
  return null;
}

export default function MapView() {
  const [categoria, setCategoria] = useState("todas");

  // Reportes de ejemplo
  const reportes = [
    {
      id: 1,
      tipo: "vías",
      posicion: [37.7749, -122.4194],
      descripcion: "Hueco en la vía principal",
      fecha: "2025-10-15",
    },
    {
      id: 2,
      tipo: "alumbrado",
      posicion: [37.776, -122.424],
      descripcion: "Lámpara dañada en el parque",
      fecha: "2025-10-15",
    },
    {
      id: 3,
      tipo: "seguridad",
      posicion: [37.772, -122.43],
      descripcion: "Robo reportado en el barrio central",
      fecha: "2025-10-14",
    },
  ];

  // Filtrar los reportes según la categoría seleccionada
  const reportesFiltrados =
    categoria === "todas"
      ? reportes
      : reportes.filter((r) => r.tipo === categoria);

  return (
    <div className="mapa-wrapper">
      <div className="map-header">
        <div>
          <h3>🗺️ Mi Municipio Vivo</h3>
          <span className="map-subtitle">
            Visualiza los incidentes registrados en tu municipio
          </span>
        </div>

        <div className="filtro-categorias">
          <label htmlFor="categoria">Filtrar por categoría:</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="vías">Vías</option>
            <option value="alumbrado">Alumbrado</option>
            <option value="seguridad">Seguridad</option>
          </select>
        </div>
      </div>

      <MapContainer
        center={[37.77, -122.45]}
        zoom={14}
        scrollWheelZoom={true}
        className="mapa-leaflet"
        style={{ width: "100%", height: "100%" }}
      >
        <ResizeMap />
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reportesFiltrados.map((r) => (
          <Marker key={r.id} position={r.posicion} icon={icon}>
            <Popup>
              <b>Tipo:</b> {r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1)} <br />
              <b>Descripción:</b> {r.descripcion} <br />
              <small>📅 {r.fecha}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
