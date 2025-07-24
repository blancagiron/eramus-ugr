import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import Hamburguesa from "../dashboard/Hamburguesa";
import {
  Users,
  MapPin,
  Upload,
  Building2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("usuario"));

  const accesos = [
    {
      label: "Gestionar Usuarios",
      icon: <Users className="w-8 h-8" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      ruta: "/admin/usuarios",
    },
    {
      label: "Gestionar Destinos",
      icon: <MapPin className="w-8 h-8" />,
      color: "bg-gradient-to-br from-red-400 to-red-500",
      ruta: "/admin/destinos",
    },
    {
      label: "Importar Destinos",
      icon: <Upload className="w-8 h-8" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      ruta: "/admin/importar-destinos",
    },
    {
      label: "Gestionar Centros",
      icon: <Building2 className="w-8 h-8" />,
      color: "bg-gradient-to-br from-gray-700 to-gray-800",
      ruta: "/admin/centros",
    },
    {
      label: "Gestionar Grados",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      ruta: "/admin/grados",
    },
  ];

  return (
    <>
      <Sidebar siempreVisible>
        <div className="min-h-screen p-6 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenido/a, {user?.nombre}
            </h1>
            <p className="text-gray-600 text-lg">
              Este es tu panel como administrador.
            </p>
          </div>

          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {accesos.map(({ label, icon, color, ruta }) => (
              <button
                key={label}
                onClick={() => navigate(ruta)}
                className={`
                  relative h-32 w-full rounded-2xl text-white p-6 
                  flex flex-col items-center justify-center gap-3 
                  font-semibold shadow-lg border border-white/10
                  hover:scale-105 hover:shadow-xl 
                  transition-all duration-200 ease-out
                  active:scale-95
                  ${color}
                `}
              >
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  {icon}
                  <span className="text-center text-base font-medium leading-tight">
                    {label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Sidebar>
    </>
  );
}