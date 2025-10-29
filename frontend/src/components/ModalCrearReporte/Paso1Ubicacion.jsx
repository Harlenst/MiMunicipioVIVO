import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

// 📍 Detecta clics en el mapa y guarda coordenadas + dirección
function MapClick({ setData }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setData((prev) => ({
        ...prev,
        ubicacion_lat: lat,
        ubicacion_lng: lng,
      }));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        if (data.display_name) {
          setData((prev) => ({ ...prev, direccion: data.display_name }));
        }
      } catch (error) {
        console.error("Error obteniendo dirección:", error);
      }
    },
  });
  return null;
}

// ⚙️ Corrige renderizado del mapa en modales
function MapFix() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
  return null;
}

// 🧭 Nuevo hook: controla zoom animado desde fuera
// 🧭 Componente: controla zoom animado desde fuera
function ZoomToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords?.lat && coords?.lng) {
      map.flyTo([coords.lat, coords.lng], 15, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}


export default function Paso1Ubicacion({ data, setData, nextStep }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);
  const debounceTimeout = useRef(null);

  // 🔍 Buscar sugerencias (autocompletado)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (value.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&countrycodes=co&limit=5`
        );
        const results = await res.json();
        setSuggestions(results);
      } catch (error) {
        console.error("Error obteniendo sugerencias:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // ✅ Seleccionar sugerencia
  const handleSelectSuggestion = (item) => {
    setSearch(item.display_name);
    setSuggestions([]);
    setData((prev) => ({
      ...prev,
      direccion: item.display_name,
      ubicacion_lat: parseFloat(item.lat),
      ubicacion_lng: parseFloat(item.lon),
    }));
    setGpsCoords({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
  };

  // 📍 Usar ubicación actual (GPS del navegador)
  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setData((prev) => ({
          ...prev,
          ubicacion_lat: latitude,
          ubicacion_lng: longitude,
        }));
        setGpsCoords({ lat: latitude, lng: longitude }); // 👈 activa animación de zoom

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const info = await res.json();
          setData((prev) => ({
            ...prev,
            direccion: info.display_name || "Ubicación actual",
          }));
          setSearch(info.display_name || "Ubicación actual");
        } catch (error) {
          console.error("Error obteniendo dirección actual:", error);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        alert("No se pudo obtener tu ubicación. Verifica permisos.");
        console.error(err);
        setLoading(false);
      }
    );
  };

  // 🚀 Continuar
  const handleContinuar = () => {
    if (!data.ubicacion_lat || !data.ubicacion_lng) {
      alert("Por favor selecciona una ubicación antes de continuar.");
      return;
    }
    nextStep();
  };

  return (
    <div className="modal-step">
      <h2 className="text-lg font-semibold text-[#1565c0] mb-3">
        Paso 1: Ubicación del problema
      </h2>

      {/* 🔍 Campo de búsqueda con autocompletado */}
      <div className="relative">
        <input
          type="text"
          className={`input-direccion ${loading ? "loading" : ""}`}
          placeholder="🔍 Escribe una dirección en Colombia"
          value={search}
          onChange={handleSearchChange}
        />

        {/* 📍 Botón usar ubicación actual */}
        <button onClick={handleUseMyLocation} className="btn-ubicacion">
          📍 Usar mi ubicación actual
        </button>

        {/* Lista de sugerencias */}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item, i) => (
              <li key={i} onClick={() => handleSelectSuggestion(item)}>
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🗺️ Mapa */}
      <div className="map-wrapper">
        <MapContainer
          center={
            data.ubicacion_lat && data.ubicacion_lng
              ? [data.ubicacion_lat, data.ubicacion_lng]
              : [4.5709, -74.2973] // 🇨🇴 Centro de Colombia
          }
          zoom={data.ubicacion_lat ? 14 : 6}
          className="leaflet-container"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClick setData={setData} />
          <MapFix />
          {gpsCoords && <ZoomToLocation coords={gpsCoords} />}
          {data.ubicacion_lat && (
            <Marker
              position={[data.ubicacion_lat, data.ubicacion_lng]}
              icon={markerIcon}
            />
          )}
        </MapContainer>
      </div>

      {/* 📍 Dirección y coordenadas */}
      {data.ubicacion_lat && (
        <div className="direccion-box">
          <p><b>Dirección:</b> {data.direccion}</p>
          <p>
            <b>Lat:</b> {data.ubicacion_lat.toFixed(5)} |{" "}
            <b>Lng:</b> {data.ubicacion_lng.toFixed(5)}
          </p>
        </div>
      )}

      {/* Botón continuar */}
      <div className="acciones">
        <button onClick={handleContinuar} className="btn-continuar">
          Continuar a Detalles →
        </button>
      </div>
    </div>
  );
}
