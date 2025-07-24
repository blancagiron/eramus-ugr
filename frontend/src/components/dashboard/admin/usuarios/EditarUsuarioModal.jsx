import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditarUsuarioModal({ usuario: inicial, onClose, esNuevo = false }) {
  const [usuario, setUsuario] = useState(
    esNuevo ? { rol: "admin" } : inicial || {}
  );
  const [grados, setGrados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/grados")
      .then((res) => res.json())
      .then(setGrados)
      .catch((err) => console.error("Error al cargar grados", err));
  }, []);

  const handleGuardar = async () => {
    try {
      const url = esNuevo
        ? "http://localhost:5000/usuarios/registro"
        : `http://localhost:5000/usuarios/${usuario.email}`;

      const method = esNuevo ? "POST" : "PATCH";

      const payload = esNuevo
        ? { ...usuario, contraseña: usuario.contraseña || "temporal123", rol: "admin" }
        : usuario;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || "Error al guardar los cambios");
      }
    } catch (error) {
      console.error("Error al guardar usuario", error);
      alert("Error de red al guardar");
    }
  };

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
          <div className="space-y-6">
            {/* Información de acceso */}
            {esNuevo && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Información de acceso</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={usuario.email || ""}
                      onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Contraseña</label>
                    <input
                      type="password"
                      placeholder="Contraseña temporal"
                      value={usuario.contraseña || ""}
                      onChange={(e) => setUsuario({ ...usuario, contraseña: e.target.value })}
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
                    placeholder="Nombre"
                    value={usuario.nombre || ""}
                    onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Apellidos</label>
                  <input
                    placeholder="Apellidos"
                    value={usuario.apellidos || ""}
                    onChange={(e) => setUsuario({ ...usuario, apellidos: e.target.value })}
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
                  <label className="block text-base font-medium text-gray-700 mb-2">Centro</label>
                  <input
                    placeholder="Código del centro"
                    value={usuario.codigo_centro || ""}
                    onChange={(e) => setUsuario({ ...usuario, codigo_centro: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
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
