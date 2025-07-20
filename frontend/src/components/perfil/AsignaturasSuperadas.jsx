import { useEffect, useState } from "react";
import AsignaturaSelector from "./AsignaturaSelector";
import { BookOpen} from "lucide-react";
function sonIguales(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  const s1 = [...arr1].sort();
  const s2 = [...arr2].sort();
  return s1.every((val, i) => val === s2[i]);
}

export default function AsignaturasSuperadas({ editando, asignaturasBD, seleccionadas, onChange }) {
  const [seleccionTemp, setSeleccionTemp] = useState(seleccionadas || []);

  useEffect(() => {
    if (editando) {
      setSeleccionTemp(seleccionadas || []);
    }
  }, [editando, seleccionadas]);

  const handleAceptar = () => {
    onChange(seleccionTemp);
  };

  const haCambiado = !sonIguales(seleccionTemp, seleccionadas);

  const coloresCurso = {
    1: "bg-yellow-200",
    2: "bg-blue-200",
    3: "bg-pink-200",
    4: "bg-green-200"
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-black flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
        <BookOpen className="w-6 h-6 text-red-500" /> {/* Ícono de libro */}
        Asignaturas superadas
      </h2>

      {editando ? (
        asignaturasBD.length === 0 ? (
          <p className="text-sm text-gray-500">No se han encontrado asignaturas para este grado.</p>
        ) : (
          <>
            {/* Asignaturas seleccionadas actuales */}
            {seleccionTemp.length > 0 && (
              <div>
                <h3 className="text-xl font-medium text-gray-600 mb-3" >Asignaturas seleccionadas</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {asignaturasBD
                    .filter(a => seleccionTemp.includes(a.codigo))
                    .map(a => (
                      <span
                        key={a.codigo}
                        className={`px-3 py-1 text-sm rounded-full text-black ${
                          coloresCurso[a.curso] || "bg-gray-100"
                        }`}
                      >
                        {a.nombre}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <AsignaturaSelector
              asignaturas={asignaturasBD}
              seleccionadas={seleccionTemp}
              onChange={setSeleccionTemp}
            />

            {haCambiado && (
              <div className="text-right mt-4">
                <button
                  onClick={handleAceptar}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Aceptar
                </button>
              </div>
            )}
          </>
        )
      ) : (
        [1, 2, 3, 4].map(curso => {
          const asignaturasCurso = asignaturasBD.filter(
            a => a.curso === curso && seleccionadas.includes(a.codigo)
          );
          if (asignaturasCurso.length === 0) return null;

          return (
            <div key={curso}>
              <h3 className="text-m font-semibold text-gray-600 mb-1">Curso {curso}</h3>
              <div className="flex flex-wrap gap-2">
                {asignaturasCurso.map(a => (
                  <span
                    key={a.codigo}
                    className={`px-3 py-1 text-sm rounded-full text-black ${
                      coloresCurso[a.curso] || "bg-gray-100"
                    }`}
                  >
                    {a.nombre}
                  </span>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
