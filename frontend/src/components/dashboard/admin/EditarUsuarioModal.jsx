import { useState, useEffect } from "react";

export default function EditarUsuarioModal({ usuario: inicial, onClose }) {
  const [usuario, setUsuario] = useState(inicial);
  const [grados, setGrados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/grados")
      .then((res) => res.json())
      .then(setGrados)
      .catch((err) => console.error("Error al cargar grados", err));
  }, []);

  const handleGuardar = async () => {
    try {
      const res = await fetch(`http://localhost:5000/usuarios/${usuario.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (res.ok) {
        onClose();
      } else {
        alert("Error al guardar los cambios");
      }
    } catch (error) {
      console.error("Error al actualizar usuario", error);
      alert("Error de red al guardar");
    }
  };

  const handleGradoChange = (e) => {
    const codigo_grado = e.target.value;
    const gradoSeleccionado = grados.find(g => g.codigo === codigo_grado);

    if (gradoSeleccionado) {
      setUsuario(prev => ({
        ...prev,
        codigo_grado,
        grado: gradoSeleccionado.nombre,
        codigo_centro: gradoSeleccionado.codigo_centro
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              value={usuario.nombre}
              onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Apellidos</label>
            <input
              value={usuario.apellidos}
              onChange={(e) => setUsuario({ ...usuario, apellidos: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Rol</label>
            <select
              value={usuario.rol}
              onChange={(e) => setUsuario({ ...usuario, rol: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="estudiante">Estudiante</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Centro</label>
            <input
              value={usuario.codigo_centro || ""}
              onChange={(e) => setUsuario({ ...usuario, codigo_centro: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              disabled={usuario.rol === "estudiante"}
            />
          </div>
          {usuario.rol === "estudiante" && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Grado</label>
              <select
                value={usuario.codigo_grado || ""}
                onChange={handleGradoChange}
                className="w-full border px-3 py-2 rounded-md"
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

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
