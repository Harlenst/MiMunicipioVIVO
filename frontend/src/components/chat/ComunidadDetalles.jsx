// components/chat/ComunidadDetalles.jsx
import React from "react";
import DetallesBase from "./DetallesBase";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";

export default function ComunidadDetalles({ comunidad }) {
  if (!comunidad) {
    return <DetallesBase icon={FaUsers} color="indigo" emptyMessage="Selecciona una comunidad" />;
  }

  const datos = [
    { label: "Nombre", value: comunidad.nombre, bold: true },
    { label: "Descripción", value: comunidad.descripcion || "Sin descripción" },
    { label: "Miembros", value: `${comunidad.miembros || 0} participantes` },
    {
      label: "Estado",
      value: comunidad.activo ? "Activa" : "Inactiva",
      type: "badge",
      badgeClass: comunidad.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
    },
    {
      label: "Creada",
      value: new Date(comunidad.fecha_creacion).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    }
  ];

  const acciones = [
    { icon: "Group", label: "Ver miembros" },
    { icon: "Share", label: "Invitar amigos" },
    { icon: "Exit", label: "Abandonar comunidad", danger: true }
  ];

  return <DetallesBase titulo="Comunidad" icon={FaUsers} color="indigo" datos={datos} acciones={acciones} />;
}