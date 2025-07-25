import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  FileText,
  MapPin,
  Calendar,
  CheckCircle,
  Upload,
  MessageCircle,
  HandHelping,
  BookOpen,
  AlertCircle,
  User
} from "lucide-react";

export default function EstudianteDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("usuario"));

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
      ruta: "/estudiante/destino",
      descripcion: "Información de tu universidad destino"
    },
    {
      label: "Recursos útiles",
      icon: <HandHelping className="w-8 h-8" />,
      color: "bg-gradient-to-br from-rose-500 to-pink-600",
      descripcion: "Fechas importantes y plazos",
      externalLink: "https://internacional.ugr.es/estudiantes/movilidad-saliente/grado-estudio/movilidad-internacional" // Enlace externo
    },
    {
      label: "Documentación",
      icon: <Upload className="w-8 h-8" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      ruta: "/estudiante/documentos",
      descripcion: "Subir y gestionar documentos"
    },
    {
      label: "Chat con Tutor",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "bg-gradient-to-br from-cyan-500 to-blue-500",
      ruta: "/estudiante/chat",
      descripcion: "Comunicación con tu tutor"
    },
    {
      label: "Mi Perfil",
      icon: <User className="w-8 h-8" />,
      color: "bg-gradient-to-br from-indigo-500 to-purple-500",
      ruta: "/perfil",
      descripcion: "Actualizar información personal"
    }
  ];

  return (
    <Sidebar siempreVisible>
      <div className="min-h-screen p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Hola, {user?.nombre}!
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona tu proceso Erasmus desde aquí
          </p>
        </div>

        {/* Resumen rápido del estado */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-gray-800">Estado Actual: Acuerdo Pendiente</h2>
          </div>
          <p className="text-gray-600 mb-3">
            Tu próximo paso es corregir el acuerdo de estudios. 
          </p>
          <div className="text-sm text-gray-500">
            <strong>Destino:</strong> Sapienza-Roma, Italia • <strong>Período:</strong> Sep 2025 - Feb 2026
          </div>
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
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
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