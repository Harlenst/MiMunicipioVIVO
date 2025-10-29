// components/chat/DetallesBase.jsx
import React from "react";
import { motion } from "framer-motion";

export default function DetallesBase({
  titulo,
  icon: Icon,
  color = "indigo",
  datos = [],
  acciones = [],
  emptyMessage = "Selecciona un elemento"
}) {
  const colores = {
    indigo: { bg: "from-indigo-50 to-blue-50", text: "indigo-600", hover: "indigo-50" },
    emerald: { bg: "from-emerald-50 to-teal-50", text: "emerald-600", hover: "emerald-50" },
    blue: { bg: "from-blue-50 to-indigo-50", text: "blue-600", hover: "blue-50" }
  };
  const c = colores[color] || colores.indigo;

  if (!datos.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{emptyMessage}</h3>
        <p className="text-xs text-gray-500">Verás los detalles aquí</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 h-full overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${c.bg} px-6 py-4 border-b border-gray-100`}>
        <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${c.text}`} />
          {titulo || "Detalles"}
        </h3>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          {datos.map((item, i) => (
            <div key={i}>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                {item.label}
              </label>

              {item.type === "badge" ? (
                <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-xl ${item.badgeClass}`}>
                  {item.value}
                </span>
              ) : item.type === "code" ? (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                  <code className="text-sm font-mono font-medium text-gray-900">{item.value}</code>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className={`text-sm ${item.bold ? 'font-semibold bg-' + c.bg.split('-')[1] + '-50 px-3 py-2 rounded-xl' : 'text-gray-900'}`}>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Acciones */}
        {acciones.length > 0 && (
          <div className="pt-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Acciones
            </h4>
            <div className="space-y-2">
              {acciones.map((accion, i) => (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all text-sm ${
                    accion.danger
                      ? 'hover:bg-red-50 text-red-600'
                      : accion.warning
                      ? 'hover:bg-yellow-50 text-yellow-700'
                      : `hover:bg-${c.hover}`
                  }`}
                >
                  <span className="text-lg">{accion.icon}</span>
                  <span className={`font-medium ${accion.danger ? 'text-red-600' : ''}`}>
                    {accion.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}