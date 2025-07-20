import { useState } from "react";
import { Languages, Globe, BarChart2, Plus, Trash2 } from "lucide-react";

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
    <div className="bg-white shadow rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-black flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
        <Globe className="w-6 h-6 text-red-500" />
        Idiomas
      </h2>

      {editando && (
        <div className="space-y-3">
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
            <label htmlFor="custom" className="text-sm font-medium text-gray-600">
              Escribir idioma personalizado
            </label>
          </div>

          {/* Selector o input de idioma */}
          <div className="flex gap-3 flex-wrap items-center">
            {usarPersonalizado ? (
              <input
                type="text"
                placeholder="Idioma personalizado"
                className="border px-3 py-2 rounded w-full md:w-1/2"
                value={nuevoIdioma.idioma}
                onChange={e => setNuevoIdioma({ ...nuevoIdioma, idioma: e.target.value })}
              />
            ) : (
              <select
                className="border px-3 py-2 rounded w-full md:w-1/2"
                value={nuevoIdioma.idioma}
                onChange={e => setNuevoIdioma({ ...nuevoIdioma, idioma: e.target.value })}
              >
                <option value="">Selecciona un idioma</option>
                {IDIOMAS_COMUNES.map(idioma => (
                  <option key={idioma} value={idioma}>{idioma}</option>
                ))}
              </select>
            )}

            {/* Nivel */}
            <select
              className="border px-3 py-2 rounded w-full md:w-1/4"
              value={nuevoIdioma.nivel}
              onChange={e => setNuevoIdioma({ ...nuevoIdioma, nivel: e.target.value })}
            >
              <option value="">Nivel</option>
              {NIVELES_VALIDOS.map(nivel => (
                <option key={nivel} value={nivel}>{nivel}</option>
              ))}
            </select>

            <button
              onClick={handleAñadir}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              <Plus className="w-4 h-4" />
              Añadir
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      )}

      {/* Lista de idiomas */}
      <ul className="space-y-2">
        {idiomas.map((idioma, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-50 border px-4 py-2 rounded shadow-sm"
          >
            <span className="text-gray-800 text-sm flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-500" />
              <strong>{idioma.idioma}</strong>
              <BarChart2 className="w-4 h-4 text-gray-400" />
              {idioma.nivel}
            </span>
            {editando && (
              <button
                onClick={() => eliminarIdioma(i)}
                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
