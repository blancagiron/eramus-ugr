export default function Idiomas({ idiomas, nuevoIdioma, setNuevoIdioma, añadirIdioma, eliminarIdioma, editando }) {
    return (
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold">Idiomas</h2>
        {editando && (
          <div className="flex gap-4">
            <input type="text" placeholder="Idioma" className="border px-3 py-2 rounded w-1/2"
              value={nuevoIdioma.idioma} onChange={e => setNuevoIdioma({ ...nuevoIdioma, idioma: e.target.value })} />
            <input type="text" placeholder="Nivel" className="border px-3 py-2 rounded w-1/2"
              value={nuevoIdioma.nivel} onChange={e => setNuevoIdioma({ ...nuevoIdioma, nivel: e.target.value })} />
            <button onClick={añadirIdioma} className="bg-red-500 text-white px-4 py-2 rounded">Añadir</button>
          </div>
        )}
        <ul className="space-y-2">
          {idiomas.map((idioma, i) => (
            <li key={i} className="flex justify-between bg-gray-100 px-3 py-2 rounded">
              <span>{idioma.idioma} — {idioma.nivel}</span>
              {editando && (
                <button onClick={() => eliminarIdioma(i)} className="text-red-600 hover:underline">Eliminar</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  