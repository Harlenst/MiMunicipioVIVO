// src/components/chat/ChatComunidad.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaPaperclip, FaImage } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function ChatComunidad({ id_comunidad, usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/mensajes/comunidad/${id_comunidad}`);
        const data = await res.json();
        setMensajes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMensajes();
  }, [id_comunidad]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    const mensaje = {
      id_comunidad,
      id_usuario: user.id_usuario,
      contenido: nuevoMensaje,
      fecha_envio: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:5000/api/mensajes/comunidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensaje)
      });
      const data = await res.json();
      setMensajes(prev => [...prev, data]);
      setNuevoMensaje("");
    } catch (err) {
      console.error("Error enviando:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Chat de Comunidad</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mensajes.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-sm">Sin mensajes aún</p>
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
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}>
                <p className="text-sm">{msg.contenido}</p>
                <p className={`text-xs mt-1 ${
                  msg.id_usuario === user.id_usuario ? "text-indigo-200" : "text-gray-500"
                }`}>
                  {new Date(msg.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600"><FaPaperclip className="w-5 h-5" /></button>
          <button className="text-gray-400 hover:text-gray-600"><FaImage className="w-5 h-5" /></button>
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
            placeholder="Escribe aquí..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
          />
          <button
            onClick={enviarMensaje}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}