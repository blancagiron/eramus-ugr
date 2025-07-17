import Sidebar  from "./Sidebar";

export default function EstudianteDashboard() {
  const user = JSON.parse(localStorage.getItem("usuario"));

  return (
    <Sidebar>
      <h1 className="text-2xl font-bold">Bienvenido/a, {user?.nombre}</h1>
      <p className="text-gray-600 mt-2">Este es tu panel como estudiante Erasmus.</p>

      {/* Aquí irán tus widgets */}
    </Sidebar>
  );
}
