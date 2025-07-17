import HeaderLanding from "./landing_page_layout/HeaderLanding";
import HeroSection from "./landing_page_layout/HeroSectionLanding";
import PorqueUsar from "./landing_page_layout/PorqueUsar";
import ComoFunciona from "./landing_page_layout/ComoFunciona";
import ExperienciaInolvidable from "./landing_page_layout/ExperienciaInolvidable";
import LlamadaAccion from "./landing_page_layout/LlamadaAccion";
import FooterLanding from "./landing_page_layout/FooterLanding";



export default function LandingPage() {
  return (
    <div>
      <HeaderLanding />
      <HeroSection />
      <PorqueUsar />
      <ComoFunciona />
      <ExperienciaInolvidable />
      <LlamadaAccion />
      <FooterLanding />
    </div>
  );
}