import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  FileText, MapPin, CheckCircle, MessageCircle, HandHelping, User
} from "lucide-react";
import NotificacionesWidget from "./NotificationWidget";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EstudianteDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usuarioRaw = localStorage.getItem("usuario");
    if (usuarioRaw) {
      const u = JSON.parse(usuarioRaw);
      fetch(`${BASE_URL}/usuarios/${u.email}`)
        .then((res) => res.json())
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, []);

  if (!user) {
    return <p className="p-6 text-gray-600">Cargando tu información...</p>;
  }

  // Estado y ruta dinámica para "Mi Destino"
  const estado = user?.estado_proceso || "pendiente";
  const destinoRuta =
    estado === "sin destino"
      ? "/estudiante/destino-no-asignado"
      : (user?.destino_confirmado?.nombre_uni
          ? `/destinos/${encodeURIComponent(user.destino_confirmado.nombre_uni)}`
          : "/destinos");

  const widgets = [
    {
      label: "Mi Acuerdo",
      icon: <FileText className="w-8 h-8" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      ruta: "/estudiante/acuerdo",
      descripcion: "Revisar y gestionar acuerdo de estudios"
    },
    {
      label: "Historial de tu movilidad",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      ruta: "/estudiante/progreso",
      descripcion: "Ver progreso de tu aplicación"
    },
    {
      label: "Mi Destino",
      icon: <MapPin className="w-8 h-8" />,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      ruta: destinoRuta,
      descripcion: "Información de tu universidad destino"
    },
    {
      label: "Recursos útiles",
      icon: <HandHelping className="w-8 h-8" />,
      color: "bg-gradient-to-br from-rose-500 to-pink-600",
      descripcion: "Fechas importantes y plazos",
      externalLink:
        "https://internacional.ugr.es/estudiantes/movilidad-saliente/grado-estudio/movilidad-internacional"
    },
    {
      label: "Comunicación con Tutor",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "bg-gradient-to-br from-cyan-500 to-blue-500",
      ruta: "/estudiante/comunicacion",
      descripcion: "Comunicación con tu tutor"
    },
    {
      label: "Mi Perfil",
      icon: <User className="w-8 h-8" />,
      color: "bg-gradient-to-br from-red-500 to-red-800",
      ruta: "/perfil",
      descripcion: "Actualizar información personal"
    }
  ];

  return (
    <Sidebar siempreVisible>
      <div className="min-h-screen p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
            ¡Hola, {user.nombre}!
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona tu proceso Erasmus desde aquí
          </p>
        </div>

        {/* Resumen rápido del estado */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          {(() => {
            const mapa = {
              "sin destino": { titulo: "Sin destino asignado", dot: "bg-gray-400" },
              "con destino": { titulo: "Destino asignado", dot: "bg-blue-500" },
              "en revision": { titulo: "Acuerdo en revisión", dot: "bg-amber-500" },
              "acuerdo_borrador": { titulo: "Borrador de Acuerdo", dot: "bg-orange-500" },
              "cambios_solicitados": { titulo: "Acuerdo con cambios solicitados", dot: "bg-orange-500" },
              "aprobado": { titulo: "Acuerdo aprobado", dot: "bg-green-500" },
              pendiente: { titulo: "Acuerdo pendiente", dot: "bg-yellow-400" },
            };
            const info = mapa[estado] || mapa.pendiente;

            return (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-3 h-3 ${info.dot} rounded-full animate-pulse`}></div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Estado actual: {info.titulo}
                  </h2>
                </div>

                {user?.destino_confirmado ? (
                  <div className="text-sm text-gray-700">
                    <strong>Destino:</strong> {user.destino_confirmado.nombre_uni}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {estado === "sin destino"
                      ? "Aún no tienes un destino asignado."
                      : "Cuando tengas destino confirmado aparecerá aquí."}
                  </p>
                )}
              </>
            );
          })()}
        </div>

        {/* Grid de widgets */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {widgets.map(({ label, icon, color, ruta, descripcion, externalLink }) => (
            <button
              key={label}
              onClick={() => externalLink ? window.open(externalLink, "_blank") : navigate(ruta)}
              className={`
                relative h-36 w-full rounded-2xl text-white p-6 
                flex flex-col items-center justify-center gap-3 
                font-semibold shadow-lg border border-white/10
                hover:scale-105 hover:shadow-xl 
                transition-all duration-200 ease-out
                active:scale-95
                ${color}
              `}
            >
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                {icon}
                <span className="text-lg font-medium leading-tight">
                  {label}
                </span>
                <span className="text-xs opacity-90 font-normal leading-tight">
                  {descripcion}
                </span>
              </div>
            </button>
          ))}
        </div>

        <NotificacionesWidget email={user?.email} />
      </div>
    </Sidebar>
  );
}
