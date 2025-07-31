import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Globe, BookOpen, Heart, ExternalLink } from "lucide-react";

export default function UniversityCard({ uni }) {
  const [esFavorito, setEsFavorito] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const email = usuario?.email;

  // Obtener si el destino está en favoritos al montar
  useEffect(() => {
    if (email) {
      fetch(`http://localhost:5000/usuarios/${email}`)
        .then(res => res.json())
        .then(data => {
          const favs = data.destinos_favoritos || [];
          setEsFavorito(favs.includes(uni.codigo));
        });
    }
  }, [email, uni.codigo]);

  // Alternar favorito
  const toggleFavorito = async () => {
    if (!email) return;

    const res = await fetch(`http://localhost:5000/usuarios/${email}`);
    const userData = await res.json();
    const favs = userData.destinos_favoritos || [];

    const actualizado = esFavorito
      ? favs.filter((codigo) => codigo !== uni.codigo)
      : [...favs, uni.codigo];

    setEsFavorito(!esFavorito);

    await fetch(`http://localhost:5000/usuarios/${email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinos_favoritos: actualizado }),
    });
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full min-h-[420px] group hover:-translate-y-2 border border-gray-100"
    >
      {/* Imagen con overlay */}
      <div className="relative overflow-hidden" >
        <img
          src={uni.imagenes?.principal || `https://source.unsplash.com/400x250/?university,${uni.pais}`}
          alt={uni.nombre_uni}
          className="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>

        {/* Badge del país */}
        <div className="absolute top-4 left-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-red-600" />
              <span className="text-xs font-medium text-gray-800">{uni.pais}</span>
            </div>
          </div>
        </div>

        {/* Corazón para favoritos */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleFavorito}
            className={`p-2 bg-white backdrop-blur-sm rounded-full shadow-lg hover:bg-red-100 transition duration-300`}
            title={esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Heart
              className={`w-5 h-5 ${esFavorito ? "text-red-600 fill-red-600" : "text-red-600"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-gray-900 leading-tight" style={{ fontFamily: "Inter, sans-serif" }}>
            {uni.nombre_uni}
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-m text-gray-500">Idioma requerido</p>
                <p className="font-medium text-gray-800">{uni.requisitos_idioma}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-m text-gray-500 mb-1">Cursos disponibles</p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(uni.cursos) && uni.cursos.length > 0 ? (
                    uni.cursos.slice(0, 3).map((curso, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-s rounded-md font-medium"
                      >
                        {curso}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">No especificado</span>
                  )}
                  {Array.isArray(uni.cursos) && uni.cursos.length > 3 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md font-medium">
                      +{uni.cursos.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
          <Link
            to={`/destinos/${encodeURIComponent(uni.nombre_uni)}`}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:text-white rounded-xl font-semibold text-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>Ver detalles</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
