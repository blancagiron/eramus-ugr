import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  FileText, MapPin, Calendar, CheckCircle, Upload,
  MessageCircle, HandHelping, BookOpen, AlertCircle, User
} from "lucide-react";

export default function EstudianteDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usuarioRaw = localStorage.getItem("usuario");
    if (usuarioRaw) {
      const u = JSON.parse(usuarioRaw);
      fetch(`http://localhost:5000/usuarios/${u.email}`)
        .then((res) => res.json())
        .then(setUser);
    }
  }, []);

  if (!user) {
    return <p className="p-6 text-gray-600">Cargando tu información...</p>;
  }

  const widgets = [
    {
      label: "Mi Acuerdo",
      icon: <FileText className="w-8 h-8" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      ruta: "/estudiante/acuerdo",
      descripcion: "Revisar y gestionar acuerdo de estudios"
    },
    {
      label: "Estado del Proceso",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      ruta: "/estudiante/estado",
      descripcion: "Ver progreso de tu aplicación"
    },
    {
      label: "Mi Destino",
      icon: <MapPin className="w-8 h-8" />,
      color: "bg-gradient-to-br from-violet-500 to-purple-600",
      ruta:
        user.estado_proceso === "con destino" && user.destino_confirmado?.nombre_uni
          ? `/destinos/${encodeURIComponent(user.destino_confirmado.nombre_uni)}`
          : "/estudiante/destino-no-asignado",

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
      label: "Documentación",
      icon: <Upload className="w-8 h-8" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      ruta: "/estudiante/documentos",
      descripcion: "Subir y gestionar documentos"
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Estado Actual: {user.estado_proceso === "con destino" ? "Destino asignado" : "Acuerdo Pendiente"}
            </h2>
          </div>
          {user.destino_confirmado ? (
            <div className="text-sm text-gray-700">
              <strong>Destino:</strong> {user.destino_confirmado.nombre_uni}
            </div>
          ) : (
            <p className="text-gray-600">Aún no tienes un destino asignado.</p>
          )}
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
                <span className="text-base font-medium leading-tight">
                  {label}
                </span>
                <span className="text-xs opacity-90 font-normal leading-tight">
                  {descripcion}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Accesos rápidos adicionales */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Progreso General
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completado</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                3 de 5 tareas principales completadas
              </p>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
