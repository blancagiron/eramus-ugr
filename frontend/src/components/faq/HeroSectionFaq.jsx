import DecoFaq from '../../assets/faq/deco_faq.svg';

export default function HeroSectionFaq({ busqueda, setBusqueda, setPagina }) {
  const handleBusqueda = (e) => {
    e.preventDefault();
    setPagina(1); // Resetear a la primera página al buscar
  };

  return (
    <section className="relative bg-stone-100 min-h-[75vh] flex">
      {/* Móvil - Contenido centrado verticalmente */}
      <div className="flex md:hidden w-full flex-col justify-center items-center px-6">
        {/* Título con dos colores y tamaño grande */}
        <h1
          className="text-4xl sm:text-5xl font-semibold text-center mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="text-black">Preguntas </span>
          <span className="text-red-700">Frecuentes</span>
        </h1>

        {/* Buscador */}
        <form onSubmit={handleBusqueda} className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar preguntas..."
              className="w-full px-6 py-4 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Tablet y Desktop - Dos columnas */}
      <div className="hidden md:flex w-full">
        {/* Columna izquierda */}
        <div className="flex-1 flex flex-col justify-center pl-6 md:pl-20 lg:pl-60">
          <div className="mb-8">
            <h1 className="text-xl lg:text-5xl font-semibold text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="text-black">Preguntas </span>
              <span className="text-red-600">Frecuentes</span>
            </h1>
          </div>

          <div>
            <form onSubmit={handleBusqueda} className="max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar preguntas..."
                  className="w-full px-6 py-4 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-[#1e2bb8] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Columna derecha - Decoración */}
        <div className="flex-1 flex justify-center items-center pr-6 md:pr-20 lg:pr-60">
          <img
            src={DecoFaq}
            alt="Decoración FAQ"
            className="w-56 md:w-[25rem] lg:w-[35rem] max-w-full h-auto transition-transform transform hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
