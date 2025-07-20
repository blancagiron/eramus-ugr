import { useState, useEffect } from "react";
import {
  Search, MapPin, Languages, BookOpen,
  Plus, X, ChevronDown, ListFilter
} from "lucide-react";

export default function FilterSidebar({ filtro, setFiltro }) {
  const [busqueda, setBusqueda] = useState("");
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaturasSuperadas, setAsignaturasSuperadas] = useState([]);
  const [asignaturasTemp, setAsignaturasTemp] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const email = usuario?.email;

  const normalizar = (texto) =>
    texto?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Cargar asignaturas y asignaturas superadas
  useEffect(() => {
    fetch("http://localhost:5000/api/asignaturas")
      .then(res => res.json())
      .then(data => setAsignaturas(data));

    if (email) {
      fetch(`http://localhost:5000/usuarios/${email}`)
        .then(res => res.json())
        .then(data => setAsignaturasSuperadas(data.asignaturas_superadas || []));
    }
  }, [email]);

  // Inicializar asignaturas seleccionadas temporales
  useEffect(() => {
    setAsignaturasTemp(filtro.asignaturas || []);
  }, [filtro.asignaturas]);

  const filtrar = busqueda.trim()
    ? asignaturas.filter(
        (a) =>
          normalizar(a.nombre).includes(normalizar(busqueda)) &&
          !asignaturasSuperadas.includes(a.codigo)
      )
    : [];

  const toggleAsignatura = (nombre) => {
    if (asignaturasTemp.includes(nombre)) {
      setAsignaturasTemp(asignaturasTemp.filter((a) => a !== nombre));
    } else {
      setAsignaturasTemp([...asignaturasTemp, nombre]);
    }
  };

  const aplicarFiltros = () => {
    setFiltro({ ...filtro, asignaturas: asignaturasTemp });
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <ListFilter className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
      </div>

      {/* País */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4" />
          País
        </label>
        <div className="relative">
          <select
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 appearance-none cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            value={filtro.pais}
            onChange={(e) => setFiltro({ ...filtro, pais: e.target.value })}
          >
            <option value="">Todos los países</option>
            <option>Italia</option>
            <option>Alemania</option>
            <option>Bélgica</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Idioma */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Languages className="w-4 h-4" />
          Nivel de Idioma Mínimo
        </label>
        <div className="relative">
          <select
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 appearance-none cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            value={filtro.idioma}
            onChange={(e) => setFiltro({ ...filtro, idioma: e.target.value })}
          >
            <option value="">Todos los niveles</option>
            <option>B1 francés</option>
            <option>B2 inglés</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Curso */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <BookOpen className="w-4 h-4" />
          Cursos
        </label>
        <div className="relative">
          <select
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 appearance-none cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            value={filtro.curso || ""}
            onChange={(e) => setFiltro({ ...filtro, curso: e.target.value })}
          >
            <option value="">Todos los cursos</option>
            <option>1º Curso</option>
            <option>2º Curso</option>
            <option>3º Curso</option>
            <option>4º Curso</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Búsqueda por asignaturas */}
      <div className="bg-red-50 p-5 rounded-2xl border border-red-100 mb-8">
        <h3 className="font-bold text-red-800 mb-1">Búsqueda por asignaturas</h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona las asignaturas que quieres convalidar
        </p>
        <p className="text-xs text-gray-500 mb-3 italic">
          No aparecerán las asignaturas que ya has superado.
        </p>

        {/* Buscador */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar asignatura"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Resultados de búsqueda */}
        {busqueda.trim() && filtrar.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filtrar.slice(0, 10).map((a) => {
              const selected = asignaturasTemp.includes(a.nombre);
              return (
                <button
                  key={a.codigo}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center gap-1 border ${
                    selected
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                  }`}
                  onClick={() => toggleAsignatura(a.nombre)}
                  type="button"
                >
                  <Plus className="w-3 h-3" />
                  {a.nombre}
                </button>
              );
            })}
          </div>
        )}

        {/* Asignaturas seleccionadas */}
        {asignaturasTemp.length > 0 && (
          <div className="space-y-2">
            {asignaturasTemp.map((asig, i) => (
              <div
                key={i}
                className="bg-white px-4 py-2.5 rounded-xl flex items-center justify-between text-sm shadow-sm border border-red-100"
              >
                <span className="text-gray-800 font-medium">{asig}</span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-200"
                  onClick={() => toggleAsignatura(asig)}
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón aplicar filtros */}
      <button
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
        onClick={aplicarFiltros}
        type="button"
      >
        Aplicar Filtros
      </button>
    </div>
  );
}
