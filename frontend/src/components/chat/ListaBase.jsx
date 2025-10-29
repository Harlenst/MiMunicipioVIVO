// components/chat/ListaBase.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ListaBase({
  items,
  onSelect,
  seleccionado,
  titulo,
  icon: Icon,
  color = "indigo",
  getKey,
  renderItem,
  emptyMessage = "No hay elementos"
}) {
  const [busqueda, setBusqueda] = useState("");
  const filtrados = items.filter(item =>
    JSON.stringify(Object.values(item)).toLowerCase().includes(busqueda.toLowerCase())
  );

  const colores = {
    indigo: "indigo-600",
    emerald: "emerald-600",
    blue: "blue-600"
  };
  const c = colores[color] || "indigo-600";

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 h-full overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${color}-50 via-white to-${color === 'indigo' ? 'blue' : color === 'emerald' ? 'teal' : 'indigo'}-50 px-6 py-4 border-b border-gray-100`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon className={`w-5 h-5 text-${c}`} /> {titulo}
          </h3>
          <span className={`text-sm bg-${color}-100 text-${c} px-3 py-1 rounded-full font-medium`}>
            {filtrados.length}
          </span>
        </div>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`Buscar ${titulo.toLowerCase()}...`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-current focus:border-transparent transition-all placeholder-gray-500"
            style={{ outline: 'none' }}
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filtrados.length > 0 ? (
          filtrados.map((item) => (
            <motion.div
              key={getKey(item)}
              whileHover={{ backgroundColor: "rgb(249 250 251)" }}
              onClick={() => onSelect(item)}
              className={`p-5 cursor-pointer transition-all ${
                seleccionado && getKey(seleccionado) === getKey(item)
                  ? `bg-${color}-50 border-r-4 border-${c}`
                  : ''
              }`}
            >
              {renderItem(item)}
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium mb-2">{emptyMessage}</h4>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {busqueda ? "Intenta con otra búsqueda" : "Aún no tienes elementos"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}