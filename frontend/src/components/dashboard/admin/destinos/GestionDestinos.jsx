import { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import DashboardHeader from "../../DashboardHeader";
import { Pencil, Trash2, Plus } from "lucide-react";
import EditarDestinoModal from "./EditarDestinoModal";
import Pagination from "../../../Pagination";
import Hamburguesa from "../../Hamburguesa";

export default function GestionDestinos() {
  const [destinos, setDestinos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [confirmacion, setConfirmacion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const porPagina = 5;

  const cargarDestinos = () => {
    fetch("http://localhost:5000/api/destinos")
      .then(res => res.json())
      .then(setDestinos);
  };

  useEffect(cargarDestinos, []);

  const confirmarEliminacion = (id) => setConfirmacion(id);

  const eliminarDestino = async () => {
    await fetch(`http://localhost:5000/api/destinos/${confirmacion}`, { method: "DELETE" });
    setMensaje("Destino eliminado con éxito.");
    setConfirmacion(null);
    cargarDestinos();
  };

  const destinosMostrados = destinos.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  const totalPaginas = Math.ceil(destinos.length / porPagina);

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible(!sidebarVisible)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen transition-all duration-300">
          <DashboardHeader
            titulo="Gestión de Destinos"
            subtitulo="Administra los destinos Erasmus disponibles"
          />

          <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-6">
            <button
              onClick={() => setEditando({})}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear nuevo destino
            </button>

            <div className="overflow-auto border rounded-xl shadow-sm">
              <table className="w-full table-auto text-base">
                <thead className="bg-gray-50 border-b text-left text-base" style={{ fontFamily: "Inter, sans-serif" }}>
                  <tr>
                    <th className="p-4 font-semibold text-gray-700">Universidad</th>
                    <th className="p-4 font-semibold text-gray-700">País</th>
                    <th className="p-4 font-semibold text-gray-700">Idioma</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {destinosMostrados.map((d) => (
                    <tr key={d._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{d.nombre_uni}</td>
                      <td className="p-4">{d.pais}</td>
                      <td className="p-4">{d.requisitos_idioma}</td>
                      <td className="p-4 flex justify-center gap-3">
                        <button onClick={() => setEditando(d)} className="text-blue-600 hover:text-blue-800">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => confirmarEliminacion(d._id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {destinosMostrados.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-500">
                  No hay destinos para mostrar.
                </p>
              )}
            </div>

            {confirmacion && (
              <div className="bg-white shadow-xl border border-red-200 p-4 rounded-md mt-4 text-center space-y-4">
                <p>¿Estás seguro de que quieres eliminar este destino?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={eliminarDestino} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Sí, eliminar</button>
                  <button onClick={() => setConfirmacion(null)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
                </div>
              </div>
            )}

            {mensaje && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mt-4 text-center">
                {mensaje}
              </div>
            )}

            <Pagination total={totalPaginas} actual={pagina} setActual={setPagina} />
          </div>

          {editando && (
            <EditarDestinoModal
              destino={editando}
              onClose={() => {
                setEditando(null);
                cargarDestinos();
              }}
            />
          )}
        </div>
      </Sidebar>
    </>
  );
}
