import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Sidebar from "../../Sidebar";
import DashboardHeader from "../../DashboardHeader";
import Hamburguesa from "../../Hamburguesa";
import Pagination from "../../../Pagination";
import EditarAsignaturaModal from "./EditarAsignaturaModal";

export default function GestionAsignaturas() {
  const [centros, setCentros] = useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [filtroCentro, setFiltroCentro] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [pagina, setPagina] = useState(1);
  const [confirmacion, setConfirmacion] = useState(null);
  const [confirmacionLote, setConfirmacionLote] = useState(false);

  const porPagina = 5;

  const cargarCentros = () => {
    fetch("http://localhost:5000/api/centros")
      .then(res => res.json())
      .then(setCentros);
  };

  const cargarGrados = () => {
    fetch("http://localhost:5000/grados")
      .then(res => res.json())
      .then(setGrados);
  };

  const cargarAsignaturas = () => {
    if (!filtroCentro || !filtroGrado) {
      setAsignaturas([]);
      return;
    }

    const url = `http://localhost:5000/api/asignaturas?codigo_grado=${filtroGrado}&centro=${filtroCentro}`;
    fetch(url)
      .then(res => res.json())
      .then(setAsignaturas);
  };

  useEffect(() => {
    cargarCentros();
    cargarGrados();
  }, []);

  useEffect(() => {
    setPagina(1);
    cargarAsignaturas();
  }, [filtroCentro, filtroGrado]);

  const eliminar = async (codigo) => {
    const res = await fetch(`http://localhost:5000/asignaturas/${codigo}`, { method: "DELETE" });
    if (res.ok) {
      setMensaje("Asignatura eliminada correctamente.");
      cargarAsignaturas();
    } else {
      const data = await res.json();
      setMensaje(data?.error || "Error al eliminar.");
    }
    setConfirmacion(null);
  };

  const eliminarLote = async () => {
    const url = `http://localhost:5000/asignaturas?codigo_grado=${filtroGrado}&centro=${filtroCentro}`;
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json();
    setMensaje(data.mensaje || "Asignaturas eliminadas.");
    setConfirmacionLote(false);
    cargarAsignaturas();
  };

  const asignaturasOrdenadas = [...asignaturas].sort((a, b) => {
    if (a.curso !== b.curso) return a.curso - b.curso;
    return a.nombre.localeCompare(b.nombre);
  });

  const totalPaginas = Math.ceil(asignaturasOrdenadas.length / porPagina);
  const asignaturasMostradas = asignaturasOrdenadas.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  return (
    <>
      <Hamburguesa onClick={() => {}} />
      <Sidebar visible={true}>
        <div className="min-h-screen transition-all duration-300">
          <DashboardHeader
            titulo="Gestión de Asignaturas"
            subtitulo="Filtra por centro y grado para ver las asignaturas UGR"
          />

          <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-6">

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={filtroCentro}
                onChange={(e) => {
                  setFiltroCentro(e.target.value);
                  setFiltroGrado("");
                }}
                className="border p-2 rounded"
              >
                <option value="">Selecciona un centro</option>
                {centros.map((c) => (
                  <option key={c.codigo} value={c.codigo}>
                    {c.nombre} ({c.codigo})
                  </option>
                ))}
              </select>

              <select
                value={filtroGrado}
                onChange={(e) => setFiltroGrado(e.target.value)}
                className="border p-2 rounded"
                disabled={!filtroCentro}
              >
                <option value="">Selecciona un grado</option>
                {grados
                  .filter((g) => g.codigo_centro === filtroCentro)
                  .map((g) => (
                    <option key={g.codigo} value={g.codigo}>
                      {g.nombre} ({g.sigla})
                    </option>
                  ))}
              </select>
            </div>

            {/* Acciones */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setEditando({})}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva asignatura
              </button>

              {filtroCentro && filtroGrado && asignaturas.length > 0 && (
                <button
                  onClick={() => setConfirmacionLote(true)}
                  className="bg-gray-100 hover:bg-red-200 border border-red-400 text-red-700 px-4 py-2 rounded-md"
                >
                  Eliminar todas las asignaturas del grado seleccionado
                </button>
              )}
            </div>

            {/* Mensaje */}
            {mensaje && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                {mensaje}
              </div>
            )}

            {/* Tabla */}
            <div className="overflow-auto border rounded-xl shadow-sm mt-4">
              <table className="w-full table-auto text-sm">
                <thead className="bg-gray-50 border-b text-left text-base">
                  <tr>
                    <th className="p-4 font-semibold text-gray-700">Código</th>
                    <th className="p-4 font-semibold text-gray-700">Nombre</th>
                    <th className="p-4 font-semibold text-gray-700">Créditos</th>
                    <th className="p-4 font-semibold text-gray-700">Curso</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asignaturasMostradas.map((a) => (
                    <tr key={a.codigo} className="border-t hover:bg-gray-50">
                      <td className="p-4">{a.codigo}</td>
                      <td className="p-4">{a.nombre}</td>
                      <td className="p-4">{a.creditos}</td>
                      <td className="p-4">{a.curso}</td>
                      <td className="p-4 flex justify-center gap-3">
                        <button onClick={() => setEditando(a)} className="text-blue-600 hover:text-blue-800">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => setConfirmacion(a.codigo)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {asignaturasMostradas.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-500">No hay asignaturas para mostrar.</p>
              )}
            </div>

            {/* Paginación */}
            <Pagination total={totalPaginas} actual={pagina} setActual={setPagina} />

            {/* Confirmación individual */}
            {confirmacion && (
              <div className="bg-white shadow-xl border border-red-200 p-4 rounded-md mt-4 text-center space-y-4">
                <p>¿Eliminar asignatura <strong>{confirmacion}</strong>?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => eliminar(confirmacion)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Sí</button>
                  <button onClick={() => setConfirmacion(null)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
                </div>
              </div>
            )}

            {/* Confirmación en lote */}
            {confirmacionLote && (
              <div className="bg-white shadow-xl border border-red-200 p-4 rounded-md mt-4 text-center space-y-4">
                <p>¿Eliminar <strong>todas</strong> las asignaturas del grado seleccionado?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={eliminarLote} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Sí, eliminar todas</button>
                  <button onClick={() => setConfirmacionLote(false)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancelar</button>
                </div>
              </div>
            )}
          </div>

          {/* Modal */}
          {editando && (
            <EditarAsignaturaModal
              asignatura={editando}
              onClose={() => {
                setEditando(null);
                cargarAsignaturas();
              }}
            />
          )}
        </div>
      </Sidebar>
    </>
  );
}
