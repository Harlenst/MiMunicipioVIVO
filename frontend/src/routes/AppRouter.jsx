import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PanelLayout from "../layouts/PanelLayout";
import ProtectedRoute from "./ProtectedRoute";
import MapaCiudadano from "../pages/MapaCiudadano";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import RecuperarContrasena from "../pages/RecuperarContrasena";
import Reportes from "../pages/Reportes";
import DetalleReporte from "../pages/DetalleReporte";
import MisReportes from "../pages/MisReportes";
import EditarReporte from "../pages/EditarReporte";
import Estadisticas from "../pages/Estadisticas";
import Perfil from "../pages/Perfil";
import Notificaciones from "../pages/Notificaciones";
import ChatPage from "../components/chat/ChatCiudadano";
import Configuracion from "../pages/Configuracion";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== RUTAS PÚBLICAS (sin MainLayout) ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />



        {/* ===== RUTAS PÚBLICAS CON MainLayout ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MapaCiudadano />} />

        </Route>

        {/* ===== RUTAS PROTEGIDAS CON PanelLayout ===== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/panel" element={<PanelLayout />}>
            <Route index element={<MapaCiudadano />} />
            <Route path="mapa" element={<MapaCiudadano />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="mis-reportes" element={<MisReportes />} />
            <Route path="/panel/chat" element={<ChatPage />} />
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="configuracion/general" element={<Configuracion />} />
            <Route path="configuracion/seguridad" element={<Configuracion />} />
            <Route path="configuracion/preferencias" element={<Configuracion />} />
            <Route path="chat/:id_reporte" element={<ChatPage />} />
            <Route path="/reportes/:id" element={<DetalleReporte />} />
            {/* ✅ Ruta correcta: relativa dentro de /panel */}
            <Route path="reportes/editar/:id_reporte" element={<EditarReporte />} />
            <Route path="estadisticas" element={<Estadisticas />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="notificaciones" element={<Notificaciones />} />
          </Route>
        </Route>

        {/* ===== 404 ===== */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
              <h2 className="text-6xl font-bold text-red-500 mb-4">404</h2>
              <p className="text-xl mb-8">Página no encontrada</p>
              <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Volver al Mapa
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
