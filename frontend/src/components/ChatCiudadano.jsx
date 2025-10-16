import React, { useState, useEffect, useRef } from "react";
import "../styles/chatCiudadano.css";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatCiudadano = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { autor: "Soporte", texto: "¡Hola! 👋 Soy el asistente de Mi Municipio Vivo. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const chatRef = useRef(null);

  // Desplazar hacia abajo cuando hay nuevos mensajes
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Simular respuesta automática
  const simularRespuesta = (textoUsuario) => {
    setTimeout(() => {
      let respuesta = "";
      if (textoUsuario.toLowerCase().includes("reporte")) {
        respuesta = "📋 Tu reporte será asignado a la secretaría correspondiente. Recibirás seguimiento pronto.";
      } else if (textoUsuario.toLowerCase().includes("gracias")) {
        respuesta = "😊 ¡Con gusto! Estamos para servirte.";
      } else if (textoUsuario.toLowerCase().includes("problema")) {
        respuesta = "🔧 Entendido. ¿Podrías indicar el tipo de problema y su ubicación?";
      } else {
        respuesta = "🤖 Estoy procesando tu solicitud. En breve un agente humano revisará tu mensaje.";
      }
      setMensajes((prev) => [...prev, { autor: "Soporte", texto: respuesta }]);
    }, 1500);
  };

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    const mensaje = nuevoMensaje.trim();
    setMensajes([...mensajes, { autor: "Tú", texto: mensaje }]);
    setNuevoMensaje("");
    simularRespuesta(mensaje);
  };

  return (
    <div className="chat-widget-container">
      {/* Botón flotante */}
      {!abierto && (
        <button className="chat-toggle" onClick={() => setAbierto(true)}>
          <FaComments size={22} /> Chat Ciudadano
        </button>
      )}

      {/* Ventana de chat desplegable */}
      {abierto && (
        <div className="chat-widget">
          <div className="chat-header">
            <span>💬 Chat Ciudadano</span>
            <button className="close-btn" onClick={() => setAbierto(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chat-body" ref={chatRef}>
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`mensaje ${m.autor === "Tú" ? "usuario" : "soporte"}`}
              >
                <div className="bubble">
                  <span>{m.texto}</span>
                </div>
                <small className="autor">{m.autor}</small>
              </div>
            ))}
          </div>

          <form onSubmit={enviarMensaje} className="chat-footer">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <button type="submit">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatCiudadano;
