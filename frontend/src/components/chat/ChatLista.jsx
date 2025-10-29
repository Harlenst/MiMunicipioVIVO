import React, { useState } from "react";

export default function ChatLista({ reportes, onSelect, seleccionado }) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = reportes.filter((reporte) =>
    reporte.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    reporte.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    reporte.direccion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (filtrados.length === 0 && busqueda) {
    return (
      <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 h-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar reportes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-sm font-medium mb-2">No se encontraron reportes</h4>
            <p className="text-xs text-gray-400">Intenta con otra búsqueda</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 h-full overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📋 Reportes</h3>
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {filtrados.length}
          </span>
        </div>
        
        {/* Búsqueda */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar reportes por título, descripción o dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filtrados.length > 0 ? (
          filtrados.map((reporte) => {
            const tieneMensajesNoLeidos = reporte.mensajes_no_leidos > 0;
            const esUrgente = reporte.prioridad === 'alta' || reporte.prioridad === 'urgente';
            
            return (
              <div
                key={reporte.id_reporte}
                onClick={() => onSelect(reporte)}
                className={`p-5 cursor-pointer transition-all duration-200 hover:bg-gray-50 relative ${
                  seleccionado?.id_reporte === reporte.id_reporte
                    ? 'bg-blue-50 border-r-4 border-blue-500'
                    : ''
                } ${esUrgente ? 'border-l-4 border-red-500' : ''}`}
              >
                {/* Indicador de urgencia */}
                {esUrgente && (
                  <div className="absolute top-5 left-5 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      {/* Avatar/Ícono del reporte */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        esUrgente 
                          ? 'bg-red-100 border-2 border-red-200' 
                          : 'bg-blue-100 border-2 border-blue-200'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate pr-2">
                            {reporte.titulo}
                          </h4>
                          {esUrgente && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                              {reporte.prioridad?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1 pr-2">
                          {reporte.descripcion}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate pr-2">
                          📍 {reporte.direccion || 'Sin ubicación'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span>💬 {reporte.mensajes_count || 0} mensajes</span>
                        <span>📊 Estado: {reporte.estado || 'Pendiente'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tieneMensajesNoLeidos && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                            {reporte.mensajes_no_leidos}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {reporte.ultimo_mensaje_fecha 
                            ? new Date(reporte.ultimo_mensaje_fecha).toLocaleDateString('es-ES', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit' 
                              })
                            : 'Sin mensajes'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-sm font-medium mb-2">No hay reportes</h4>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Crea tu primer reporte o espera asignaciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
}