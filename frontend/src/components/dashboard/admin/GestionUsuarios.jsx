import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import { Pencil, Trash2, User } from "lucide-react";
import EditarUsuarioModal from "./EditarUsuarioModal";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const cargarUsuarios = () => {
    fetch("http://localhost:5000/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data));
  };

  useEffect(cargarUsuarios, []);

  const eliminarUsuario = async (email) => {
    if (!window.confirm("¿Eliminar este usuario? Esta acción es irreversible.")) return;

    await fetch(`http://localhost:5000/usuarios/${email}`, { method: "DELETE" });
    cargarUsuarios();
  };

  return (
    <Sidebar visible={sidebarVisible}>
      <div className="min-h-screen transition-all duration-300">
        

        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <div className="overflow-auto border rounded-xl shadow-sm">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50 border-b text-left">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Nombre</th>
                  <th className="p-4 font-semibold text-gray-700">Email</th>
                  <th className="p-4 font-semibold text-gray-700">Rol</th>
                  <th className="p-4 text-center font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.email} className="border-t hover:bg-gray-50">
                    <td className="p-4">{u.nombre} {u.apellidos}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 capitalize">{u.rol}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button onClick={() => setEditando(u)} className="text-blue-600 hover:text-blue-800" title="Editar">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => eliminarUsuario(u.email)} className="text-red-600 hover:text-red-800" title="Eliminar">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuarios.length === 0 && (
              <p className="p-6 text-center text-sm text-gray-500">
                No hay usuarios registrados.
              </p>
            )}
          </div>
        </div>

        {editando && (
          <EditarUsuarioModal
            usuario={editando}
            onClose={() => {
              setEditando(null);
              cargarUsuarios();
            }}
          />
        )}
      </div>
    </Sidebar>
  );
}
