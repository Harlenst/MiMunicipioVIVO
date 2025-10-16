import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import ReportesPanel from "../components/ReportesPanel";
import ChatCiudadano from "../components/ChatCiudadano";
import "../styles/mapaCiudadano.css";

const MapaCiudadano = () => {
  return (
    <div className="mapa-ciudadano-container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="content-body">
          <div className="map-section">
            <MapView />
          </div>

          <div className="right-panels">
            <div className="panel reportes-panel">
              <ReportesPanel />
            </div>

            <div className="panel chat-panel">
              <ChatCiudadano />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaCiudadano;
