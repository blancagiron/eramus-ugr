import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import UniversityGrid from "../UniversityGrid";
import Pagination from "../Pagination";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../dashboard/Sidebar";
import Hamburguesa from "../dashboard/Hamburguesa";

export default function Destinos() {
  const [universidades, setUniversidades] = useState([]);
  const [filtro, setFiltro] = useState({
    pais: "",
    idioma: "",
    curso: "",
    asignaturas: [],
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const porPagina = 6;

  useEffect(() => {
    fetch("http://localhost:5000/api/destinos")
      .then((res) => res.json())
      .then((data) => setUniversidades(data));
  }, []);

  const universidadesFiltradas = universidades.filter((uni) => {
    const matchPais =
      !filtro.pais || uni.pais.toLowerCase().includes(filtro.pais.toLowerCase());

    const matchIdioma =
      !filtro.idioma || uni.requisitos_idioma.toLowerCase().includes(filtro.idioma.toLowerCase());

    const matchAsignaturas =
      filtro.asignaturas.length === 0 ||
      filtro.asignaturas.every((asig) =>
        uni.asignaturas.some((a) => a.nombre.toLowerCase().includes(asig.toLowerCase()))
      );

    return matchPais && matchIdioma && matchAsignaturas;
  });

  const totalPaginas = Math.ceil(universidadesFiltradas.length / porPagina);
  const universidadesPaginadas = universidadesFiltradas.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />

      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen transition-all duration-300">
          <DashboardHeader
            titulo="Destinos Erasmus"
            subtitulo="Filtra y encuentra tu mejor opción"
          />

          <div className="lg:flex px-4 md:px-8 pt-6 max-w-screen-2xl mx-auto w-full gap-6">
            {/* Filtros */}
            <div className="mb-6 lg:mb-0">
              <FilterSidebar filtro={filtro} setFiltro={setFiltro} />
            </div>

            {/* Contenido principal */}
            <main className="flex-1 px-2 sm:px-4 md:px-0 pb-10">
              {universidadesPaginadas.length > 0 ? (
                <UniversityGrid universidades={universidadesPaginadas} />
              ) : (
                <div className="text-center text-gray-600 mt-12">
                  <p className="text-lg font-medium mb-2">No se encontraron destinos</p>
                  <p className="text-sm">Prueba a cambiar los filtros o buscar otras asignaturas.</p>
                </div>
              )}

              <Pagination
                total={totalPaginas}
                actual={paginaActual}
                setActual={setPaginaActual}
              />
            </main>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
