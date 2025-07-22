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
      icon: <Users className="w-6 h-6" />,
      color: "bg-red-500",
      ruta: "/admin/usuarios",
    },
    {
      label: "Gestionar Destinos",
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-red-400",
      ruta: "/admin/destinos",
    },
    {
      label: "Importar Destinos",
      icon: <Upload className="w-6 h-6" />,
      color: "bg-blue-500",
      ruta: "/admin/importar-destinos",
    },
    {
      label: "Gestionar Centros",
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-gray-700",
      ruta: "/admin/centros",
    },
    {
      label: "Gestionar Grados",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "bg-orange-500",
      ruta: "/admin/grados",
    },
    
  ];

  return (
    <>
      <Sidebar siempreVisible>
        <div className="min-h-screen p-6 max-w-7xl">
          <h1 className="text-2xl font-bold">
            Bienvenido/a, {user?.nombre}
          </h1>
          <p className="text-gray-600 mb-8">Este es tu panel como administrador.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ fontFamily: "Inter, sans-serif" }}>
            {accesos.map(({ label, icon, color, ruta }) => (
              <button
                key={label}
                onClick={() => navigate(ruta)}
                className={`rounded-xl text-white py-6 px-4 flex items-center justify-center gap-4 font-semibold shadow hover:brightness-110 transition-all ${color}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      </Sidebar>
    </>
  );
}
