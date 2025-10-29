// components/chat/ComunidadLista.jsx
import React from "react";
import ListaBase from "./ListaBase.jsx";
import { FaUsers } from "react-icons/fa";

export default function ComunidadLista({ comunidades, onSelect, seleccionada }) {
  return (
    <ListaBase
      items={comunidades}
      onSelect={onSelect}
      seleccionado={seleccionada}
      titulo="Comunidades"
      icon={FaUsers}
      color="indigo"
      getKey={(c) => c.id_comunidad}
      renderItem={(c) => (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                {c.nombre?.[0]?.toUpperCase() || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{c.nombre}</h4>
                <p className="text-sm text-gray-600 truncate">{c.descripcion}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{c.miembros || 0} miembros</span>
              <div className="flex items-center gap-2">
                {c.mensajes_no_leidos > 0 && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                    {c.mensajes_no_leidos}
                  </span>
                )}
                <span>{c.activo ? 'Activa' : 'Silenciosa'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      emptyMessage="No hay comunidades"
    />
  );
}