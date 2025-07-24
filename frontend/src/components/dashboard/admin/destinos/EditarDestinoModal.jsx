import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export default function EditarDestinoModal({ destino, onClose }) {
  const [datos, setDatos] = useState({
    ...destino,
    asignaturas: destino.asignaturas || [],
    imagenes: destino.imagenes || [],
  });

  const [mensaje, setMensaje] = useState("");
  const [asignaturasIniciales] = useState(destino.asignaturas?.length || 0);

  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  const añadirAsignatura = () => {
    setDatos(prev => ({
      ...prev,
      asignaturas: [...prev.asignaturas, { codigo: "", nombre: "", creditos: 0 }]
    }));
  };

  const actualizarAsignatura = (index, campo, valor) => {
    const nuevas = [...datos.asignaturas];
    nuevas[index][campo] = valor;
    setDatos({ ...datos, asignaturas: nuevas });
  };

  const eliminarAsignatura = async (index) => {
    const nuevas = [...datos.asignaturas];
    nuevas.splice(index, 1);

    if (datos._id) {
      await fetch(`http://localhost:5000/api/destinos/${datos._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asignaturas: nuevas }),
      });
      setMensaje("Asignatura eliminada correctamente");
    }

    setDatos({ ...datos, asignaturas: nuevas });
  };

  const guardar = async () => {
    const camposRequeridos = ["codigo", "nombre_uni", "pais", "requisitos_idioma", "plazas", "meses"];
    for (const campo of camposRequeridos) {
      if (!datos[campo]) {
        alert(`Falta el campo obligatorio: ${campo}`);
        return;
      }
    }

    const esNuevo = !destino._id;
    const metodo = esNuevo ? "POST" : "PATCH";
    const url = esNuevo
      ? "http://localhost:5000/api/destinos"
      : `http://localhost:5000/api/destinos/${destino._id}`;

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (res.ok) {
      if (datos.asignaturas.length > asignaturasIniciales) {
        setMensaje("Destino guardado y asignaturas añadidas con éxito.");
      } else {
        setMensaje("Destino guardado correctamente.");
      }
      setTimeout(() => onClose(), 2000);
    } else {
      const err = await res.json();
      alert("Error al guardar: " + (err?.error || "desconocido"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>
            {destino._id ? "Editar Destino" : "Nuevo Destino"}
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
                  <label className="block text-base font-medium text-gray-700 mb-2">Código destino</label>
                  <input 
                    placeholder="Código destino" 
                    value={datos.codigo || ""} 
                    onChange={(e) => setDatos({ ...datos, codigo: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Nombre universidad</label>
                  <input 
                    placeholder="Nombre universidad" 
                    value={datos.nombre_uni || ""} 
                    onChange={(e) => setDatos({ ...datos, nombre_uni: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">País</label>
                  <input 
                    placeholder="País" 
                    value={datos.pais || ""} 
                    onChange={(e) => setDatos({ ...datos, pais: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Idioma requerido</label>
                  <input 
                    placeholder="Idioma requerido" 
                    value={datos.requisitos_idioma || ""} 
                    onChange={(e) => setDatos({ ...datos, requisitos_idioma: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Plazas</label>
                  <input 
                    type="number" 
                    placeholder="Plazas" 
                    value={datos.plazas || ""} 
                    onChange={(e) => setDatos({ ...datos, plazas: parseInt(e.target.value) || 0 })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Meses</label>
                  <input 
                    type="number" 
                    placeholder="Meses" 
                    value={datos.meses || ""} 
                    onChange={(e) => setDatos({ ...datos, meses: parseInt(e.target.value) || 0 })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Enlace web universidad</label>
                  <input 
                    placeholder="https://..." 
                    value={datos.web || ""} 
                    onChange={(e) => setDatos({ ...datos, web: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Latitud</label>
                  <input 
                    placeholder="Ej: 37.1773" 
                    value={datos.lat || ""} 
                    onChange={(e) => setDatos({ ...datos, lat: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Longitud</label>
                  <input 
                    placeholder="Ej: -3.5986" 
                    value={datos.lng || ""} 
                    onChange={(e) => setDatos({ ...datos, lng: e.target.value })} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Asignaturas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Asignaturas</h3>
                <button 
                  onClick={añadirAsignatura} 
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Añadir asignatura
                </button>
              </div>
              
              <div className="space-y-4">
                {datos.asignaturas.map((a, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
                        <input 
                          placeholder="Código" 
                          value={a.codigo} 
                          onChange={(e) => actualizarAsignatura(i, "codigo", e.target.value)} 
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input 
                          placeholder="Nombre de la asignatura" 
                          value={a.nombre} 
                          onChange={(e) => actualizarAsignatura(i, "nombre", e.target.value)} 
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Créditos</label>
                        <input 
                          type="number" 
                          placeholder="6" 
                          value={a.creditos || ""} 
                          onChange={(e) => actualizarAsignatura(i, "creditos", parseFloat(e.target.value) || 0)} 
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => eliminarAsignatura(i)} 
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                      >
                        Eliminar asignatura
                      </button>
                    </div>
                  </div>
                ))}
                
                {datos.asignaturas.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay asignaturas añadidas</p>
                    <p className="text-sm">Haz clic en "Añadir asignatura" para empezar</p>
                  </div>
                )}
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
            Guardar destino
          </button>
        </div>
      </div>
    </div>
  );
}