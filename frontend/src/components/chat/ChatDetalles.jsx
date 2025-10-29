import React from "react";

export default function ChatDetalles({ reporte }) {
  if (!reporte) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center">
        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Selecciona un reporte</h3>
        <p className="text-xs text-gray-500">Verás los detalles aquí</p>
      </div>
    );
  }

  const getPrioridadColor = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'media': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'resuelto': return 'bg-green-100 text-green-800';
      case 'en progreso': return 'bg-blue-100 text-blue-800';
      case 'asignado': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 h-full overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Detalles del Reporte
        </h3>
      </div>
      
      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Título</label>
            <p className="text-sm text-gray-900 font-semibold bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
              {reporte.titulo}
            </p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Descripción</label>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{reporte.descripcion}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Dirección</label>
            <p className="text-sm text-gray-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {reporte.direccion || 'No especificada'}
            </p>
          </div>

          {/* Prioridad y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Prioridad</label>
              <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-xl border ${getPrioridadColor(reporte.prioridad)}`}>
                {reporte.prioridad?.toUpperCase() || 'NORMAL'}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Estado</label>
              <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-xl ${getEstadoColor(reporte.estado)}`}>
                {reporte.estado || 'PENDIENTE'}
              </span>
            </div>
          </div>

          {/* Dependencia asignada */}
          {reporte.id_dependencia && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Dependencia</label>
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {reporte.Dependencia?.nombre || 'Dependencia asignada'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reporte.Dependencia?.descripcion || 'Responsable del reporte'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fecha */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Fecha</label>
            <p className="text-sm text-gray-900">
              Reportado: {new Date(reporte.fecha_creacion).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              {reporte.fecha_actualizacion && (
                <>
                  <br />
                  <span className="text-gray-500">Última actualización: {new Date(reporte.fecha_actualizacion).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="pt-6 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Estadísticas
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{reporte.votos || 0}</div>
              <div className="text-gray-600">Votos</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{reporte.comentarios_count || 0}</div>
              <div className="text-gray-600">Comentarios</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{reporte.vistas || 0}</div>
              <div className="text-gray-600">Vistas</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">{reporte.tiempo_respuesta || 'N/A'}</div>
              <div className="text-gray-600">Tiempo respuesta</div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-6 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Acciones
          </h4>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-blue-50 transition-all text-sm">
              <span className="text-lg">📱</span>
              <span className="text-gray-700 font-medium">Ver reporte completo</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-green-50 transition-all text-sm">
              <span className="text-lg">📤</span>
              <span className="text-gray-700 font-medium">Compartir reporte</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-yellow-50 transition-all text-sm">
              <span className="text-lg">⭐</span>
              <span className="text-gray-700 font-medium">Votar útil</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-indigo-50 transition-all text-sm">
              <span className="text-lg">🔔</span>
              <span className="text-gray-700 font-medium">Notificaciones</span>
            </button>
            {reporte.estado !== 'resuelto' && (
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-red-50 transition-all text-sm text-red-600">
                <span className="text-lg">❌</span>
                <span className="font-medium">Reportar como resuelto</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}