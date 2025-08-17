// src/components/landing_page_layout/FooterLanding.jsx
import logoUGR from "../../assets/logo_ugr_blanco.svg";
import logoGranada from "../../assets/logo_redondo_blanco.svg";

export default function FooterLanding() {
    return (
        <footer className="bg-gradient-to-br from-red-600 to-red-900 text-white relative overflow-hidden">
            {/* Patrón decorativo de fondo */}


            <div className="relative z-10 py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm md:text-base">

                    {/* Enlaces rápidos */}
                    <div className="group">
                        <h3 className="font-bold text-lg mb-4 text-white border-b-2 border-white/20 pb-2 group-hover:border-white/40 transition-colors duration-300">
                            Enlaces rápidos
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-white hover:text-red-200 transition-colors duration-200 flex items-center group/link no-underline">
                                    <span className="w-2 h-2 bg-white rounded-full mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"></span>
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a href="/faq" className="text-white hover:text-red-200 transition-colors duration-200 flex items-center group/link no-underline">
                                    <span className="w-2 h-2 bg-white rounded-full mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"></span>
                                    Preguntas frecuentes
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="group">
                        <h3 className="font-bold text-lg mb-4 text-white border-b-2 border-white/20 pb-2 group-hover:border-white/40 transition-colors duration-300">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/privacidad" className="text-white hover:text-red-200 transition-colors duration-200 flex items-center group/link no-underline">
                                    <span className="w-2 h-2 bg-white rounded-full mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"></span>
                                    Política de privacidad
                                </a>
                            </li>
                            <li>
                                <a href="/legal" className="text-white hover:text-red-200 transition-colors duration-200 flex items-center group/link no-underline">
                                    <span className="w-2 h-2 bg-white rounded-full mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"></span>
                                    Aviso Legal
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-red-200 transition-colors duration-200 flex items-center group/link no-underline">
                                    <span className="w-2 h-2 bg-white rounded-full mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"></span>
                                    Licencia del software
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="group">
                        <h3 className="font-bold text-lg mb-4 text-white border-b-2 border-white/20 pb-2 group-hover:border-white/40 transition-colors duration-300">
                            Contacto
                        </h3>
                        <div className="space-y-2 text-red-100">


                            <a 
                              href="https://www.ugr.es/" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-white hover:text-red-200 transition-colors duration-200 flex items-center no-underline"
                            >
                              Universidad de Granada
                            </a>


                            <p className="hover:text-white transition-colors mr-3 duration-200 cursor-pointer">
                                +34 958 24 90 30
                            </p>

                            <p>Oficina de Relaciones Internacionales</p>
                            <p className="hover:text-white transition-colors duration-200 cursor-pointer">
                                intlinfo@ugr.es
                            </p>

                        </div>
                    </div>

                    {/* Logos */}
                    <div className="flex flex-col items-center justify-center gap-8">
                        <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            <img src={logoUGR} alt="UGR" className="h-20 md:h-24" />
                        </div>
                        <div className="p-4 hover:scale-105 transition-all duration-300">
                            <img src={logoGranada} alt="Logo Granada" className="h-36 md:h-40 lg:h-44" />
                        </div>

                    </div>
                </div>
            </div>

            {/* Línea divisoria y copyright */}
            <div className="relative z-10 border-t border-white/20 bg-red-800/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-red-100">
                        <p>© 2025 Universidad de Granada. Todos los derechos reservados.</p>
                        <p className="mt-2 md:mt-0">Plataforma de Intercambio Estudiantil</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}