export default function FilterSidebar({ filtro, setFiltro }) {
    const handleAddAsignatura = () => {
      const nueva = prompt("Introduce nombre de asignatura:");
      if (nueva && !filtro.asignaturas.includes(nueva)) {
        setFiltro({ ...filtro, asignaturas: [...filtro.asignaturas, nueva] });
      }
    };
  
    const eliminarAsignatura = (nombre) => {
      setFiltro({
        ...filtro,
        asignaturas: filtro.asignaturas.filter((a) => a !== nombre),
      });
    };
  
    return (
      <aside className="w-full lg:w-1/4 bg-gray-100 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          🔍 Filtros
        </h2>
  
        <div className="mb-3">
          <label className="block mb-1">País</label>
          <select
            className="w-full p-2 border rounded-lg bg-white"
            value={filtro.pais}
            onChange={(e) => setFiltro({ ...filtro, pais: e.target.value })}
          >
            <option value="">Todos los países</option>
            <option>Italia</option>
            <option>Alemania</option>
            <option>Bélgica</option>
          </select>
        </div>
  
        <div className="mb-3">
          <label className="block mb-1">Nivel de idioma</label>
          <select
            className="w-full p-2 border rounded-lg bg-white"
            value={filtro.idioma}
            onChange={(e) => setFiltro({ ...filtro, idioma: e.target.value })}
          >
            <option value="">Todos los niveles</option>
            <option>B1 francés</option>
            <option>B2 inglés</option>
          </select>
        </div>
  
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200 mt-6">
          <h3 className="font-semibold mb-2 text-pink-700">Búsqueda por asignatura</h3>
          <div className="flex flex-col gap-2">
            {filtro.asignaturas.map((asig, i) => (
              <div
                key={i}
                className="bg-white px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow"
              >
                {asig}
                <button
                  className="bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  onClick={() => eliminarAsignatura(asig)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddAsignatura}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
          >
            + Añadir asignatura
          </button>
        </div>
      </aside>
    );
  }
  