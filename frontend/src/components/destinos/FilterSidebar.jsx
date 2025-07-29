import { useState, useEffect } from "react";
import {
  Search, MapPin, Languages, BookOpen,
  Plus, X, ChevronDown, ListFilter
} from "lucide-react";

export default function FilterSidebar({ filtro, setFiltro, paises, idiomas, cursos }) {
  const [busqueda, setBusqueda] = useState("");
  const [asignaturasGrado, setAsignaturasGrado] = useState([]);
  const [asignaturasSuperadas, setAsignaturasSuperadas] = useState([]);
  const [asignaturasTemp, setAsignaturasTemp] = useState([]);

  useEffect(() => {
    const usuarioRaw = localStorage.getItem("usuario");
    if (!usuarioRaw) return;

    const usuario = JSON.parse(usuarioRaw);
    const { email, codigo_grado, asignaturas_superadas } = usuario;

    if (codigo_grado) {
      fetch(`http://localhost:5000/api/asignaturas?codigo_grado=${codigo_grado}`)
        .then(res => res.json())
        .then(data => setAsignaturasGrado(data));
    }

    if (asignaturas_superadas) {
      setAsignaturasSuperadas(asignaturas_superadas);
    } else if (email) {
      fetch(`http://localhost:5000/usuarios/${email}`)
        .then(res => res.json())
        .then(data => setAsignaturasSuperadas(data.asignaturas_superadas || []));
    }
  }, []);

  useEffect(() => {
    setAsignaturasTemp(filtro.asignaturas || []);
  }, [filtro.asignaturas]);

  const normalizar = (texto) =>
    texto?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtrar = asignaturasGrado.filter(
    (a) =>
      (normalizar(a.nombre).includes(normalizar(busqueda)) ||
        normalizar(a.codigo).includes(normalizar(busqueda))) &&
      !asignaturasSuperadas.includes(a.codigo)
  );

  const toggleAsignatura = (codigo) => {
    setAsignaturasTemp((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  const aplicarFiltros = () => {
    setFiltro({ ...filtro, asignaturas: asignaturasTemp });
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <ListFilter className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Filtros</h2>
      </div>

      {/* País */}
      <div className="mb-6">
        <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4" />
          País
        </label>
        <select
          className="w-full p-3 border rounded-xl bg-gray-50"
          value={filtro.pais}
          onChange={(e) => setFiltro({ ...filtro, pais: e.target.value })}
        >
          <option value="">Todos los países</option>
          {paises.map((pais) => (
            <option key={pais} value={pais}>{pais}</option>
          ))}
        </select>
      </div>

      {/* Idioma */}
      <div className="mb-6">
        <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
          <Languages className="w-4 h-4" />
          Idioma
        </label>
        <select
          className="w-full p-3 border rounded-xl bg-gray-50"
          value={filtro.idioma}
          onChange={(e) => setFiltro({ ...filtro, idioma: e.target.value })}
        >
          <option value="">Todos los idiomas</option>
          {idiomas.map((idioma) => (
            <option key={idioma} value={idioma}>{idioma}</option>
          ))}
        </select>
      </div>

      {/* Curso */}
      <div className="mb-6">
        <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
          <BookOpen className="w-4 h-4" />
          Curso
        </label>
        <select
          className="w-full p-3 border rounded-xl bg-gray-50"
          value={filtro.curso}
          onChange={(e) => setFiltro({ ...filtro, curso: e.target.value })}
        >
          <option value="">Todos los cursos</option>
          {cursos.map((c) => (
            <option key={c} value={c}>{`${c}º Curso`}</option>
          ))}
        </select>
      </div>

      {/* Búsqueda por asignaturas */}
      <div className="bg-red-50 p-5 rounded-2xl border border-red-100 mb-8">
        <h3 className="font-bold text-red-800 mb-1">Búsqueda por asignaturas</h3>
        <p className="text-sm text-gray-600 mb-2">
          Selecciona las asignaturas que quieres convalidar
        </p>
        <p className="text-xs text-gray-500 italic mb-3">
          No aparecerán las asignaturas que ya has superado.
        </p>

        {/* Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar asignatura por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Resultados */}
        {busqueda.trim() && filtrar.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 max-h-48 overflow-y-auto pr-1">
            {filtrar.slice(0, 10).map((a) => {
              const selected = asignaturasTemp.includes(a.codigo);
              return (
                <button
                  key={a.codigo}
                  onClick={() => toggleAsignatura(a.codigo)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition border shadow-sm flex items-center gap-2 ${
                    selected
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-red-700 border-red-300 hover:bg-red-100"
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  {a.nombre}
                </button>
              );
            })}
          </div>
        )}

        {/* Seleccionadas */}
        {asignaturasTemp.length > 0 && (
          <>
            <h4 className="text-sm text-gray-700 font-medium mb-2">
              Asignaturas seleccionadas:
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {asignaturasTemp.map((codigo) => {
                const asignatura = asignaturasGrado.find((a) => a.codigo === codigo);
                return (
                  <div
                    key={codigo}
                    className="bg-white border border-red-100 px-4 py-2.5 rounded-xl flex justify-between items-center text-sm shadow-sm"
                  >
                    <span className="text-gray-800 font-medium">
                      {asignatura?.nombre || codigo}
                    </span>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => toggleAsignatura(codigo)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Botón aplicar filtros */}
      <button
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-xl transition"
        onClick={aplicarFiltros}
      >
        Aplicar Filtros
      </button>
    </div>
  );
}
