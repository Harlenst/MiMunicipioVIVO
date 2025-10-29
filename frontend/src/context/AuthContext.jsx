import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  /* ==========================================================
     🌈 APLICAR PERSONALIZACIÓN GLOBAL (tema, color, fuente)
  ========================================================== */
  const aplicarPersonalizacion = (tema, color, fuente) => {
    document.documentElement.setAttribute("data-theme", tema || "claro");
    document.documentElement.style.setProperty("--brand", color || "#2563eb");
    document.documentElement.style.setProperty("--font-sans", fuente || "Inter");
  };

  /* ==========================================================
     🧠 OBTENER PERFIL DEL USUARIO AUTENTICADO
  ========================================================== */
  const obtenerPerfil = async (tokenActual) => {
    try {
      setLoading(true);
      console.log("🔍 Intentando obtener perfil...");

      const res = await axios.get("http://localhost:5000/api/usuarios/perfil", {
        headers: { Authorization: `Bearer ${tokenActual}` },
        timeout: 15000,
      });

      const data = res.data?.data || res.data;

      if (data && data.id_usuario) {
        setUser(data);
        localStorage.setItem("usuario", JSON.stringify(data));

        // 🧠 Aplicar personalización del usuario
        aplicarPersonalizacion(data.tema, data.color, data.fuente);

        console.log("✅ Perfil cargado:", data.id_usuario);
        return data;
      }
    } catch (err) {
      console.error("❌ Error al obtener perfil:", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     🔐 LOGIN
  ========================================================== */
  const login = async (newToken, usuario = null) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (usuario) {
      setUser(usuario);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      aplicarPersonalizacion(usuario.tema, usuario.color, usuario.fuente);
      console.log("✅ Login exitoso:", usuario.id_usuario);
    } else {
      await obtenerPerfil(newToken);
    }

    return { success: true };
  };

  /* ==========================================================
     🚪 LOGOUT
  ========================================================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setToken(null);
    setLoading(false);
    console.log("🚪 Sesión cerrada");
  };

  /* ==========================================================
     🧩 ACTUALIZAR PERSONALIZACIÓN GLOBAL
     (llamado desde Configuración.jsx)
  ========================================================== */
  const actualizarPersonalizacionGlobal = (tema, color, fuente) => {
    try {
      aplicarPersonalizacion(tema, color, fuente);

      setUser((prev) => ({
        ...prev,
        tema,
        color,
        fuente,
      }));

      const storedUser = JSON.parse(localStorage.getItem("usuario") || "{}");
      const updated = { ...storedUser, tema, color, fuente };
      localStorage.setItem("usuario", JSON.stringify(updated));

      console.log("🎨 Personalización aplicada globalmente:", { tema, color, fuente });
    } catch (err) {
      console.error("❌ Error aplicando personalización:", err);
    }
  };

  /* ==========================================================
     🔁 CARGA AUTOMÁTICA DESDE LOCALSTORAGE
  ========================================================== */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");

    // Aplicar estilos locales mientras carga el backend
    if (storedUser) {
      const u = JSON.parse(storedUser);
      aplicarPersonalizacion(u.tema, u.color, u.fuente);
      setUser(u);
    }

    if (storedToken) obtenerPerfil(storedToken);
    else setLoading(false);
  }, []);

  /* ==========================================================
     ♻️ REACTIVIDAD GLOBAL DE PERSONALIZACIÓN
  ========================================================== */
  useEffect(() => {
    if (user?.tema) {
      aplicarPersonalizacion(user.tema, user.color, user.fuente);
    }
  }, [user]);

  /* ==========================================================
     🧭 EXPORTAR CONTEXTO
  ========================================================== */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        obtenerPerfil,
        actualizarPersonalizacionGlobal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
