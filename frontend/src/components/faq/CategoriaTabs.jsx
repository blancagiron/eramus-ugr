export default function CategoriaTabs({
  categorias,
  categoriaActiva,
  setCategoriaActiva,
  setPagina,
}) {
  const categoriasConTodas = ["todas", ...categorias];

  const handleCategoriaClick = (cat) => {
    setCategoriaActiva(cat);
    setPagina(1);
  };

  return (
    <section className="px-6 pt-8 pb-4 bg-stone-100">
      <div className="w-full max-w-full mx-auto h-[2px] bg-black mb-12"></div>
      <div className="max-w-6xl mx-auto">

        {/* Tabs siempre visibles y responsive */}
        <div className="flex flex-wrap gap-4 text-lg md:text-xl font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
          {categoriasConTodas.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoriaClick(cat)}
              className={`pb-2 transition-colors duration-200 relative capitalize ${
                categoriaActiva === cat
                  ? "text-red-700 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-red-700"
                  : "hover:text-red-700"
              }`} 
            >
              {cat === "todas" ? "Todas" : cat}
            </button>
          ))}
        </div>

        <div className="h-[1px] bg-gray-300 mt-3"></div>
      </div>
    </section>
  );
}
