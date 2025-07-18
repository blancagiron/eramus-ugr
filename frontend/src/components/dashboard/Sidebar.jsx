import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Home, MapPin, Search, Folder, FileText } from "lucide-react";
import logo from "../../assets/logo-tfg-final-v2.svg";

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.rol;

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/auth");
  };

  // Dashboard dinámico según rol
  const dashboardPath = rol === "tutor" ? "/dashboard/tutor" : "/dashboard/estudiante";

  const links = [
    { label: "Mi Perfil", icon: <User size={18} />, to: "/perfil" },
    { label: "Dashboard", icon: <Home size={18} />, to: dashboardPath },
    { label: "Destinos", icon: <MapPin size={18} />, to: "/destinos" },
    { label: "Convalidaciones", icon: <Search size={18} />, to: "/convalidaciones" },
    { label: "Documentación", icon: <Folder size={18} />, to: "/documentacion" },
    { label: "Mis acuerdos", icon: <FileText size={18} />, to: "/acuerdos" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-64 bg-white border-r shadow-md flex flex-col justify-between py-6">
        <div>
          {/* Logo */}
          <div className="flex justify-center mb-8 px-4">
            <img src={logo} alt="Logo Erasmus" className="h-28" /> {/* Cambiado de h-20 a h-28 */}
          </div>

          {/* Menú de navegación */}
          <nav className="space-y-2 px-4" style={{fontFamily: "Inter, sans-serif"}}>
            {links.map(({ label, icon, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 w-full rounded-full transition-all text-m ${
                    isActive || location.pathname.startsWith(to)
                      ? "bg-red-600 text-white font-semibold hover:text-black"
                      : "text-gray-700  hover:text-red-700"
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Botón logout */}
        <div className="px-4">
          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 text-gray-600 text-m hover:text-red-600 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-stone-100 p-6">{children}</main>
    </div>
  );
}
