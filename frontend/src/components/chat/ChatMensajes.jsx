import React, { useState, useEffect, useRef } from "react";

export default function ChatMensajes({ id_reporte, usuario }) {
  const [comentarios, setComentarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const chatEndRef = useRef(null);

  const fetchComentarios = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comentarios/${id_reporte}`);
      const data = await res.json();
      setComentarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar comentarios", err);
    }
  };

  useEffect(() => {
    fetchComentarios();
    const interval = setInterval(fetchComentarios, 5000);
    return () => clearInterval(interval);
  }, [id_reporte]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comentarios]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    try {
      await fetch("http://localhost:5000/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_reporte,
          id_usuario: usuario.id_usuario,
          mensaje,
        }),
      });
      setMensaje("");
      fetchComentarios();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-700 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h2 className="font-medium">💬 Reporte #{id_reporte}</h2>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {comentarios.map((c) => {
          const esUsuario = c.Usuario?.id_usuario === usuario.id_usuario;
          return (
            <div key={c.id_comentario} className={`flex ${esUsuario ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 max-w-[70%] rounded-2xl shadow-sm ${
                  esUsuario ? "bg-blue-600 text-white" : "bg-white border"
                }`}
              >
                <p className="text-sm">{c.mensaje}</p>
                <small className="text-xs opacity-75 block text-right mt-1">
                  {new Date(c.fecha_envio).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={enviarMensaje}
        className="flex items-center gap-2 p-3 border-t bg-white rounded-b-lg"
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="flex-1 p-2 border rounded-full px-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
