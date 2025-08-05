import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Sidebar from "../../Sidebar";
import DashboardHeader from "../../DashboardHeader";
import Hamburguesa from "../../Hamburguesa";
import Pagination from "../../../Pagination";
import EditarGradoModal from "./EditarGradoModal";

export default function GestionGrados() {
  const [grados, setGrados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const porPagina = 5;

  const cargarGrados = () => {
    fetch("http://localhost:5000/grados")
      .then(res => res.json())
      .then(setGrados);
  };

  useEffect(cargarGrados, []);

  const gradosMostrados = grados.slice((pagina - 1) * porPagina, pagina * porPagina);
  const totalPaginas = Math.ceil(grados.length / porPagina);

  const confirmarEliminacion = (id) => setConfirmacion(id);

  const eliminarGrado = async () => {
    await fetch(`http://localhost:5000/grados/${confirmacion}`, { method: "DELETE" });
    setMensaje("Grado eliminado con éxito.");
    setConfirmacion(null);
    cargarGrados();
  };

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible(!sidebarVisible)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen transition-all duration-300">
          <DashboardHeader
            titulo="Gestión de Grados"
            subtitulo="Administra los grados universitarios registrados"
          />

          <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-6">
            <button
              onClick={() => setEditando({})}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear nuevo grado
            </button>

            <div className="overflow-auto border rounded-xl shadow-sm bg-white">
              <table className="w-full table-auto text-base">
                <thead className="bg-gray-50 border-b text-left" style={{ fontFamily: "Inter, sans-serif" }}>
                  <tr>
                    <th className="p-4 font-semibold text-gray-700">Código</th>
                    <th className="p-4 font-semibold text-gray-700">Sigla</th>
                    <th className="p-4 font-semibold text-gray-700">Nombre</th>
                    <th className="p-4 font-semibold text-gray-700">Centro</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gradosMostrados.map((g) => (
                    <tr key={g.codigo} className="border-t hover:bg-gray-50">
                      <td className="p-4">{g.codigo}</td>
                      <td className="p-4">{g.sigla}</td>
                      <td className="p-4">{g.nombre}</td>
                      <td className="p-4">{g.codigo_centro}</td>
                      <td className="p-4 flex justify-center gap-3">
                        <button onClick={() => setEditando(g)} className="text-blue-600 hover:text-blue-800">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => confirmarEliminacion(g._id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {gradosMostrados.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-500">No hay grados para mostrar.</p>
              )}
            </div>

            {confirmacion && (
              <div className="bg-white shadow-xl border border-red-200 p-4 rounded-md mt-4 text-center space-y-4">
                <p>¿Estás seguro de que quieres eliminar este grado?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={eliminarGrado} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Sí, eliminar</button>
                  <button onClick={() => setConfirmacion(null)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
                </div>
              </div>
            )}

            {mensaje && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center mt-4">
                {mensaje}
              </div>
            )}

            <Pagination total={totalPaginas} actual={pagina} setActual={setPagina} />
          </div>

          {editando && (
            <EditarGradoModal
              grado={editando}
              onClose={() => {
                setEditando(null);
                cargarGrados();
              }}
            />
          )}
        </div>
      </Sidebar>
    </>
  );
}
