import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapaCiudadano from "../pages/MapaCiudadano";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import RecuperarContrasena from "../pages/RecuperarContrasena";
import PanelLayout from "../layouts/PanelLayout";
import Reportes from "../pages/Reportes"; // ✅ Corrección: la ruta era incorrecta
import Estadisticas from "../pages/Estadisticas";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 Página pública inicial */}
        <Route path="/" element={<MapaCiudadano />} />

        {/* 👇 Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />

        {/* 👇 Rutas internas del panel */}
        <Route
          path="/panel/mapa"
          element={
            <PanelLayout>
              <MapaCiudadano />
            </PanelLayout>
          }
        />

        {/* ✅ Nueva ruta para la vista de reportes */}
        <Route
          path="/panel/reportes"
          element={
            <PanelLayout>
              <Reportes />
            </PanelLayout>
          }
        />

        <Route
          path="/panel/estadisticas"
          element={
            <PanelLayout>
              <Estadisticas />
            </PanelLayout>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}
