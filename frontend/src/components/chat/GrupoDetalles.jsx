// components/chat/GrupoDetalles.jsx
import React from "react";
import DetallesBase from "./DetallesBase";
import { FaUserFriends, FaCalendarAlt } from "react-icons/fa";

export default function GrupoDetalles({ grupo }) {
  if (!grupo) {
    return <DetallesBase icon={FaUserFriends} color="emerald" emptyMessage="Selecciona un grupo" />;
  }

  const esAdmin = grupo.rol === 'admin' || grupo.rol === 'creador';

  const datos = [
    { label: "Nombre", value: grupo.nombre, bold: true },
    grupo.descripcion && { label: "Descripción", value: grupo.descripcion },
    { label: "Miembros", value: `${grupo.miembros || 0} miembros` },
    {
      label: "Tu rol",
      value: esAdmin ? "Administrador" : "Miembro",
      type: "badge",
      badgeClass: esAdmin ? "bg-yellow-100 text-yellow-800" : "bg-emerald-100 text-emerald-800"
    },
    {
      label: "Creado",
      value: new Date(grupo.fecha_creacion).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    grupo.codigo_invitacion && {
      label: "Código invitación",
      value: grupo.codigo_invitacion,
      type: "code"
    }
  ].filter(Boolean);

  const acciones = [
    { icon: "Group", label: "Ver miembros" },
    esAdmin && { icon: "Settings", label: "Configuración del grupo", warning: true },
    { icon: "Copy", label: "Copiar código invitación" },
    { icon: "Exit", label: "Abandonar grupo", danger: true }
  ].filter(Boolean);

  return <DetallesBase titulo="Grupo" icon={FaUserFriends} color="emerald" datos={datos} acciones={acciones} />;
}