import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditarGradoModal({ grado, onClose }) {
  const [datos, setDatos] = useState({
    ...grado,
    codigo: grado.codigo || "",
    sigla: grado.sigla || "",
    nombre: grado.nombre || "",
    codigo_centro: grado.codigo_centro || ""
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  const guardar = async () => {
    if (!datos.codigo || !datos.nombre || !datos.sigla || !datos.codigo_centro) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    const esNuevo = !grado._id;
    const url = esNuevo
      ? "http://localhost:5000/grados"
      : `http://localhost:5000/grados/${grado._id}`;
    const metodo = esNuevo ? "POST" : "PATCH";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (res.ok) {
      setMensaje(esNuevo ? "Grado creado correctamente." : "Grado actualizado.");
      setTimeout(() => onClose(), 1500);
    } else {
      const data = await res.json();
      if (res.status === 409) {
        setMensaje("Ya existe un grado con ese código.");
      } else {
        setMensaje(data?.error || "Error desconocido.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {grado._id ? "Editar Grado" : "Nuevo Grado"}
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
            <input
              value={datos.codigo}
              onChange={(e) => setDatos({ ...datos, codigo: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sigla</label>
            <input
              value={datos.sigla}
              onChange={(e) => setDatos({ ...datos, sigla: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código del centro</label>
            <input
              value={datos.codigo_centro}
              onChange={(e) => setDatos({ ...datos, codigo_centro: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={guardar} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
