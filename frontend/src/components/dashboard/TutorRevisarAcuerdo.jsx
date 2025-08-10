// src/dashboard/TutorRevisarAcuerdo.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { GraduationCap, CheckCircle2, Reply, Loader2 } from "lucide-react";

export default function TutorRevisarAcuerdo() {
  const { email } = useParams(); // email del estudiante
  const [acuerdo, setAcuerdo] = useState(null);
  const [globalComment, setGlobalComment] = useState("");
  const [bloqueComments, setBloqueComments] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/acuerdos/${email}/ultima`)
      .then(r => r.ok ? r.json() : null)
      .then((doc) => {
        setAcuerdo(doc);
        setGlobalComment(doc?.comentarios_tutor || "");
        const mapping = {};
        (doc?.bloques || []).forEach((b, i) => mapping[i] = b.comentario_tutor || "");
        setBloqueComments(mapping);
      });
  }, [email]);

  const updateBloqueComment = (i, v) => setBloqueComments(prev => ({ ...prev, [i]: v }));

  const pedirCambios = async () => {
    setSaving(true);
    setMsg("");
    const payload = {
      comentarios_tutor: globalComment,
      bloques: Object.entries(bloqueComments).map(([index, comentario]) => ({ index: Number(index), comentario }))
    };
    await fetch(`http://localhost:5000/api/acuerdos/${email}/pedir-cambios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => r.json())
      .then(() => setMsg("Has solicitado cambios al estudiante."))
      .finally(() => setSaving(false));
  };

  const aprobar = async () => {
    setSaving(true);
    setMsg("");
    await fetch(`http://localhost:5000/api/acuerdos/${email}/aprobar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comentarios_tutor: globalComment })
    }).then(r => r.json())
      .then(() => setMsg("Acuerdo aprobado."))
      .finally(() => setSaving(false));
  };

  if (!acuerdo) return <p className="p-6 text-gray-600 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Cargando…</p>;

  return (
    <Sidebar>
      <div className="p-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-semibold">
            Revisar acuerdo — {email} (v{acuerdo.version})
          </h1>
        </div>

        {msg && <div className="mb-4 p-3 border rounded bg-emerald-50 text-emerald-800 text-sm">{msg}</div>}

        <div className="bg-white border rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Comentario global</h2>
          <textarea
            className="w-full input h-28"
            value={globalComment}
            onChange={(e) => setGlobalComment(e.target.value)}
            placeholder="Escribe un comentario general para el estudiante…"
          />
        </div>

        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Comentarios por bloque</h2>
          <div className="space-y-4">
            {(acuerdo.bloques || []).map((b, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Bloque #{i + 1}</span>
                  {b.optatividad ? " · Optatividad" : ""} —{" "}
                  <span className="text-gray-500">
                    {b.asignaturas_ugr?.map(a => a.nombre).join(", ")} ↔ {b.asignaturas_destino?.map(a => a.nombre).join(", ")}
                  </span>
                </div>
                <textarea
                  className="w-full input h-24"
                  value={bloqueComments[i] || ""}
                  onChange={(e) => updateBloqueComment(i, e.target.value)}
                  placeholder="Anota correcciones o feedback específico de este bloque…"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={pedirCambios}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              <Reply className="w-4 h-4" />
              Pedir cambios
            </button>
            <button
              onClick={aprobar}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4" />
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
