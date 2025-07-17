import logo from "../../assets/logo-tfg-final-v2.svg";
import mosaico_entero_svg from "../../assets/landing/mosaico_entero.svg";

export default function HeroSection() {
  return (
    <section className="relative bg-stone-100 min-h-[93vh] flex">
      {/* Móvil - Solo logo centrado */}
      <div className="flex md:hidden w-full justify-center items-center">
        <img src={logo} alt="Erasmus UGR" className="w-64" />
      </div>

      {/* Tablet y Desktop - Logo y mosaico lado a lado */}
      <div className="hidden md:flex w-full">
        {/* Lado izquierdo - Logo */}
        <div className="flex-1 flex justify-start items-center pl-6 md:pl-20 lg:pl-60">
          <img src={logo} alt="Erasmus UGR" className="w-64 md:w-96 lg:w-[45rem]" />
        </div>
        
        {/* Lado derecho - Mosaico */}
        <div className="flex-1 flex justify-center items-center pr-6 md:pr-20 lg:pr-60">
          <img
            src={mosaico_entero_svg}
            alt="Mosaico"
            className="w-48 md:w-72 lg:w-[50rem] max-w-full h-auto transition-transform transform hover:scale-105 "
          />
        </div>
      </div>
    </section>
  );
}