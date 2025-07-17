import { useNavigate } from "react-router-dom";

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r shadow px-6 py-4">
        <h2 className="text-xl font-bold mb-6">Erasmus UGR</h2>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Conectado como:</p>
          <p className="font-semibold">{usuario?.nombre}</p>
          <p className="text-xs">{usuario?.rol}</p>
        </div>

        <button
          onClick={cerrarSesion}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
