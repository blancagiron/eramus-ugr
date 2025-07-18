// src/components/landing_page_layout/HeaderLanding.jsx
import logo from "../../assets/erasmus-logo-blanco.svg";
import ugrLogo from "../../assets/logo_ugr_blanco.svg";
import { Link } from "react-router-dom";

// ...




export default function HeaderLanding() {
  return (
    <header className="bg-red-600 text-white px-6 md:px-10 py-4 md:py-5 lg:py-6 flex justify-between items-center w-full shadow-md">
      {/* Logo izquierda */}
      <a href="/">
        <img
          src={logo}
          alt="Logo Erasmus"
          className="h-8 md:h-12 lg:h-16"
        />
      </a>

      {/* Menú */}
      <nav className="flex gap-6 md:gap-10 items-center text-base md:text-lg font-semibold">
        <a
          href="/faq"
          className="transition-colors text-xl text-white hover:text-black"
        >
          FAQ
        </a>
        <a
          href="/test-asignatura"
          className="transition-colors text-xl text-white hover:text-black"
        >
          Test Asignatura

        </a>
        <a
          href="/auth"
          className="transition-colors  text-xl text-white hover:text-black"
        >
          Log in
        </a>

        {/* Logo UGR derecha con enlace */}
        <a
          href="https://internacional.ugr.es/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={ugrLogo} alt="UGR" className="h-10 md:h-14 lg:h-16" />
        </a>
      </nav>
    </header>
  );
}
