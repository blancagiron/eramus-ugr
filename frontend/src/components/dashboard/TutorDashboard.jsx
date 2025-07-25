import Sidebar  from "./Sidebar";

export default function TutorDashboard() {
  const user = JSON.parse(localStorage.getItem("usuario"));

  return (
    <Sidebar>
      <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenido/a, {user?.nombre}</h1>
      <p className="text-gray-600 mt-2">Este es tu panel como tutor Erasmus.</p>
      </div>
      {/* Aquí irán tus widgets */}
    </Sidebar>
  );
}
