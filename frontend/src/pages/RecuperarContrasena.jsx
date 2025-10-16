import { useState } from "react";
import axios from "axios";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enviarCodigo = async () => {
    if (!email) {
      setError("Ingresa un email válido");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5000/api/auth/recuperar", { email });
      alert("Código enviado al correo");
      setPaso(2);
    } catch (err) {
      setError("Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const cambiarPass = async () => {
    if (nuevaPass.length < 8 || !/[A-Z]/.test(nuevaPass) || !/[0-9]/.test(nuevaPass)) {
      setError("Contraseña debe tener min 8 chars, una mayúscula y un número");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5000/api/auth/restablecer", {
        email,
        codigo,
        nuevaPass,
      });
      alert("Contraseña actualizada correctamente");
      window.location.href = "/login";
    } catch (err) {
      setError("Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white shadow-lg p-8 rounded-2xl w-[400px]">
        <h2 className="text-2xl font-bold mb-4 text-center">Recuperar Contraseña</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        {paso === 1 && (
          <>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <button
              onClick={enviarCodigo}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </>
        )}

        {paso === 2 && (
          <>
            <input
              type="text"
              placeholder="Código recibido"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaPass}
              onChange={(e) => setNuevaPass(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <button
              onClick={cambiarPass}
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}