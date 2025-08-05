import { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import DashboardHeader from "../../DashboardHeader";
import { Pencil, Trash2, Plus } from "lucide-react";
import EditarUsuarioModal from "./EditarUsuarioModal";
import Pagination from "../../../Pagination";
import Hamburguesa from "../../Hamburguesa";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [esNuevo, setEsNuevo] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [confirmacion, setConfirmacion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const porPagina = 5;

  const cargarUsuarios = () => {
    fetch("http://localhost:5000/usuarios")
      .then(res => res.json())
      .then(setUsuarios);
  };

  useEffect(cargarUsuarios, []);

  const usuariosMostrados = usuarios.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  const totalPaginas = Math.ceil(usuarios.length / porPagina);

  const confirmarEliminacion = (email) => setConfirmacion(email);

  const eliminarUsuario = async () => {
    await fetch(`http://localhost:5000/usuarios/${confirmacion}`, { method: "DELETE" });
    setMensaje("Usuario eliminado con éxito.");
    setConfirmacion(null);
    cargarUsuarios();
  };

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible(prev => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen transition-all duration-300">
          <DashboardHeader
            titulo="Gestión de Usuarios"
            subtitulo="Administra los usuarios registrados en la plataforma"
          />

          <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-6">
            {/* Botón para dar de alta nuevo admin */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditando({ rol: "admin" });
                  setEsNuevo(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Dar de alta nuevo admin
              </button>
            </div>

            <div className="overflow-auto border rounded-xl shadow-sm bg-white">
              <table className="w-full table-auto text-base">
                <thead className="bg-gray-50 border-b text-left text-base" style={{ fontFamily: "Inter, sans-serif" }}>
                  <tr>
                    <th className="p-4 font-semibold text-gray-700">Nombre</th>
                    <th className="p-4 font-semibold text-gray-700">Email</th>
                    <th className="p-4 font-semibold text-gray-700">Rol</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosMostrados.map((u) => (
                    <tr key={u.email} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        {u.nombre} {u.primer_apellido} {u.segundo_apellido}
                      </td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4 capitalize">{u.rol}</td>
                      <td className="p-4 flex justify-center gap-3">
                        <button onClick={() => {
                          setEditando(u);
                          setEsNuevo(false);
                        }} className="text-blue-600 hover:text-blue-800" title="Editar">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => confirmarEliminacion(u.email)} className="text-red-600 hover:text-red-800" title="Eliminar">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {usuariosMostrados.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-500">
                  No hay usuarios para mostrar en esta página.
                </p>
              )}
            </div>

            {/* Confirmación de eliminación */}
            {confirmacion && (
              <div className="bg-white shadow-xl border border-red-200 p-4 rounded-md mt-4 text-center space-y-4">
                <p>¿Estás seguro de que quieres eliminar este usuario?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={eliminarUsuario} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Sí, eliminar</button>
                  <button onClick={() => setConfirmacion(null)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
                </div>
              </div>
            )}

            {/* Mensaje de éxito */}
            {mensaje && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-4 text-center">
                {mensaje}
              </div>
            )}

            <Pagination total={totalPaginas} actual={pagina} setActual={setPagina} />
          </div>

          {editando && (
            <EditarUsuarioModal
              usuario={editando}
              esNuevo={esNuevo}
              onClose={() => {
                setEditando(null);
                setEsNuevo(false);
                cargarUsuarios();
              }}
            />
          )}
        </div>
      </Sidebar>
    </>
  );
}
