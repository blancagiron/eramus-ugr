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
  const [filtroCentro, setFiltroCentro] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [centros, setCentros] = useState([]);
  const [grados, setGrados] = useState([]);
  const porPagina = 5;

  const cargarDestinos = () => {
    let url = "http://localhost:5000/api/destinos";
    const params = new URLSearchParams();
    if (filtroCentro) params.append("codigo_centro", filtroCentro);
    if (filtroGrado) params.append("codigo_grado", filtroGrado);
    if (params.toString()) url += "?" + params.toString();

    fetch(url)
      .then((res) => res.json())
      .then(setDestinos);
  };

  const cargarCentrosYGrados = () => {
    fetch("http://localhost:5000/api/centros")
      .then((res) => res.json())
      .then(setCentros);

    fetch("http://localhost:5000/grados")
      .then((res) => res.json())
      .then(setGrados);
  };

  useEffect(() => {
    cargarDestinos();
    cargarCentrosYGrados();
  }, [filtroCentro, filtroGrado]);

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

          <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-6" >
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex flex-col">
                <label className="text-base font-semibold text-gray-700 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Centro</label>
                <select
                  value={filtroCentro}
                  onChange={(e) => setFiltroCentro(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200 min-w-[200px]"
                >
                  <option value="">Todos los centros</option>
                  {centros.map((c) => (
                    <option key={c.codigo} value={c.codigo}>
                      {c.codigo} - {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-base font-semibold text-gray-700 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Grado</label>
                <select
                  value={filtroGrado}
                  onChange={(e) => setFiltroGrado(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200 min-w-[200px]"
                >
                  <option value="">Todos los grados</option>
                  {grados.map((g) => (
                    <option key={g.codigo} value={g.codigo}>
                      {g.codigo} - {g.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={() => {
                    setFiltroCentro("");
                    setFiltroGrado("");
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium transition-colors duration-200 border border-gray-300"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {/* Botón crear */}
            <button
              onClick={() => setEditando({})}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Crear nuevo destino
            </button>

            {/* Tabla */}
            <div className="overflow-auto border rounded-xl shadow-sm bg-white">
              <table className="w-full table-auto text-base">
                <thead className="bg-gray-50 border-b text-left text-base" style={{ fontFamily: "Inter, sans-serif" }}>
                  <tr>
                    <th className="p-4 font-semibold text-gray-700">Universidad</th>
                    <th className="p-4 font-semibold text-gray-700">País</th>
                    <th className="p-4 font-semibold text-gray-700">Idioma</th>
                    <th className="p-4 font-semibold text-gray-700">Centro</th>
                    <th className="p-4 font-semibold text-gray-700">Grado</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {destinosMostrados.map((d) => (
                    <tr key={d._id} className="border-t hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-4">{d.nombre_uni}</td>
                      <td className="p-4">{d.pais}</td>
                      <td className="p-4">{d.requisitos_idioma}</td>
                      <td className="p-4">{d.codigo_centro_ugr || "-"}</td>
                      <td className="p-4">{d.codigo_grado_ugr || "-"}</td>
                      <td className="p-4 flex justify-center gap-3">
                        <button 
                          onClick={() => setEditando(d)} 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-all duration-200"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => confirmarEliminacion(d._id)} 
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-all duration-200"
                        >
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

            {/* Confirmación */}
            {confirmacion && (
              <div className="bg-white shadow-xl border border-red-200 p-6 rounded-xl mt-4 text-center space-y-4">
                <p className="text-gray-700 font-medium">¿Estás seguro de que quieres eliminar este destino?</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={eliminarDestino} 
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors duration-200 shadow-sm"
                  >
                    Sí, eliminar
                  </button>
                  <button 
                    onClick={() => setConfirmacion(null)} 
                    className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200 border border-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Mensaje */}
            {mensaje && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center font-medium shadow-sm">
                {mensaje}
              </div>
            )}

            {/* Paginación */}
            <Pagination total={totalPaginas} actual={pagina} setActual={setPagina} />
          </div>

          {/* Modal de edición */}
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