import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import UniversityGrid from "./UniversityGrid";
import Pagination from "./Pagination";

export default function Destinos() {
  const [universidades, setUniversidades] = useState([]);
  const [filtro, setFiltro] = useState({
    pais: "",
    idioma: "",
    asignaturas: [],
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 6;

  useEffect(() => {
    fetch("http://localhost:5000/api/destinos")
      .then((res) => res.json())
      .then((data) => setUniversidades(data));
  }, []);

  const universidadesFiltradas = universidades.filter((uni) => {
    const matchPais = !filtro.pais || uni.pais.toLowerCase().includes(filtro.pais.toLowerCase());
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <FilterSidebar filtro={filtro} setFiltro={setFiltro} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-red-700 mb-6">
          Busca tu Destino Erasmus
        </h1>
        <UniversityGrid universidades={universidadesPaginadas} />
        <Pagination total={totalPaginas} actual={paginaActual} setActual={setPaginaActual} />
      </main>
    </div>
  );
}
