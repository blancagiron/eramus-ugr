import boton1 from "../assets/landing/estrella_roja_activa_pagina.svg";
import boton2 from "../assets/landing/estrella_roja_pagina.svg";

export default function Pagination({ total, actual, setActual }) {
  if (total <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-8">
      {[...Array(total)].map((_, i) => {
        const isActive = actual === i + 1;

        return (
          <button
            key={i}
            onClick={() => setActual(i + 1)}
            className="mx-1 relative transition-transform hover:scale-110"
          >
            <img 
              src={isActive ? boton2 : boton1}
              alt={`Página ${i + 1}`}
              className="w-16 h-16 drop-shadow-sm"
            />
            <span className={`absolute inset-0 flex items-center justify-center text-xl font-normal ${
              isActive ? "text-white" : "text-gray"
            }`}>
              {i + 1}
            </span>
          </button>
        );
      })}

      {/* Botón para ir a la página siguiente */}
      {actual < total && (
        <button
          onClick={() => setActual(actual + 1)}
          className="ml-4 p-3 bg-red-500 text-black rounded-full hover:bg-red-700 transition-transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}