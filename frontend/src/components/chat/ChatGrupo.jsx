// src/components/chat/ChatGrupo.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaPaperclip, FaImage, FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function ChatGrupo({ id_grupo, usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/mensajes/grupo/${id_grupo}`);
        const data = await res.json();
        setMensajes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando mensajes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMensajes();
  }, [id_grupo]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    const mensaje = {
      id_grupo,
      id_usuario: user.id_usuario,
      contenido: nuevoMensaje,
      fecha_envio: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:5000/api/mensajes/grupo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensaje)
      });
      const data = await res.json();
      setMensajes(prev => [...prev, data]);
      setNuevoMensaje("");
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl">
        <p className="text-gray-500">Cargando chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            G
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Grupo Privado</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaLock className="w-3 h-3" /> Acceso por invitación
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mensajes.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-sm">Aún no hay mensajes</p>
            <p className="text-xs mt-1">Sé el primero en escribir</p>
          </div>
        ) : (
          mensajes.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.id_usuario === user.id_usuario ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.id_usuario === user.id_usuario
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}>
                <p className="text-sm">{msg.contenido}</p>
                <p className={`text-xs mt-1 ${
                  msg.id_usuario === user.id_usuario ? "text-emerald-200" : "text-gray-500"
                }`}>
                  {new Date(msg.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600 transition">
            <FaPaperclip className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition">
            <FaImage className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-500"
          />
          <button
            onClick={enviarMensaje}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}