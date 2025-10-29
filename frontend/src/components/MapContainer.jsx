import React, { useRef, useEffect } from "react";
import MapView from "./MapView";

const MapContainer = ({ selectedReporte, onSelectReporte }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.dispatchEvent(new Event("resize"));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Trigger inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex-1 relative h-full overflow-hidden" ref={mapContainerRef}>
      <MapView
        selectedReporte={selectedReporte}
        onSelectReporte={onSelectReporte}
        containerRef={mapContainerRef}
      />
    </div>
  );
};

export default MapContainer;