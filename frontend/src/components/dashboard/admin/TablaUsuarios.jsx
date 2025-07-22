import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EditarUsuarioModal from "./EditarUsuarioModal.jsx";

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);

  const cargar = () => {
    fetch("http://localhost:5000/usuarios")
      .then(res => res.json())
      .then(setUsuarios);
  };

  useEffect(cargar, []);

  const eliminar = async (email) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await fetch(`http://localhost:5000/usuarios/${email}`, { method: "DELETE" });
    cargar();
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Usuarios registrados</h2>
      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.email} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.nombre} {u.apellidos}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.rol}</td>
                <td className="p-3 text-center flex gap-3 justify-center">
                  <button onClick={() => setEditando(u)} className="text-blue-600 hover:text-blue-800" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => eliminar(u.email)} className="text-red-600 hover:text-red-800" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <EditarUsuarioModal
          usuario={editando}
          onClose={() => {
            setEditando(null);
            cargar();
          }}
        />
      )}
    </>
  );
}
