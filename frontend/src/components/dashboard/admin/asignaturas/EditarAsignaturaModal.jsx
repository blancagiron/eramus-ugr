import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditarAsignaturaModal({ asignatura, onClose }) {
  const [datos, setDatos] = useState({
    codigo: asignatura.codigo || "",
    nombre: asignatura.nombre || "",
    creditos: asignatura.creditos || 0,
    curso: asignatura.curso || 1,
    grado: asignatura.grado || "",
    codigo_grado: asignatura.codigo_grado || "",
    centro: asignatura.centro || ""
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  const guardar = async () => {
    const url = "http://localhost:5000/asignaturas";
    const res = await fetch(url, {
      method: "POST", // siempre POST porque insertamos (no hay PATCH aún)
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (res.ok) {
      setMensaje("Asignatura guardada correctamente.");
      setTimeout(() => onClose(), 1500);
    } else {
      const data = await res.json();
      setMensaje(data?.error || "Error al guardar.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {asignatura.codigo ? "Editar Asignatura" : "Nueva Asignatura"}
          </h2>
          <button onClick={onClose} className="hover:bg-gray-200 p-2 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {mensaje && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded">
              {mensaje}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Código</label>
            <input value={datos.codigo} onChange={(e) => setDatos({ ...datos, codigo: e.target.value })} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Créditos</label>
            <input type="number" value={datos.creditos} onChange={(e) => setDatos({ ...datos, creditos: parseFloat(e.target.value) || 0 })} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Curso</label>
            <input type="number" value={datos.curso} onChange={(e) => setDatos({ ...datos, curso: parseInt(e.target.value) || 1 })} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sigla Grado</label>
            <input value={datos.grado} onChange={(e) => setDatos({ ...datos, grado: e.target.value })} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código Grado</label>
            <input value={datos.codigo_grado} onChange={(e) => setDatos({ ...datos, codigo_grado: e.target.value })} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código Centro</label>
            <input value={datos.centro} onChange={(e) => setDatos({ ...datos, centro: e.target.value })} className="w-full border p-2 rounded" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
          <button onClick={guardar} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Guardar</button>
        </div>
      </div>
    </div>
  );
}
