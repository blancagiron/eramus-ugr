// src/estudiante/ProgresoEstudiante.jsx
import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle, Filter, MailOpen, Mail } from "lucide-react";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/DashboardHeader";
import Hamburguesa from "../dashboard/Hamburguesa";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProgresoEstudiante() {
  const [items, setItems] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");      // todos | notificacion | acuerdo
  const [filtroLeidas, setFiltroLeidas] = useState("todas");   // todas | noLeidas | leidas
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const email = (() => {
    try {
      const raw = localStorage.getItem("usuario");
      const u = raw ? JSON.parse(raw) : null;
      return u?.email || "";
    } catch {
      return "";
    }
  })();

  // Normalizador del endpoint /api/progreso/:email
  const normalizeFromProgresoAPI = (data) => {
    // { items: [ { id, fuente, titulo, mensaje, timestamp, tipo, leida, enlace } ] }
    if (!data || !Array.isArray(data.items)) return [];
    return data.items.map((it) => ({
      id: it.id ?? crypto.randomUUID(),
      fuente: it.fuente ?? "notificacion", // "acuerdo" | "notificacion"
      titulo: it.titulo ?? "Sin título",
      mensaje: it.mensaje ?? "",
      timestamp: it.timestamp ?? new Date().toISOString(),
      tipo: it.tipo ?? "info",
      leida: it.leida ?? false,
      enlace: it.enlace ?? "",
    }));
  };

  const fetchTimeline = async () => {
    if (!email) return;
    setCargando(true);
    setError("");

    try {
      const r = await fetch(`${BASE_URL}/api/progreso/${encodeURIComponent(email)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const norm = normalizeFromProgresoAPI(data);
      norm.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setItems(norm);
    } catch (e) {
      console.error("Error cargando timeline:", e);
      setError("No se pudo cargar tu progreso. Intenta de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const visibles = useMemo(() => {
    return items.filter((it) => {
      if (filtroTipo !== "todos" && it.fuente !== filtroTipo) return false;
      if (filtroLeidas === "noLeidas" && it.fuente === "notificacion" && it.leida !== false) return false;
      if (filtroLeidas === "leidas" && it.fuente === "notificacion" && it.leida !== true) return false;
      return true;
    });
  }, [items, filtroTipo, filtroLeidas]);

  const marcarTodoLeido = async () => {
    if (!email) return;
    try {
      await fetch(`${BASE_URL}/api/notificaciones/${encodeURIComponent(email)}/leer-todas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      await fetchTimeline();
    } catch (e) {
      console.error("Error marcando todo leído", e);
    }
  };

  const marcarLeida = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/notificaciones/${encodeURIComponent(id)}/leer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      await fetchTimeline();
    } catch (e) {
      console.error("Error marcando notificación leída", e);
    }
  };

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen flex flex-col">
          <DashboardHeader
            titulo="Historial de tu movilidad"
            subtitulo="Consulta los movimientos y notificaciones de tu proceso Erasmus+"
          />

          <main className="max-w-5xl mx-auto px-6 pb-16 w-full">
            {/* Filtros */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Filter className="w-4 h-4" /> Filtros
                </span>

                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="notificacion">Notificaciones</option>
                  <option value="acuerdo">Movimientos del acuerdo</option>
                </select>

                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={filtroLeidas}
                  onChange={(e) => setFiltroLeidas(e.target.value)}
                >
                  <option value="todas">Todas</option>
                  <option value="noLeidas">Solo no leídas</option>
                  <option value="leidas">Solo leídas</option>
                </select>

                <button
                  onClick={marcarTodoLeido}
                  className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black text-sm"
                  title="Marcar todas las notificaciones como leídas"
                >
                  <MailOpen className="w-4 h-4" />
                  Marcar todo como leído
                </button>
              </div>
            </div>

            {/* Estados */}
            {cargando && <div className="text-gray-600">Cargando…</div>}
            {!cargando && error && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
            )}
            {!cargando && !error && visibles.length === 0 && (
              <div className="text-gray-600">No hay eventos que coincidan con los filtros.</div>
            )}

            {/* Lista / Timeline */}
            {!cargando && !error && visibles.length > 0 && (
              <ul className="space-y-4">
                {visibles.map((it) => (
                  <li key={it.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          it.fuente === "acuerdo"
                            ? "bg-emerald-100"
                            : it.tipo === "warning"
                            ? "bg-amber-100"
                            : it.tipo === "error"
                            ? "bg-rose-100"
                            : it.tipo === "success"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {it.fuente === "acuerdo" ? (
                          <CheckCircle className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <Bell className="w-5 h-5 text-blue-700" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{it.titulo}</h3>
                          {it.fuente === "notificacion" && it.leida === false && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Nuevo</span>
                          )}
                        </div>

                        {it.mensaje && <p className="text-gray-700 mt-1">{it.mensaje}</p>}

                        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                          <time dateTime={it.timestamp}>{formatFechaHumana(it.timestamp)}</time>
                          {it.enlace && (
                            <a href={it.enlace} className="underline hover:no-underline" target="_blank" rel="noreferrer">
                              Abrir
                            </a>
                          )}
                        </div>
                      </div>

                      {it.fuente === "notificacion" && it.leida === false && (
                        <button
                          onClick={() => marcarLeida(it.id)}
                          className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                          title="Marcar como leída"
                        >
                          <Mail className="w-4 h-4" />
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </main>
        </div>
      </Sidebar>
    </>
  );
}

function formatFechaHumana(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso; // fallback
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
