// RenunciaDestinoCard.jsx
import { useEffect, useRef, useState } from "react";

export default function RenunciaDestinoCard({
  rol,
  perfil,
  email,
  onPerfilActualizado,   // (perfilActualizado) => void
  setMensaje,            // (string) => void
  setTipoMensaje,        // ("exito" | "error") => void
  onAfterRenuncia,       // () => void (opcional)
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (rol !== "estudiante" || !perfil?.destino_confirmado) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/usuarios/${encodeURIComponent(email)}/renunciar-destino`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo renunciar.");

      // refrescar perfil desde backend
      const actualizado = await fetch(`http://localhost:5000/usuarios/${encodeURIComponent(email)}`).then(r => r.json());
      onPerfilActualizado?.(actualizado);

      // coherencia local
      const local = JSON.parse(localStorage.getItem("usuario") || "{}");
      local.estado_proceso = "sin destino";
      delete local.destino_confirmado;
      delete local.destinos_asignados;
      localStorage.setItem("usuario", JSON.stringify(local));

      setMensaje?.("Has renunciado al destino.");
      setTipoMensaje?.("exito");
      setOpen(false);
      setMotivo("");
      onAfterRenuncia?.();
    } catch (e) {
      setMensaje?.(e.message);
      setTipoMensaje?.("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 mb-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-red-700">
            Tienes destino asignado: <strong>{perfil.destino_confirmado.nombre_uni}</strong>
          </p>
          <p className="text-xs text-red-600">
            Si renuncias, se eliminarán tus acuerdos y volverás a “sin destino”.
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => setOpen(true)}
        >
          Renunciar al destino
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-labelledby="renuncia-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !loading && setOpen(false)}
          />
          {/* Dialog */}
          <div
            ref={dialogRef}
            className="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white shadow-xl border border-gray-200 p-6"
          >
            <h3 id="renuncia-title" className="text-lg font-semibold text-gray-900">
              Confirmar renuncia al destino
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Esta acción eliminará tus acuerdos y te devolverá al estado <strong>“sin destino”</strong>.
            </p>

            <label className="block text-sm text-gray-700 mt-4 mb-1">
              Motivo (opcional)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Escribe un motivo si quieres…"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              disabled={loading}
            />

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Procesando…" : "Confirmar renuncia"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
