import estrella1 from "../../assets/landing/estrella_roja_1.svg";
import estrella2 from "../../assets/landing/estrella_naranja_2.svg";
import estrella3 from "../../assets/landing/estrella_amarilla_3.svg";
import estrella4 from "../../assets/landing/estrella_verde_4.svg";
import estrella5 from "../../assets/landing/estrella_azul_5.svg";

const pasos = [
    { img: estrella1, texto: "Regístrate" },
    { img: estrella2, texto: "Completa tu perfil" },
    { img: estrella3, texto: "Explora destinos" },
    { img: estrella4, texto: "Crea tu acuerdo" },
    { img: estrella5, texto: "Consulta experiencias" },
];

export default function ComoFunciona() {
    return (
        <section className="bg-stone-100 py-24 px-6">
            <h2
                className="text-center text-3xl md:text-4xl font-semibold text-black mb-20"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                ¿Cómo funciona?
            </h2>

            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-14 justify-items-center">
                {pasos.map((paso, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <img
                            src={paso.img}
                            alt={`Paso ${index + 1}`}
                            className="w-40 sm:w-44 md:w-48 lg:w-56 h-auto transition-transform transform hover:scale-110 hover:rotate-6"
                        />
                        <p className="mt-6 text-black text-xl sm:text-2xl font-semibold max-w-[11rem] leading-tight">
                            {paso.texto}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
