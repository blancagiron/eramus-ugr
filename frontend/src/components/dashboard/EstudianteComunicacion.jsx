// src/dashboard/EstudianteComunicacion.jsx
import { useEffect, useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import { MessageSquareText, Send, FileDown, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function EstudianteComunicacion() {
  const [user, setUser] = useState(null);
  const [acuerdo, setAcuerdo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;
    const u = JSON.parse(raw);
    setUser(u);
    fetch(`http://localhost:5000/api/acuerdos/${u.email}/ultima`)
      .then(r => r.ok ? r.json() : null)
      .then(setAcuerdo)
      .finally(() => setLoading(false));
  }, []);

  const estado = acuerdo?.estado || "sin_acuerdo";
  const puedeEnviar = ["borrador", "cambios_solicitados"].includes(estado);
  const badge = useMemo(() => {
    const base = "px-2 py-0.5 rounded text-xs font-medium";
    switch (estado) {
      case "enviado": return <span className={`${base} bg-blue-100 text-blue-700`}>Enviado</span>;
      case "cambios_solicitados": return <span className={`${base} bg-amber-100 text-amber-700`}>Cambios solicitados</span>;
      case "aprobado": return <span className={`${base} bg-emerald-100 text-emerald-700`}>Aprobado</span>;
      case "borrador": return <span className={`${base} bg-gray-100 text-gray-700`}>Borrador</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-700`}>Sin acuerdo</span>;
    }
  }, [estado]);

  const enviar = async () => {
    if (!user?.email) return;
    setMsg("");
    await fetch(`http://localhost:5000/api/acuerdos/${user.email}/enviar`, { method: "POST" })
      .then(r => r.json())
      .then(() => {
        setMsg("Acuerdo enviado al tutor para revisión.");
        return fetch(`http://localhost:5000/api/acuerdos/${user.email}/ultima`).then(r => r.json()).then(setAcuerdo);
      })
      .catch(() => setMsg("No se pudo enviar. Intenta de nuevo."));
  };

  const descargarPDF = () => {
    if (!user?.email) return;
    window.open(`http://localhost:5000/api/acuerdos/${user.email}/exportar`, "_blank");
  };

  if (loading) return <p className="p-6 text-gray-600 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Cargando…</p>;
  if (!acuerdo) return <p className="p-6 text-gray-600">No tienes un acuerdo guardado todavía.</p>;

  return (
    <Sidebar siempreVisible>
      <div className="p-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquareText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Comunicación con tu tutor</h1>
        </div>

        <div className="bg-white border rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Estado del acuerdo (v{acuerdo.version})</div>
            <div className="mt-1">{badge}</div>
          </div>
          <div className="flex items-center gap-2">
            {estado === "aprobado" && (
              <button onClick={descargarPDF} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                <FileDown className="w-4 h-4" />
                Descargar PDF
              </button>
            )}
            {puedeEnviar && (
              <button onClick={enviar} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                <Send className="w-4 h-4" />
                Enviar a revisión
              </button>
            )}
          </div>
        </div>

        {msg && (
          <div className="mb-6 p-3 border rounded-lg bg-blue-50 text-blue-800 text-sm">
            {msg}
          </div>
        )}

        {/* Comentario global del tutor */}
        {acuerdo.comentarios_tutor ? (
          <div className="bg-white border rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Comentario del tutor</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{acuerdo.comentarios_tutor}</p>
          </div>
        ) : (
          estado === "enviado" && (
            <div className="bg-white border rounded-xl p-4 mb-6 text-amber-700 flex gap-2">
              <AlertTriangle className="w-5 h-5" />
              Tu acuerdo está enviado. El tutor aún no ha dejado comentarios.
            </div>
          )
        )}

        {/* Comentarios por bloque */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Comentarios por bloque</h2>
          <div className="space-y-3">
            {(acuerdo.bloques || []).map((b, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Bloque #{i + 1} {b.optatividad ? "· Optatividad" : ""}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {b.asignaturas_ugr?.map(a => a.nombre).join(", ")} ↔ {b.asignaturas_destino?.map(a => a.nombre).join(", ")}
                </div>
                {b.comentario_tutor ? (
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">{b.comentario_tutor}</div>
                ) : (
                  <div className="text-xs text-gray-400">Sin comentarios en este bloque.</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
