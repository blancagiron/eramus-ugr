import azulejo from "../../assets/dashboard/azulejo_rojo_header.svg";

export default function DashboardHeader({ titulo, subtitulo }) {
  return (
    <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white px-8 py-8 overflow-hidden">
      {/* Patrón geométrico sutil */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${azulejo})`,
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: "120px",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      ></div>
      
      {/* Overlay con ruido para textura */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-black/10 z-5"></div>
      
      {/* Efectos de luz */}
      <div className="absolute top-0 left-1/4 w-96 h-24 bg-white/10 blur-3xl rounded-full transform -translate-y-12"></div>
      <div className="absolute bottom-0 right-1/3 w-64 h-16 bg-red-300/20 blur-2xl rounded-full transform translate-y-8"></div>

      {/* Contenido */}
      <div className="relative z-20 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-1" 
              style={{fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em"}}>
            {titulo}
          </h1>
          {subtitulo && (
            <p className="text-red-50/90 text-sm font-medium">
              {subtitulo}
            </p>
          )}
        </div>
        
        {/* Elemento decorativo minimalista */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
          <div className="w-1 h-1 bg-white/10 rounded-full"></div>
        </div>
      </div>
      
      {/* Línea de separación elegante */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
}