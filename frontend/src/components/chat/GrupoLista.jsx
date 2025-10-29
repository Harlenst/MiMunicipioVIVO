// components/chat/GrupoLista.jsx
import React from "react";
import ListaBase from "./ListaBase";
import { FaUserFriends } from "react-icons/fa";

export default function GrupoLista({ grupos, onSelect, seleccionado }) {
  return (
    <ListaBase
      items={grupos}
      onSelect={onSelect}
      seleccionado={seleccionado}
      titulo="Grupos Privados"
      icon={FaUserFriends}
      color="emerald"
      getKey={(g) => g.id_grupo}
      renderItem={(g) => {
        const esAdmin = g.rol === 'admin' || g.rol === 'creador';
        return (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 relative">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                    {g.nombre?.[0]?.toUpperCase() || 'G'}
                  </div>
                  {esAdmin && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{g.nombre}</h4>
                  <p className="text-sm text-gray-600 truncate">{g.descripcion || 'Grupo privado'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{g.miembros || 0} miembros</span>
                <div className="flex items-center gap-2">
                  {g.mensajes_no_leidos > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                      {g.mensajes_no_leidos}
                    </span>
                  )}
                  <span>{g.activo ? 'Activo' : 'Silencioso'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
      emptyMessage="No hay grupos"
    />
  );
}