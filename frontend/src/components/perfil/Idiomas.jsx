import { useState } from "react";
import { Languages, Globe, BarChart2, Plus, Trash2, ChevronDown } from "lucide-react";

const IDIOMAS_COMUNES = [
  "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Chino", "Japonés"
];

const NIVELES_VALIDOS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function Idiomas({
  idiomas,
  nuevoIdioma,
  setNuevoIdioma,
  añadirIdioma,
  eliminarIdioma,
  editando
}) {
  const [usarPersonalizado, setUsarPersonalizado] = useState(false);
  const [error, setError] = useState("");

  const handleAñadir = () => {
    const idiomaValido =
      usarPersonalizado
        ? nuevoIdioma.idioma.trim().length > 1
        : IDIOMAS_COMUNES.includes(nuevoIdioma.idioma);

    if (!idiomaValido || !NIVELES_VALIDOS.includes(nuevoIdioma.nivel)) {
      setError("Idioma o nivel no válido");
      return;
    }

    añadirIdioma();
    setError("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3" style={{ fontFamily: "Inter, sans-serif" }}>
        <Globe className="w-6 h-6 text-red-500" />
        Idiomas
      </h2>

      {editando && (
        <div className="space-y-4">
          {/* Cambiar entre común y personalizado */}
          <div className="flex items-center gap-2">
            <input
              id="custom"
              type="checkbox"
              checked={usarPersonalizado}
              onChange={(e) => {
                setUsarPersonalizado(e.target.checked);
                setNuevoIdioma({ ...nuevoIdioma, idioma: "" });
              }}
              className="accent-red-500"
            />
            <label htmlFor="custom" className="text-sm font-medium text-gray-700">
              Escribir idioma personalizado
            </label>
          </div>

          {/* Selector o input de idioma */}
          <div className="flex gap-3 flex-wrap items-center">
            {usarPersonalizado ? (
              <input
                type="text"
                placeholder="Idioma personalizado"
                className="w-full md:w-1/2 p-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={nuevoIdioma.idioma}
                onChange={e => setNuevoIdioma({ ...nuevoIdioma, idioma: e.target.value })}
              />
            ) : (
              <div className="relative w-full md:w-1/2">
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-700 appearance-none cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  value={nuevoIdioma.idioma}
                  onChange={e => setNuevoIdioma({ ...nuevoIdioma, idioma: e.target.value })}
                >
                  <option value="">Selecciona un idioma</option>
                  {IDIOMAS_COMUNES.map(idioma => (
                    <option key={idioma} value={idioma}>{idioma}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            )}

            {/* Nivel */}
            <div className="relative w-full md:w-1/4">
              <select
                className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-700 appearance-none cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={nuevoIdioma.nivel}
                onChange={e => setNuevoIdioma({ ...nuevoIdioma, nivel: e.target.value })}
              >
                <option value="">Nivel</option>
                {NIVELES_VALIDOS.map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <button
              onClick={handleAñadir}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Añadir
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      )}

      {/* Lista de idiomas */}
      <div className="space-y-3">
        {idiomas.map((idioma, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl shadow-sm"
          >
            <span className="text-gray-800 text-l flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-500" />
              <strong>{idioma.idioma}</strong>
              <BarChart2 className="w-4 h-4 text-gray-400" />
              {idioma.nivel}
            </span>
            {editando && (
              <button
                onClick={() => eliminarIdioma(i)}
                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}