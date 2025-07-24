import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditarAsignaturaModal({ asignatura, onClose }) {
  const [datos, setDatos] = useState({
    _id: asignatura._id || null,
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
    const esNueva = !asignatura._id;

    const url = esNueva
      ? "http://localhost:5000/asignaturas"
      : `http://localhost:5000/asignaturas/${datos.codigo}`;

    const metodo = esNueva ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method: metodo,
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
    } catch (error) {
      console.error("Error al guardar asignatura", error);
      setMensaje("Error de red al guardar");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>
            {asignatura._id ? "Editar Asignatura" : "Nueva Asignatura"}
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
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-green-600 font-medium">{mensaje}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Información básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Código</label>
                  <input 
                    placeholder="Código de la asignatura"
                    value={datos.codigo} 
                    onChange={(e) => setDatos({ ...datos, codigo: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Nombre</label>
                  <input 
                    placeholder="Nombre de la asignatura"
                    value={datos.nombre} 
                    onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Créditos</label>
                  <input 
                    type="number" 
                    placeholder="6"
                    value={datos.creditos} 
                    onChange={(e) => setDatos({ ...datos, creditos: parseFloat(e.target.value) || 0 })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Curso</label>
                  <input 
                    type="number" 
                    placeholder="1"
                    value={datos.curso} 
                    onChange={(e) => setDatos({ ...datos, curso: parseInt(e.target.value) || 1 })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información académica */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información académica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Sigla Grado</label>
                  <input 
                    placeholder="Ej: GII, GITT"
                    value={datos.grado} 
                    onChange={(e) => setDatos({ ...datos, grado: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Código Grado</label>
                  <input 
                    placeholder="Código del grado"
                    value={datos.codigo_grado} 
                    onChange={(e) => setDatos({ ...datos, codigo_grado: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-base font-medium text-gray-700 mb-2">Código Centro</label>
                  <input 
                    placeholder="Código del centro"
                    value={datos.centro} 
                    onChange={(e) => setDatos({ ...datos, centro: e.target.value })} 
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
            onClick={guardar} 
            className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Guardar asignatura
          </button>
        </div>
      </div>
    </div>
  );
}