// AsignaturasSearch.jsx
import { memo, useEffect, useMemo, useState } from "react";
import { Search, Plus, X, BookOpen } from "lucide-react";

/** Pequeño hook de debounce */
function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const normalizar = (texto) =>
  texto?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

function AsignaturasSearch({
  asignaturasGrado = [],
  asignaturasSuperadas = [],
  value = [],              // códigos seleccionados
  onChange = () => {},     // (nuevosCodigos[]) => void
  maxSugerencias = 10,
}) {
  const [query, setQuery] = useState("");
  const q = useDebouncedValue(query, 250); // evita buscar “tecla a tecla”

  const resultados = useMemo(() => {
    if (!q.trim()) return [];
    const nq = normalizar(q);
    return asignaturasGrado.filter(a => {
      const match =
        normalizar(a.nombre).includes(nq) ||
        normalizar(a.codigo).includes(nq);
      const noSuperada = !asignaturasSuperadas.includes(a.codigo);
      return match && noSuperada;
    });
  }, [q, asignaturasGrado, asignaturasSuperadas]);

  const toggleAsignatura = (codigo) => {
    if (value.includes(codigo)) {
      onChange(value.filter(c => c !== codigo));
    } else {
      onChange([...value, codigo]);
    }
  };

  return (
    <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
      <h4 className="font-bold text-red-800 mb-1">Búsqueda inteligente</h4>
      <p className="text-sm text-gray-600 mb-2">
        Escribe para buscar asignaturas por nombre o código
      </p>

      {/* Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Ej: Matemáticas, COMP101, Física..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
        />
      </div>

      {/* Resultados */}
      {!!q.trim() && resultados.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Encontradas {resultados.length} asignaturas
          </p>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {resultados.slice(0, maxSugerencias).map((a) => {
              const selected = value.includes(a.codigo);
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
                  <Plus className={`w-3 h-3 ${selected ? "rotate-45" : ""} transition-transform`} />
                  <span>{a.nombre}</span>
                  <span className="text-xs opacity-70">({a.codigo})</span>
                </button>
              );
            })}
            {resultados.length > maxSugerencias && (
              <div className="text-xs text-gray-500 py-2 px-3">
                … y {resultados.length - maxSugerencias} más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {!!q.trim() && resultados.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se encontraron asignaturas</p>
          <p className="text-xs">Prueba con otro término de búsqueda</p>
        </div>
      )}

      {/* Seleccionadas */}
      {value.length > 0 && (
        <div className="border-t border-red-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-gray-700 font-medium">
              Asignaturas seleccionadas ({value.length})
            </h4>
            <button
              onClick={() => onChange([])}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Limpiar todas
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {value.map((codigo) => (
              <div
                key={codigo}
                className="bg-white border border-red-100 px-4 py-3 rounded-xl flex justify-between items-center text-sm shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800 font-medium">{codigo}</span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors hover:scale-110"
                  onClick={() => toggleAsignatura(codigo)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** memo evita renders cuando el padre cambia cosas no relacionadas */
export default memo(AsignaturasSearch);
