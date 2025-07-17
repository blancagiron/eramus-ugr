export default function LlamadaAccion() {
    return (
        <section className="bg-stone-100 py-32 px-6 text-center">
            <h2
                className="text-3xl md:text-4xl font-semibold text-red-700 mb-10"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                ¿Comenzamos la aventura?
            </h2>
            <a
                href="/auth"
                className="inline-block bg-red-600 text-white text-lg md:text-xl font-semibold px-8 py-4 rounded-full border-2 border-red-700 hover:bg-white hover:text-red-700 hover:border-red-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md relative overflow-hidden group"
            >
                <span className="relative z-10">Regístrate</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
        </section>
    );
}