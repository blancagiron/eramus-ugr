import { Link } from "react-router-dom";

export default function UniversityCard({ uni }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col h-full min-h-[380px]">
      <img
        src={`https://source.unsplash.com/400x250/?university,${uni.pais}`}
        alt="uni"
        className="h-48 w-full object-cover"
      />
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold mb-1">{uni.nombre_uni}</h3>
          <p className="text-gray-600 text-sm mb-3">{uni.pais}</p>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <p>Idioma: {uni.requisitos_idioma}</p>
            <p>Cursos: {uni.asignaturas.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <button className="px-4 py-2 border border-red-500 text-red-500 bg-white rounded hover:bg-red-50">
            Guardar
          </button>
          <Link
            to={`/destinos/${encodeURIComponent(uni.nombre_uni)}`}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-center"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
