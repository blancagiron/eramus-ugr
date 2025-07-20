import azulejo from "../../assets/dashboard/azulejo_rojo_header.svg";

export default function DashboardHeader({ titulo, subtitulo }) {
  return (
    <div className="relative bg-[#c42a2a] text-white px-8 py-6 overflow-hidden">
      {/* Capa del patrón con opacidad */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${azulejo})`,
          backgroundRepeat: "repeat",
          backgroundPosition: "top right",
          backgroundSize: "100px",
          opacity: 0.4, // Ajusta la opacidad aquí
          pointerEvents: "none",
        }}
      ></div>

      {/* Contenido */}
      <div className="relative z-10">
        <h1 className="text-3xl font-semibold"  style={{fontFamily: "Inter, sans-serif"}}>{titulo}</h1>
        {subtitulo && <p className="text-m mt-1">{subtitulo}</p>}
      </div>
    </div>
  );
}
