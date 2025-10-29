// src/pages/Estadisticas.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChartBar, FaClock, FaCheckCircle, FaExclamationTriangle, 
  FaSearch, FaCalendarAlt, FaFilter, FaArrowUp, FaArrowDown
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ESTADOS = {
  RECHAZADO: "Rechazado",
  EN_PROCESO: "en proceso",
  RESUELTO: "resuelto",
};

const normalizarEstado = (estado) => {
  if (!estado) return ESTADOS.RECHAZADO;
  const e = String(estado).toLowerCase().trim();
  if (e.includes("proce")) return ESTADOS.EN_PROCESO;
  if (e.includes("resu")) return ESTADOS.RESUELTO;
  if (e.includes("rech")) return ESTADOS.RECHAZADO;
  return e;
};

const formatFecha = (fecha) => {
  if (!fecha) return "—";
  try {
    return new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
};

const mesCorto = (date) => {
  return date.toLocaleDateString("es-ES", { month: "short" }).replace(".", "").toUpperCase();
};

const getUmbral = (filtro) => {
  const hoy = new Date();
  const d = new Date(hoy);
  if (filtro === "30") d.setDate(hoy.getDate() - 30);
  else if (filtro === "90") d.setDate(hoy.getDate() - 90);
  else if (filtro === "365") d.setDate(hoy.getDate() - 365);
  else return null;
  return d;
};

export default function Estadisticas() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("90");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        const res = await axios.get(`${API_BASE}/api/reportes`);
        setReportes(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  // Filtrado por periodo
  const reportesPeriodo = useMemo(() => {
    const umbral = getUmbral(filtroPeriodo);
    if (!umbral) return reportes;
    return reportes.filter(r => {
      const f = r.fecha_creacion ? new Date(r.fecha_creacion) : null;
      return f && f >= umbral;
    });
  }, [reportes, filtroPeriodo]);

  // Métricas principales
  const metrics = useMemo(() => {
    const total = reportesPeriodo.length;
    let Rechazado = 0, enProceso = 0, resueltos = 0;
    reportesPeriodo.forEach(r => {
      const est = normalizarEstado(r.estado);
      if (est === ESTADOS.PENDIENTE) Rechazado++;
      else if (est === ESTADOS.EN_PROCESO) enProceso++;
      else if (est === ESTADOS.RESUELTO) resueltos++;
    });
    const activos = total - resueltos;
    const tasa = total ? Math.round((resueltos / total) * 100) : 0;
    return { total, activos, resueltos, Rechazado, enProceso, tasa };
  }, [reportesPeriodo]);

  // Tendencia 6 meses
  const tendencia = useMemo(() => {
    const hoy = new Date();
    const puntos = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const totalMes = reportesPeriodo.filter(r => {
        const f = r.fecha_creacion ? new Date(r.fecha_creacion) : null;
        return f && f.getFullYear() === y && f.getMonth() === m;
      }).length;
      puntos.push({ label: `${mesCorto(d)} ${String(y).slice(-2)}`, valor: totalMes });
    }
    return puntos;
  }, [reportesPeriodo]);

  // Categorías
  const categorias = useMemo(() => {
    const map = new Map();
    reportesPeriodo.forEach(r => {
      const cat = (r.categoria || "Sin categoría").toString();
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map, ([categoria, cantidad]) => ({ categoria, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [reportesPeriodo]);

  // Reportes activos
  const activos = useMemo(() => {
    let base = reportesPeriodo.filter(r => normalizarEstado(r.estado) !== ESTADOS.RESUELTO);
    if (busqueda) {
      const q = busqueda.toLowerCase();
      base = base.filter(r =>
        [r.titulo, r.descripcion, r.categoria, r.direccion].some(field =>
          field?.toLowerCase().includes(q)
        )
      );
    }
    if (filtroEstado !== "todos") base = base.filter(r => normalizarEstado(r.estado) === filtroEstado);
    if (filtroCategoria !== "todas") base = base.filter(r => (r.categoria || "").toLowerCase() === filtroCategoria.toLowerCase());

    const orden = { alto: 1, medio: 2, bajo: 3 };
    base.sort((a, b) => {
      const na = orden[(a.nivel || "").toLowerCase()] || 99;
      const nb = orden[(b.nivel || "").toLowerCase()] || 99;
      if (na !== nb) return na - nb;
      return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    });
    return base;
  }, [reportesPeriodo, busqueda, filtroEstado, filtroCategoria]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FaChartBar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Estadísticas Municipales</h1>
          </div>
          <p className="text-gray-600">Panel institucional de métricas y reportes activos</p>
        </motion.header>

        {/* FILTROS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="w-5 h-5 text-blue-600" />
              <select
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
                <option value="365">Últimos 12 meses</option>
                <option value="all">Histórico completo</option>
              </select>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en reportes activos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* ESTADOS */}
        <AnimatePresence>
          {cargando && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-blue-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Cargando estadísticas...
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-700 p-4 rounded-xl text-center font-medium">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {!cargando && !error && (
          <>
            {/* KPIs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <KPI
                icon={<FaChartBar />}
                label="Total Reportes"
                value={metrics.total}
                trend={tendencia}
                footer={`${tendencia.slice(-1)[0]?.valor || 0} este mes`}
              />
              <KPI
                icon={<FaExclamationTriangle />}
                label="Activos"
                value={metrics.activos}
                color="text-orange-600"
                bg="bg-orange-50"
                sub={[
                  { label: "Rechazado", value: metrics.Rechazado },
                  { label: "En proceso", value: metrics.enProceso }
                ]}
              />
              <KPI
                icon={<FaCheckCircle />}
                label="Resueltos"
                value={metrics.resueltos}
                color="text-green-600"
                bg="bg-green-50"
                progress={metrics.tasa}
                footer={`${metrics.tasa}% del período`}
              />
              <KPI
                icon={<FaArrowUp />}
                label="Tasa de Resolución"
                value={`${metrics.tasa}%`}
                donut={metrics.tasa}
                footer={`Sobre ${metrics.total} reportes`}
              />
            </div>

            {/* DISTRIBUCIONES */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <DistribucionEstado metrics={metrics} />
              <TopCategorias categorias={categorias} total={metrics.total} />
            </div>

            {/* TENDENCIA */}
            <TendenciaMensual tendencia={tendencia} />

            {/* TABLA ACTIVOS */}
            <ReportesActivos
              activos={activos}
              filtroEstado={filtroEstado}
              setFiltroEstado={setFiltroEstado}
              filtroCategoria={filtroCategoria}
              setFiltroCategoria={setFiltroCategoria}
              categorias={categorias}
            />
          </>
        )}
      </div>
    </div>
  );
}

// === COMPONENTES ===
const KPI = ({ icon, label, value, trend, sub, color = "text-blue-600", bg = "bg-blue-50", progress, donut, footer }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
        <div className={`w-6 h-6 ${color}`}>{icon}</div>
      </div>
      {trend && <Sparkline data={trend.map(p => p.valor)} />}
    </div>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    {sub && (
      <div className="grid grid-cols-2 gap-3 mt-3">
        {sub.map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-lg font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>
    )}
    {progress !== undefined && (
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    )}
    {donut !== undefined && (
      <div className="mt-4 flex justify-center">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="34" stroke="#e5e7eb" strokeWidth="10" fill="none" />
            <circle
              cx="40" cy="40" r="34"
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2.513 * donut}, 251.3`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{donut}%</span>
          </div>
          <svg className="hidden">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    )}
    <p className="text-xs text-gray-500 mt-3">{footer}</p>
  </motion.div>
);

const Sparkline = ({ data }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-blue-600 rounded-t"
          style={{ height: `${(v / max) * 100}%` }}
          title={`${v}`}
        />
      ))}
    </div>
  );
};

const DistribucionEstado = ({ metrics }) => (
  <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución por Estado</h3>
    <div className="space-y-4">
      {[
        { label: "Rechazado", value: metrics.Rechazado, color: "bg-yellow-500" },
        { label: "En proceso", value: metrics.enProceso, color: "bg-indigo-500" },
        { label: "Resueltos", value: metrics.resueltos, color: "bg-green-500" }
      ].map((item, i) => {
        const pct = metrics.total ? Math.round((item.value / metrics.total) * 100) : 0;
        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{item.label}</span>
              <span className="text-gray-600">{item.value} ({pct}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className={`${item.color} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
);

const TopCategorias = ({ categorias, total }) => (
  <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Categorías</h3>
    <div className="space-y-3">
      {categorias.slice(0, 6).map((c, i) => {
        const pct = total ? Math.round((c.cantidad / total) * 100) : 0;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{c.categoria}</span>
                <span className="text-gray-600">{c.cantidad}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
);

const TendenciaMensual = ({ tendencia }) => (
  <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Tendencia Mensual (6 meses)</h3>
    <div className="flex items-end justify-between gap-2 h-32">
      {tendencia.map((p, i) => {
        const max = Math.max(...tendencia.map(x => x.valor), 1);
        const h = (p.valor / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-blue-600 rounded-t" style={{ height: `${h}%` }} title={p.valor} />
            <span className="text-xs text-gray-600 mt-2">{p.label}</span>
          </div>
        );
      })}
    </div>
  </motion.div>
);

const ReportesActivos = ({ activos, filtroEstado, setFiltroEstado, filtroCategoria, setFiltroCategoria, categorias }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-gray-900">Reportes Activos</h3>
        <div className="flex gap-3">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="Rechazado">Rechazado</option>
            <option value="en proceso">En proceso</option>
          </select>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.categoria} value={c.categoria}>{c.categoria}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activos.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                No hay reportes activos con los filtros seleccionados
              </td>
            </tr>
          ) : (
            activos.map(r => (
              <tr key={r.id_reporte} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.titulo}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{r.categoria || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    (r.nivel || "").toLowerCase() === "alto" ? "bg-red-100 text-red-800" :
                    (r.nivel || "").toLowerCase() === "medio" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {r.nivel || "bajo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    normalizarEstado(r.estado) === "pendiente" ? "bg-yellow-100 text-yellow-800" :
                    normalizarEstado(r.estado) === "en proceso" ? "bg-indigo-100 text-indigo-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {r.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatFecha(r.fecha_creacion)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
);