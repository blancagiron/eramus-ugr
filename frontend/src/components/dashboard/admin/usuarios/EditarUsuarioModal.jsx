import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditarUsuarioModal({ usuario: inicial, onClose, esNuevo = false }) {
  const [usuario, setUsuario] = useState(esNuevo ? { rol: "admin" } : inicial || {});
  const [grados, setGrados] = useState([]);
  const [todosLosDestinos, setTodosLosDestinos] = useState([]);
  const [busquedaDestino, setBusquedaDestino] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  useEffect(() => {
    fetch("http://localhost:5000/grados")
      .then((res) => res.json())
      .then(setGrados)
      .catch((error) => {
        console.error("Error al cargar grados:", error);
        setMensaje("Error al cargar los grados");
      });

    fetch("http://localhost:5000/api/destinos")
      .then((res) => res.json())
      .then(setTodosLosDestinos)
      .catch((error) => {
        console.error("Error al cargar destinos:", error);
        setMensaje("Error al cargar los destinos");
      });
  }, []);

  const destinosFiltrados = todosLosDestinos.filter((d) =>
    `${d.nombre_uni} ${d.codigo}`.toLowerCase().includes(busquedaDestino.toLowerCase())
  );

  const handleGradoChange = (e) => {
    const codigo_grado = e.target.value;
    const gradoSeleccionado = grados.find((g) => g.codigo === codigo_grado);
    if (gradoSeleccionado) {
      setUsuario((prev) => ({
        ...prev,
        codigo_grado,
        grado: gradoSeleccionado.nombre,
        codigo_centro: gradoSeleccionado.codigo_centro,
      }));
    }
  };

  const handleGuardar = async () => {
    try {
      const url = esNuevo
        ? "http://localhost:5000/usuarios/registro"
        : `http://localhost:5000/usuarios/${usuario.email}`;
      const method = esNuevo ? "POST" : "PATCH";

      const payload = { ...usuario };

      if (esNuevo) {
        payload.contraseña = usuario.contraseña || "temporal123";
        payload.rol = "admin";
      }

      if (usuario.rol === "estudiante") {
        const destino = usuario.destinos_asignados?.[0];
        if (destino) {
          payload.estado_proceso = "con destino";
          payload.destino_confirmado = destino;
          payload.destinos_asignados = [destino];
        } else {
          payload.estado_proceso = "sin destino";
          payload.destino_confirmado = null;
          payload.destinos_asignados = [];
        }
      } else if (usuario.rol === "tutor") {
        delete payload.destino_confirmado;
        delete payload.estado_proceso;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMensaje("Usuario guardado correctamente.");
        setTimeout(() => onClose(), 1500);
      } else {
        const data = await res.json();
        setMensaje(data.error || "Error al guardar los cambios");
      }
    } catch (error) {
      console.error("Error al guardar usuario", error);
      setMensaje("Error de red al guardar");
    }
  };

  const eliminarDestino = () => {
    setUsuario((prev) => ({
      ...prev,
      destinos_asignados: [],
      destino_confirmado: null,
      estado_proceso: "sin destino"
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>
            {esNuevo ? "Nuevo Administrador" : "Editar Usuario"}
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
            {/* Datos de acceso (solo para nuevos usuarios) */}
            {esNuevo && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Datos de acceso</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={usuario.email || ""}
                      onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                      placeholder="usuario@ejemplo.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Contraseña temporal</label>
                    <input
                      type="password"
                      value={usuario.contraseña || ""}
                      onChange={(e) => setUsuario({ ...usuario, contraseña: e.target.value })}
                      placeholder="Contraseña temporal"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Información personal */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    value={usuario.nombre || ""}
                    onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                    placeholder="Nombre del usuario"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Apellidos</label>
                  <input
                    value={usuario.apellidos || ""}
                    onChange={(e) => setUsuario({ ...usuario, apellidos: e.target.value })}
                    placeholder="Apellidos del usuario"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Rol y centro */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Rol y asignación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!esNuevo && (
                  <div className="md:col-span-2">
                    <label className="block text-base font-medium text-gray-700 mb-2">Rol</label>
                    <select
                      value={usuario.rol}
                      onChange={(e) => setUsuario({ ...usuario, rol: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="estudiante">Estudiante</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
                <div className={usuario.rol === "estudiante" ? "md:col-span-2" : ""}>
                  <label className="block text-base font-medium text-gray-700 mb-2">Código del centro</label>
                  <input
                    value={usuario.codigo_centro || ""}
                    onChange={(e) => setUsuario({ ...usuario, codigo_centro: e.target.value })}
                    placeholder="Código del centro"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={usuario.rol === "estudiante"}
                  />
                </div>
                {usuario.rol === "estudiante" && (
                  <div className="md:col-span-2">
                    <label className="block text-base font-medium text-gray-700 mb-2">Grado</label>
                    <select
                      value={usuario.codigo_grado || ""}
                      onChange={handleGradoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un grado</option>
                      {grados.map((g) => (
                        <option key={g.codigo} value={g.codigo}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Información específica para estudiantes */}
            {usuario.rol === "estudiante" && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Estado y destino</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Estado del proceso</label>
                    <select
                      value={usuario.estado_proceso || ""}
                      onChange={(e) => setUsuario({ ...usuario, estado_proceso: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="sin destino">Sin destino</option>
                      <option value="con destino">Con destino</option>
                      <option value="renunciado">Ha renunciado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Destino asignado</label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Buscar universidad..."
                        value={busquedaDestino}
                        onChange={(e) => setBusquedaDestino(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <select
                        value={usuario.destinos_asignados?.[0]?.codigo || ""}
                        onChange={(e) => {
                          const d = todosLosDestinos.find((dest) => dest.codigo === e.target.value);
                          if (d) {
                            const nuevo = { codigo: d.codigo, nombre_uni: d.nombre_uni };
                            setUsuario((prev) => ({
                              ...prev,
                              destinos_asignados: [nuevo],
                              destino_confirmado: nuevo,
                              estado_proceso: "con destino",
                            }));
                          }
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Selecciona un destino</option>
                        {destinosFiltrados.map((d) => (
                          <option key={d.codigo} value={d.codigo}>
                            {d.nombre_uni} ({d.codigo})
                          </option>
                        ))}
                      </select>

                      {usuario.destinos_asignados?.length > 0 && (
                        <button
                          onClick={eliminarDestino}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors duration-200"
                        >
                          Eliminar destino asignado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información específica para tutores */}
            {usuario.rol === "tutor" && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Destinos asignados</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Buscar destinos</label>
                    <input
                      type="text"
                      placeholder="Buscar destinos..."
                      value={busquedaDestino}
                      onChange={(e) => setBusquedaDestino(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Destinos (mantén Ctrl presionado para seleccionar múltiples)</label>
                    <select
                      multiple
                      value={(usuario.destinos_asignados || []).map((d) => d.codigo)}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions)
                          .map((opt) => {
                            const d = todosLosDestinos.find((d) => d.codigo === opt.value);
                            return d ? { codigo: d.codigo, nombre_uni: d.nombre_uni } : null;
                          })
                          .filter(Boolean);
                        setUsuario({ ...usuario, destinos_asignados: selected });
                      }}
                      className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {destinosFiltrados.map((d) => (
                        <option key={d.codigo} value={d.codigo}>
                          {d.nombre_uni} ({d.codigo})
                        </option>
                      ))}
                    </select>
                  </div>
                  {usuario.destinos_asignados?.length > 0 && (
                    <div className="bg-stone-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Destinos seleccionados:</p>
                      <div className="space-y-1">
                        {usuario.destinos_asignados.map((destino, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {destino.nombre_uni} ({destino.codigo})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
            onClick={handleGuardar} 
            className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Guardar usuario
          </button>
        </div>
      </div>
    </div>
  );
}