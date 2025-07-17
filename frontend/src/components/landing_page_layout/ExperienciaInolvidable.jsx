import exp1 from "../../assets/landing/exp1.svg";
import exp2 from "../../assets/landing/exp2.svg";
import exp3 from "../../assets/landing/exp3.svg";

const experiencias = [
    { img: exp1, texto: "Viajes..." },
    { img: exp2, texto: "Estudiar..." },
    { img: exp3, texto: "Conocer gente !" },
];

export default function ExperienciaInolvidable() {
    return (
      <>
        <section className="bg-[#c42a2a] text-white py-24 px-6">
          <h2 className="text-center text-3xl md:text-4xl font-semibold mb-20" style={{ fontFamily: 'Inter, sans-serif' }}>
            Te espera una experiencia inolvidable...
          </h2>
  
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 justify-items-center items-start">
            {experiencias.map((exp, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center max-w-lg transition-transform transform hover:scale-110"
              >
                <img
                  src={exp.img}
                  alt={exp.texto}
                  className="w-64 md:w-72 lg:w-80 h-auto transition-transform transform hover:scale-115"
                />
                <p className="mt-6 text-2xl font-semibold transition-colors hover:text-gray-300">
                  {exp.texto}
                </p>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

