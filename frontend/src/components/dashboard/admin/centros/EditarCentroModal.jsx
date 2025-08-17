import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditarCentroModal({ centro, onClose }) {
  const [codigo, setCodigo] = useState(centro.codigo || "");
  const [nombre, setNombre] = useState(centro.nombre || "");
  const [responsableAcademico, setResponsableAcademico] = useState(centro.responsable_academico || "");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  const guardarCambios = async () => {
    const esNuevo = !centro._id;
    const url = esNuevo
      ? "http://localhost:5000/api/centros"
      : `http://localhost:5000/api/centros/${centro._id}`;
    const metodo = esNuevo ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, nombre, responsable_academico: responsableAcademico }),
      });

      if (res.ok) {
        setMensaje(esNuevo ? "Centro creado correctamente." : "Centro actualizado.");
        setTimeout(() => onClose(), 1500);
      } else {
        const data = await res.json();
        if (res.status === 409) {
          setMensaje("Ya existe un centro con ese código.");
        } else {
          setMensaje(data?.error || "Error desconocido al guardar.");
        }
      }
    } catch (error) {
      console.error("Error al guardar centro", error);
      setMensaje("Error de red al guardar.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>
            {centro._id ? "Editar Centro" : "Nuevo Centro"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {mensaje && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
              {mensaje}
            </div>
          )}

          <div className="space-y-6">
            {/* Información del centro */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información del centro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Código</label>
                  <input
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Código del centro"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del centro"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Responsable académico</label>
                  <input
                    value={responsableAcademico}
                    onChange={(e) => setResponsableAcademico(e.target.value)}
                    placeholder="Nombre completo del responsable"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-8 py-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={guardarCambios}
            className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Guardar centro
          </button>
        </div>
      </div>
    </div>
  );
}
