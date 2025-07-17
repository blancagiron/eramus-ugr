import { useEffect, useState } from "react";
import HeaderLanding from "./landing_page_layout/HeaderLanding";
import FooterLanding from "./landing_page_layout/FooterLanding";
import QuestionCard from "./faq/QuestionCard";
import Pagination from "./Pagination";
import FormularioDuda from "./faq/FormularioDudas";
import HeroSectionFaq from "./faq/HeroSectionFaq";
import CategoriaTabs from "./faq/CategoriaTabs";

export default function FaqPage() {
  const [preguntas, setPreguntas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todas"); // <-- ahora por defecto es "todas"
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const porPagina = 6;

  // Obtener categorías al cargar la página
  useEffect(() => {
    fetch("http://localhost:5000/api/categorias")
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data.categorias || []);
      })
      .catch((err) => {
        console.error("Error cargando categorías:", err);
        setCategorias([]);
      });
  }, []);

  // Obtener preguntas al cambiar filtros
  useEffect(() => {
    if (!categoriaActiva) return;

    const query = new URLSearchParams({
      pagina,
      limite: porPagina,
    });

    if (categoriaActiva !== "todas") {
      query.append("categoria", categoriaActiva);
    }

    if (busqueda.trim()) {
      query.append("buscar", busqueda.trim());
    }

    fetch(`http://localhost:5000/api/preguntas?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setPreguntas(data.preguntas);
        setTotal(data.total);
      })
      .catch((err) => {
        console.error("Error cargando preguntas:", err);
        setPreguntas([]);
        setTotal(0);
      });
  }, [pagina, busqueda, categoriaActiva]);

  return (
    <div>
      <HeaderLanding />

      {/* Hero con buscador */}
      <HeroSectionFaq
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        setPagina={setPagina}
      />

      {/* Categorías */}
      <CategoriaTabs
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
        setPagina={setPagina}
      />

      {/* Preguntas */}
      <section className="bg-stone-100 px-6 py-16 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preguntas.length === 0 ? (
              <p className="text-center text-gray-500 col-span-2">
                No se encontraron preguntas.
              </p>
            ) : (
              preguntas.map((p, i) => (
                <QuestionCard
                  key={i}
                  pregunta={p.pregunta}
                  respuesta={p.respuesta}
                />
              ))
            )}
          </div>

          <Pagination
            total={Math.ceil(total / porPagina)}
            actual={pagina}
            setActual={setPagina}
          />
        </div>
      </section>

      {/* Formulario */}
      <FormularioDuda />
      <FooterLanding />
    </div>
  );
}
