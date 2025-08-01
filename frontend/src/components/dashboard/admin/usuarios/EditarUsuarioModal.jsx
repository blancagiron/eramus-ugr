import { useState, useEffect } from "react";
import { X, Search, Plus, Trash2, MapPin, Building, User, Mail, GraduationCap, Shield } from "lucide-react";

export default function EditarUsuarioModal({ usuario: inicial, onClose, esNuevo = false }) {
  const [usuario, setUsuario] =  useState(
    esNuevo
      ? { rol: "admin", primer_apellido: "", segundo_apellido: "" }
      : inicial || {}
  );
  const [grados, setGrados] = useState([]);
  const [todosLosDestinos, setTodosLosDestinos] = useState([]);
  const [busquedaDestino, setBusquedaDestino] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [asignadosPrevios, setAsignadosPrevios] = useState([]);
  const [mostrarListaDestinos, setMostrarListaDestinos] = useState(false);

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
      .then((datos) => {
        const destinosConPlazas = datos.map((destino) => {
          const total = destino.plazas || 0;
          const ocupados = destino.estudiantes_asignados || 0;
          return {
            ...destino,
            plazas_disponibles: total - ocupados
          };
        });
        setTodosLosDestinos(destinosConPlazas);

        if (usuario.rol === "tutor") {
          setAsignadosPrevios((usuario.destinos_asignados || []).map((d) => d.codigo));
        }
      })
      .catch((error) => {
        console.error("Error al cargar destinos:", error);
        setMensaje("Error al cargar los destinos");
      });
  }, []);

  const destinosFiltrados = todosLosDestinos.filter((d) =>
    `${d.nombre_uni} ${d.codigo}`.toLowerCase().includes(busquedaDestino.toLowerCase())
  );

  const destinosDisponibles = todosLosDestinos.filter((d) =>
    (!d.tutor_asignado || d.tutor_asignado === usuario.email) &&
    d.codigo_centro_ugr === usuario.codigo_centro
  );

  const destinosDisponiblesFiltrados = destinosDisponibles.filter((d) =>
    `${d.nombre_uni} ${d.codigo}`.toLowerCase().includes(busquedaDestino.toLowerCase()) &&
    !(usuario.destinos_asignados || []).some(asignado => asignado.codigo === d.codigo)
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

  const agregarDestino = (destino) => {
    const nuevoDestino = { codigo: destino.codigo, nombre_uni: destino.nombre_uni };

    if (usuario.rol === "estudiante") {
      setUsuario((prev) => ({
        ...prev,
        destinos_asignados: [nuevoDestino],
        destino_confirmado: nuevoDestino,
        estado_proceso: "con destino",
      }));
    } else {
      setUsuario((prev) => ({
        ...prev,
        destinos_asignados: [...(prev.destinos_asignados || []), nuevoDestino]
      }));
    }

    setBusquedaDestino("");
    setMostrarListaDestinos(false);
  };

  const eliminarDestino = (codigo) => {
    setUsuario((prev) => ({
      ...prev,
      destinos_asignados: (prev.destinos_asignados || []).filter((d) => d.codigo !== codigo),
      ...(prev.rol === "estudiante" && {
        destino_confirmado: null,
        estado_proceso: "sin destino",
      }),
    }));
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
      }

      if (usuario.rol === "tutor") {
        const actuales = usuario.destinos_asignados?.map((d) => d.codigo) || [];
        const eliminados = asignadosPrevios.filter((codigo) => !actuales.includes(codigo));
        payload.eliminados = eliminados;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
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
            {/* Información básica del usuario */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Información del usuario
              </h3>

              {esNuevo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="Email del usuario"
                      value={usuario.email || ""}
                      onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Contraseña temporal</label>
                    <input
                      type="password"
                      placeholder="Contraseña temporal"
                      value={usuario.contraseña || ""}
                      onChange={(e) => setUsuario({ ...usuario, contraseña: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    placeholder="Nombre del usuario"
                    value={usuario.nombre || ""}
                    onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Primer Apellido</label>
                  <input
                    placeholder="Primer apellido"
                    value={usuario.primer_apellido || ""}
                    onChange={(e) => setUsuario({ ...usuario, primer_apellido: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Segundo Apellido</label>
                  <input
                    placeholder="Segundo apellido"
                    value={usuario.segundo_apellido || ""}
                    onChange={(e) => setUsuario({ ...usuario, segundo_apellido: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {!esNuevo && (
                  <div>
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

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Código del centro</label>
                  <input
                    placeholder="Código del centro"
                    value={usuario.codigo_centro || ""}
                    onChange={(e) => setUsuario({ ...usuario, codigo_centro: e.target.value })}
                    disabled={usuario.rol === "estudiante"}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Sección específica para estudiantes */}
            {usuario.rol === "estudiante" && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Información académica
                </h3>
                <div className="space-y-6">
                  <div>
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

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Destino asignado</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar universidad..."
                        value={busquedaDestino}
                        onChange={(e) => {
                          setBusquedaDestino(e.target.value);
                          setMostrarListaDestinos(e.target.value.length > 0);
                        }}
                        onFocus={() => setMostrarListaDestinos(busquedaDestino.length > 0)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Lista desplegable de destinos para estudiantes */}
                    {mostrarListaDestinos && destinosFiltrados.length > 0 && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {destinosFiltrados.slice(0, 10).map((destino) => {
                          const sinPlazas = (destino.plazas_disponibles ?? destino.plazas ?? 0) - (destino.estudiantes_asignados ?? 0) <= 0;
                          const isAsignado = usuario.destinos_asignados?.some((d) => d.codigo === destino.codigo);
                          const plazasDisponibles = (destino.plazas ?? 0) - (destino.estudiantes_asignados ?? 0);

                          return (
                            <button
                              key={destino.codigo}
                              onClick={() => !sinPlazas && agregarDestino(destino)}
                              className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors flex items-center justify-between group ${sinPlazas && !isAsignado ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50"
                                }`}
                              disabled={sinPlazas && !isAsignado}
                              title={sinPlazas && !isAsignado ? "No hay plazas disponibles" : ""}
                            >
                              <div>
                                <div className="font-medium text-gray-900">{destino.nombre_uni}</div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <Building className="w-3 h-3 mr-1" />
                                  {destino.codigo} — Plazas: {plazasDisponibles}/{destino.plazas}
                                </div>
                              </div>
                              {!sinPlazas && (
                                <Plus className="w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Destino asignado actual */}
                    {usuario.destinos_asignados?.length > 0 && (
                      <div className="mt-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {usuario.destinos_asignados[0].nombre_uni}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Building className="w-3 h-3 mr-1" />
                                Código: {usuario.destinos_asignados[0].codigo}
                              </div>
                            </div>
                            <button
                              onClick={() => eliminarDestino(usuario.destinos_asignados[0].codigo)}
                              className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors group"
                              title="Quitar destino"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sección específica para tutores */}
            {usuario.rol === "tutor" && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Gestión de destinos
                </h3>

                {/* Buscador de destinos */}
                <div className="mb-6">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Buscar y agregar destinos
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar destinos por nombre o código..."
                      value={busquedaDestino}
                      onChange={(e) => {
                        setBusquedaDestino(e.target.value);
                        setMostrarListaDestinos(e.target.value.length > 0);
                      }}
                      onFocus={() => setMostrarListaDestinos(busquedaDestino.length > 0)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Lista desplegable de destinos disponibles */}
                  {mostrarListaDestinos && destinosDisponiblesFiltrados.length > 0 && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {destinosDisponiblesFiltrados.slice(0, 10).map((destino) => (
                        <button
                          key={destino.codigo}
                          onClick={() => agregarDestino(destino)}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 border-b border-gray-100 last:border-b-0 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{destino.nombre_uni}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Building className="w-3 h-3 mr-1" />
                              {destino.codigo}
                            </div>
                          </div>
                          <Plus className="w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destinos asignados */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Destinos asignados ({usuario.destinos_asignados?.length || 0})
                  </label>

                  {usuario.destinos_asignados?.length > 0 ? (
                    <div className="grid gap-3">
                      {usuario.destinos_asignados.map((destino) => (
                        <div
                          key={destino.codigo}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {destino.nombre_uni}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Building className="w-3 h-3 mr-1" />
                                Código: {destino.codigo}
                              </div>
                            </div>
                            <button
                              onClick={() => eliminarDestino(destino.codigo)}
                              className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                              title="Quitar destino"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        No hay destinos asignados. Utiliza el buscador para agregar destinos.
                      </p>
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