import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/configuracion.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TABS = [
  { id: "general", label: "General" },
  { id: "seguridad", label: "Seguridad" },
  { id: "personalizacion", label: "Personalización" },
  { id: "notificaciones", label: "Notificaciones" },
];

export default function Configuracion() {
  const { user, token, obtenerPerfil,actualizarPersonalizacionGlobal} = useAuth();
  const [tab, setTab] = useState("general");

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null); // {tipo:'ok'|'error', texto:''}

  // ---------- helpers UI ----------
  const show = (tipo, texto) => {
    setToast({ tipo, texto });
    setTimeout(() => setToast(null), 2500);
  };

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // ---------- cargar perfil ----------
  useEffect(() => {
    const load = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${API_BASE}/api/usuarios/perfil`, {
          headers: authHeaders,
          timeout: 15000,
        });
        // Soporta {success, data} o el usuario directo
        const data = res.data?.data || res.data;
        setPerfil(data);
        // aplicar tema si viene
        if (data?.tema) {
          document.documentElement.setAttribute("data-theme", data.tema);
          if (data?.color) document.documentElement.style.setProperty("--brand", data.color);
          if (data?.fuente) document.documentElement.style.setProperty("--font-sans", data.fuente);
        }
      } catch (err) {
        console.error("Error cargando perfil:", err?.response?.data || err);
        show("error", "No se pudo cargar tu perfil");
      } finally {
        setCargando(false);
      }
    };
    load();
  }, [token]); // eslint-disable-line

  // ------------ formularios locales ------------
  // General
  const [fGeneral, setFGeneral] = useState({
    nombre: "",
    correo: "",
    direccion: "",
    barrio: "",
    telefono1: "",
    telefono2: "",
    ciudad: "",
    departamento: "",
    contrasena_actual: "",
  });

  // Seguridad
  const [fSeguridad, setFSeguridad] = useState({
    contrasena_actual: "",
    nueva_contrasena: "",
    confirmar: "",
  });

  // Personalización
  const [fPerso, setFPerso] = useState({
    tema: "claro",
    color: "#2563eb",
    fuente: "Inter",
    contrasena_actual: "",
  });

  // Notificaciones
  const [fNoti, setFNoti] = useState({
    notif_email: true,
    notif_push: false,
    notif_whatsapp: false,
    notif_resumen: "semanal",
    contrasena_actual: "",
  });

  // Sincroniza formularios cuando llega el perfil
  useEffect(() => {
    if (!perfil) return;
    setFGeneral((f) => ({
      ...f,
      nombre: perfil.nombre || "",
      correo: perfil.correo || "",
      direccion: perfil.direccion || "",
      barrio: perfil.barrio || "",
      telefono1: perfil.telefono1 || "",
      telefono2: perfil.telefono2 || "",
      ciudad: perfil.ciudad || "",
      departamento: perfil.departamento || "",
    }));
    setFPerso((f) => ({
      ...f,
      tema: perfil.tema || "claro",
      color: perfil.color || "#2563eb",
      fuente: perfil.fuente || "Inter",
    }));
    setFNoti((f) => ({
      ...f,
      notif_email: perfil.notif_email ?? true,
      notif_push: perfil.notif_push ?? false,
      notif_whatsapp: perfil.notif_whatsapp ?? false,
      notif_resumen: perfil.notif_resumen || "semanal",
    }));
  }, [perfil]);

  // ---------- Acciones ----------
  // General + (opcional) cambio de contraseña -> usa PUT /api/usuarios/perfil (valida contrasena_actual)
  const guardarGeneral = async () => {
    if (!fGeneral.contrasena_actual) {
      show("error", "Debes confirmar con tu contraseña actual");
      return;
    }
    setGuardando(true);
    try {
      await axios.put(
        `${API_BASE}/api/usuarios/perfil`,
        {
          nombre: fGeneral.nombre,
          correo: fGeneral.correo,
          direccion: fGeneral.direccion,
          barrio: fGeneral.barrio,
          telefono1: fGeneral.telefono1,
          telefono2: fGeneral.telefono2,
          ciudad: fGeneral.ciudad,
          departamento: fGeneral.departamento,
          contrasena_actual: fGeneral.contrasena_actual,
          // No cambiamos contraseña aquí, solo datos básicos
        },
        { headers: authHeaders }
      );
      show("ok", "✅ Datos actualizados");
      setFGeneral((f) => ({ ...f, contrasena_actual: "" }));
      // refrescar contexto
      await obtenerPerfil(token);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo guardar";
      show("error", msg);
    } finally {
      setGuardando(false);
    }
  };

  // Seguridad (solo contraseña) -> también /api/usuarios/perfil
  const guardarSeguridad = async () => {
    if (!fSeguridad.contrasena_actual || !fSeguridad.nueva_contrasena) {
      show("error", "Llena las contraseñas");
      return;
    }
    if (fSeguridad.nueva_contrasena !== fSeguridad.confirmar) {
      show("error", "La confirmación no coincide");
      return;
    }
    setGuardando(true);
    try {
      await axios.put(
        `${API_BASE}/api/usuarios/perfil`,
        {
          contrasena_actual: fSeguridad.contrasena_actual,
          nueva_contrasena: fSeguridad.nueva_contrasena,
        },
        { headers: authHeaders }
      );
      show("ok", "🔒 Contraseña actualizada");
      setFSeguridad({ contrasena_actual: "", nueva_contrasena: "", confirmar: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo actualizar la contraseña";
      show("error", msg);
    } finally {
      setGuardando(false);
    }
  };

  // Verificación de contraseña “manual” para secciones que no valida tu backend:
  // 1) verificamos contraseña con PUT /perfil (sin cambiar datos)
  // 2) si OK, actualizamos campos sueltos vía PUT /usuarios/:id
  const verificarYActualizarUsuario = async (payloadCampos, password) => {
    // 1) verificación
    await axios.put(
      `${API_BASE}/api/usuarios/perfil`,
      {
        contrasena_actual: password,
        // Enviamos un campo no destructivo del perfil para “forzar” validación sin cambiar nada
        nombre: perfil?.nombre,
      },
      { headers: authHeaders }
    );

    // 2) actualización de cualquier campo permitido por actualizarUsuario
    await axios.put(
      `${API_BASE}/api/usuarios/${perfil.id_usuario}`,
      payloadCampos,
      { headers: authHeaders }
    );
  };

  // Personalización (tema/color/fuente) -> valida password, luego PUT /usuarios/:id
  const guardarPersonalizacion = async () => {
    if (!fPerso.contrasena_actual) {
      show("error", "Confirma con tu contraseña");
      return;
    }
    setGuardando(true);
    try {
      await verificarYActualizarUsuario(
        { tema: fPerso.tema, color: fPerso.color, fuente: fPerso.fuente },
        fPerso.contrasena_actual
      );
      // aplicar instantáneamente en UI:
      document.documentElement.setAttribute("data-theme", fPerso.tema);
      document.documentElement.style.setProperty("--brand", fPerso.color);
      document.documentElement.style.setProperty("--font-sans", fPerso.fuente);

      show("ok", "🎨 Personalización guardada");
      setFPerso((f) => ({ ...f, contrasena_actual: "" }));
      await obtenerPerfil(token);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo guardar";
      show("error", msg);
    } finally {
      setGuardando(false);
    }
  };

  // Notificaciones -> valida password, luego PUT /usuarios/:id
  const guardarNotificaciones = async () => {
    if (!fNoti.contrasena_actual) {
      show("error", "Confirma con tu contraseña");
      return;
    }
    setGuardando(true);
    try {
      await verificarYActualizarUsuario(
        {
          notif_email: !!fNoti.notif_email,
          notif_push: !!fNoti.notif_push,
          notif_whatsapp: !!fNoti.notif_whatsapp,
          notif_resumen: fNoti.notif_resumen,
        },
        fNoti.contrasena_actual
      );
      show("ok", "🔔 Preferencias guardadas");
      setFNoti((f) => ({ ...f, contrasena_actual: "" }));
      await obtenerPerfil(token);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo guardar";
      show("error", msg);
    } finally {
      setGuardando(false);
    }
  };

  // ---------- Render ----------
  if (cargando) {
    return (
      <div className="config-layout">
        <div className="config-loader">Cargando configuración…</div>
      </div>
    );
  }

  return (
    <div className="config-layout animate">
      <header className="config-header">
        <div>
          <h2>Configuración</h2>
          <p>Gestiona tus datos, seguridad y preferencias del sistema.</p>
        </div>

        {/* Tarjeta compacta con datos clave */}
        <div className="identity-card">
          <div className="ic-avatar">{(perfil?.nombre || "U").slice(0, 1)}</div>
          <div className="ic-body">
            <div className="ic-name">{perfil?.nombre}</div>
            <div className="ic-mail">{perfil?.correo}</div>
            <div className="ic-meta">
              <span>{perfil?.ciudad || "—"}</span>
              <span>•</span>
              <span>Rol: {perfil?.rol || "ciudadano"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="config-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="config-content">
        {tab === "general" && (
          <div className="card">
            <h3 className="card-title">Información general</h3>
            <div className="grid-2">
              <div className="field">
                <label>Nombre</label>
                <input
                  value={fGeneral.nombre}
                  onChange={(e) => setFGeneral({ ...fGeneral, nombre: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Correo</label>
                <input
                  type="email"
                  value={fGeneral.correo}
                  onChange={(e) => setFGeneral({ ...fGeneral, correo: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Dirección</label>
                <input
                  value={fGeneral.direccion}
                  onChange={(e) => setFGeneral({ ...fGeneral, direccion: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Barrio</label>
                <input
                  value={fGeneral.barrio}
                  onChange={(e) => setFGeneral({ ...fGeneral, barrio: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Teléfono 1</label>
                <input
                  value={fGeneral.telefono1}
                  onChange={(e) => setFGeneral({ ...fGeneral, telefono1: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Teléfono 2</label>
                <input
                  value={fGeneral.telefono2}
                  onChange={(e) => setFGeneral({ ...fGeneral, telefono2: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Ciudad</label>
                <input
                  value={fGeneral.ciudad}
                  onChange={(e) => setFGeneral({ ...fGeneral, ciudad: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Departamento</label>
                <input
                  value={fGeneral.departamento}
                  onChange={(e) => setFGeneral({ ...fGeneral, departamento: e.target.value })}
                />
              </div>
            </div>

            <div className="divider" />

            <div className="field sm">
              <label>Contraseña (para confirmar cambios)</label>
              <input
                type="password"
                value={fGeneral.contrasena_actual}
                onChange={(e) =>
                  setFGeneral({ ...fGeneral, contrasena_actual: e.target.value })
                }
              />
            </div>

            <div className="actions">
              <button
                className="btn primary"
                onClick={guardarGeneral}
                disabled={guardando}
              >
                {guardando ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}

        {tab === "seguridad" && (
          <div className="card">
            <h3 className="card-title">Seguridad</h3>
            <div className="grid-3">
              <div className="field">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  value={fSeguridad.contrasena_actual}
                  onChange={(e) =>
                    setFSeguridad({ ...fSeguridad, contrasena_actual: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={fSeguridad.nueva_contrasena}
                  onChange={(e) =>
                    setFSeguridad({ ...fSeguridad, nueva_contrasena: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Confirmar</label>
                <input
                  type="password"
                  value={fSeguridad.confirmar}
                  onChange={(e) =>
                    setFSeguridad({ ...fSeguridad, confirmar: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="actions">
              <button
                className="btn primary"
                onClick={guardarSeguridad}
                disabled={guardando}
              >
                {guardando ? "Guardando…" : "Actualizar contraseña"}
              </button>
            </div>
          </div>
        )}

        {tab === "personalizacion" && (
  <div className="card">
    <h3 className="card-title">🎨 Personalización</h3>
    <p className="card-sub">Cambia el tema, los colores y la fuente de tu panel.</p>

    <div className="grid-3">
      {/* TEMA */}
      <div className="field">
        <label>Tema</label>
        <select
          value={fPerso.tema}
          onChange={(e) => {
            const tema = e.target.value;
            setFPerso({ ...fPerso, tema });
            // Vista previa instantánea
            document.documentElement.setAttribute("data-theme", tema);
          }}
        >
          <option value="claro">Claro</option>
          <option value="oscuro">Oscuro</option>
          <option value="institucional">Institucional</option>
        </select>
      </div>

      {/* COLOR */}
      <div className="field">
        <label>Color institucional</label>
        <input
          type="color"
          value={fPerso.color}
          onChange={(e) => {
            const color = e.target.value;
            setFPerso({ ...fPerso, color });
            // Aplicar instantáneamente el color
            document.documentElement.style.setProperty("--brand", color);
          }}
        />
      </div>

      {/* FUENTE */}
      <div className="field">
        <label>Fuente</label>
        <select
          value={fPerso.fuente}
          onChange={(e) => {
            const fuente = e.target.value;
            setFPerso({ ...fPerso, fuente });
            // Aplicar instantáneamente la fuente
            document.documentElement.style.setProperty("--font-sans", fuente);
          }}
        >
          <option>Inter</option>
          <option>Rubik</option>
          <option>Poppins</option>
          <option>Nunito</option>
          <option>Open Sans</option>
          <option>Montserrat</option>
        </select>
      </div>
    </div>

    {/* Vista previa en tiempo real */}
    <div className="preview">
      <div
        className="preview-chip"
        style={{
          background: fPerso.color,
          fontFamily: fPerso.fuente,
        }}
      >
        {fPerso.tema === "institucional"
          ? "Modo Institucional"
          : fPerso.tema === "oscuro"
          ? "Modo Oscuro"
          : "Modo Claro"}
      </div>
      <p style={{ fontFamily: fPerso.fuente }}>
        Este es un ejemplo de cómo se verá tu interfaz según la fuente y los
        colores elegidos.
      </p>
    </div>

    <div className="divider" />

    {/* Contraseña */}
    <div className="field sm">
      <label>Contraseña (para confirmar)</label>
      <input
        type="password"
        value={fPerso.contrasena_actual}
        onChange={(e) => setFPerso({ ...fPerso, contrasena_actual: e.target.value })}
      />
    </div>

    {/* BOTONES */}
    <div className="actions">
      <button
        className="btn primary"
        onClick={guardarPersonalizacion}
        disabled={guardando}
      >
        {guardando ? "Guardando…" : "Guardar personalización"}
      </button>

      <button
        className="btn secondary"
        onClick={() => {
          // Restaurar valores por defecto
          const defaults = {
            tema: "claro",
            color: "#2563eb",
            fuente: "Inter",
          };
          setFPerso({ ...fPerso, ...defaults });
          document.documentElement.setAttribute("data-theme", "claro");
          document.documentElement.style.setProperty("--brand", "#2563eb");
          document.documentElement.style.setProperty("--font-sans", "Inter");
          show("ok", "🎯 Valores restaurados");
        }}
      >
        Restaurar valores por defecto
      </button>
    </div>
  </div>
)}

        {tab === "notificaciones" && (
          <div className="card">
            <h3 className="card-title">Notificaciones</h3>

            <div className="grid-3">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={!!fNoti.notif_email}
                  onChange={(e) =>
                    setFNoti((s) => ({ ...s, notif_email: e.target.checked }))
                  }
                />
                <span>Correo electrónico</span>
              </label>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={!!fNoti.notif_push}
                  onChange={(e) =>
                    setFNoti((s) => ({ ...s, notif_push: e.target.checked }))
                  }
                />
                <span>Notificaciones push</span>
              </label>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={!!fNoti.notif_whatsapp}
                  onChange={(e) =>
                    setFNoti((s) => ({ ...s, notif_whatsapp: e.target.checked }))
                  }
                />
                <span>WhatsApp</span>
              </label>

              <div className="field">
                <label>Resumen</label>
                <select
                  value={fNoti.notif_resumen}
                  onChange={(e) =>
                    setFNoti((s) => ({ ...s, notif_resumen: e.target.value }))
                  }
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
            </div>

            <div className="divider" />

            <div className="field sm">
              <label>Contraseña (para confirmar)</label>
              <input
                type="password"
                value={fNoti.contrasena_actual}
                onChange={(e) =>
                  setFNoti((s) => ({ ...s, contrasena_actual: e.target.value }))
                }
              />
            </div>

            <div className="actions">
              <button
                className="btn primary"
                onClick={guardarNotificaciones}
                disabled={guardando}
              >
                {guardando ? "Guardando…" : "Guardar preferencias"}
              </button>
            </div>
          </div>
        )}
      </section>

      {toast && (
        <div className={`toast ${toast.tipo === "ok" ? "ok" : "error"}`}>
          {toast.texto}
        </div>
      )}
    </div>
  );
}
