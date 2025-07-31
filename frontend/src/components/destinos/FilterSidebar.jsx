import { useState, useEffect } from "react";
import {
  Search, MapPin, Languages, BookOpen,
  Plus, X, ChevronDown, ListFilter, Calendar,
  Clock, Star, Users, Award, Filter, RefreshCw
} from "lucide-react";

export default function FilterSidebar({ filtro, setFiltro, paises, idiomas, cursos }) {
  const [busqueda, setBusqueda] = useState("");
  const [asignaturasGrado, setAsignaturasGrado] = useState([]);
  const [asignaturasSuperadas, setAsignaturasSuperadas] = useState([]);
  const [asignaturasTemp, setAsignaturasTemp] = useState([]);
  const [seccionExpandida, setSeccionExpandida] = useState({
    basicos: true,
    asignaturas: true,
    avanzados: false,
    preferencias: false
  });

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

  const limpiarFiltros = () => {
    setFiltro({
      pais: "",
      idioma: "",
      curso: "",
      asignaturas: [],
      duracion: "",
      modalidad: "",
      precio: "",
      valoracion: "",
      fechaInicio: "",
      nivel: "",
      certificacion: false,
      becas: false
    });
    setAsignaturasTemp([]);
    setBusqueda("");
  };

  const toggleSeccion = (seccion) => {
    setSeccionExpandida(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  const SeccionExpandible = ({ titulo, icono: Icono, nombre, children }) => (
    <div className="mb-6 border-b border-gray-100 pb-6 last:border-b-0">
      <button
        onClick={() => toggleSeccion(nombre)}
        className="flex items-center justify-between w-full mb-3 text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icono className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">{titulo}</h3>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            seccionExpandida[nombre] ? 'rotate-180' : ''
          }`} 
        />
      </button>
      {seccionExpandida[nombre] && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ListFilter className="w-5 h-5 text-gray-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Filtros</h2>
        </div>
        <button
          onClick={limpiarFiltros}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Limpiar
        </button>
      </div>

      {/* Filtros Básicos */}
      <SeccionExpandible titulo="Filtros Básicos" icono={Filter} nombre="basicos">
        {/* País */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            País de destino
          </label>
          <select
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
            <Languages className="w-4 h-4" />
            Idioma de instrucción
          </label>
          <select
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
            <BookOpen className="w-4 h-4" />
            Curso académico
          </label>
          <select
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            value={filtro.curso}
            onChange={(e) => setFiltro({ ...filtro, curso: e.target.value })}
          >
            <option value="">Todos los cursos</option>
            {cursos.map((c) => (
              <option key={c} value={c}>{`${c}º Curso`}</option>
            ))}
          </select>
        </div>
      </SeccionExpandible>

      {/* Búsqueda por asignaturas */}
      <SeccionExpandible titulo="Asignaturas a Convalidar" icono={BookOpen} nombre="asignaturas">
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
          <h4 className="font-bold text-red-800 mb-1">Búsqueda inteligente</h4>
          <p className="text-sm text-gray-600 mb-2">
            Selecciona las asignaturas que necesitas convalidar para encontrar los mejores programas
          </p>
          <p className="text-xs text-gray-500 italic mb-4">
            No aparecerán las asignaturas que ya has superado. Puedes buscar por nombre o código.
          </p>

          {/* Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ej: Matemáticas, COMP101, Física..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>

          {/* Sugerencias rápidas */}
          {!busqueda.trim() && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Sugerencias rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {['Cálculo', 'Fundamentos de Programación', 'Estadística', 'Informática Gráfica'].map(sugerencia => (
                  <button
                    key={sugerencia}
                    onClick={() => setBusqueda(sugerencia)}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
                  >
                    {sugerencia}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados */}
          {busqueda.trim() && filtrar.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Encontradas {filtrar.length} asignaturas
              </p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {filtrar.slice(0, 10).map((a) => {
                  const selected = asignaturasTemp.includes(a.codigo);
                  return (
                    <button
                      key={a.codigo}
                      onClick={() => toggleAsignatura(a.codigo)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border shadow-sm flex items-center gap-2 hover:scale-105 ${
                        selected
                          ? "bg-red-600 text-white border-red-600 shadow-lg"
                          : "bg-white text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300"
                      }`}
                    >
                      <Plus className={`w-3 h-3 ${selected ? 'rotate-45' : ''} transition-transform`} />
                      <span>{a.nombre}</span>
                      <span className="text-xs opacity-70">({a.codigo})</span>
                    </button>
                  );
                })}
                {filtrar.length > 10 && (
                  <div className="text-xs text-gray-500 py-2 px-3">
                    ... y {filtrar.length - 10} más
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No hay resultados */}
          {busqueda.trim() && filtrar.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron asignaturas</p>
              <p className="text-xs">Prueba con otro término de búsqueda</p>
            </div>
          )}

          {/* Seleccionadas */}
          {asignaturasTemp.length > 0 && (
            <div className="border-t border-red-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm text-gray-700 font-medium">
                  Asignaturas seleccionadas ({asignaturasTemp.length})
                </h4>
                <button
                  onClick={() => setAsignaturasTemp([])}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Limpiar todas
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {asignaturasTemp.map((codigo) => {
                  const asignatura = asignaturasGrado.find((a) => a.codigo === codigo);
                  return (
                    <div
                      key={codigo}
                      className="bg-white border border-red-100 px-4 py-3 rounded-xl flex justify-between items-center text-sm shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <span className="text-gray-800 font-medium block">
                          {asignatura?.nombre || codigo}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Código: {codigo}
                        </span>
                      </div>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors hover:scale-110"
                        onClick={() => toggleAsignatura(codigo)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SeccionExpandible>

   

      {/* Botones de acción */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
          onClick={aplicarFiltros}
        >
          Búsqueda
        </button>
      </div>

      {/* Contador de filtros activos */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {Object.values(filtro).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length} filtros activos
        </p>
      </div>
    </div>
  );
}