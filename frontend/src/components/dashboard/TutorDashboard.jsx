import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FileText, GraduationCap, Globe, ClipboardCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TutorDashboard() {
  const user = JSON.parse(localStorage.getItem("usuario"));
  const [destinos, setDestinos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email && user?.rol === "tutor") {
      fetch(`http://localhost:5000/api/tutor/${user.email}/dashboard`)
        .then((res) => res.json())
        .then((data) => {
          setDestinos(data.destinos || []);
          setEstudiantes(data.estudiantes || []);
        });
    }
  }, []);

  const acuerdosEnviados = estudiantes.filter(e => e.acuerdo !== "no enviado").length;
  const acuerdosPendientes = estudiantes.filter(e => e.acuerdo === "enviado").length;

  return (
    <Sidebar>
      <div className="p-6 max-w-7xl ">
        <h1 className="text-3xl font-bold mb-4">Bienvenido/a, {user?.nombre}</h1>
        <p className="text-gray-600 mb-6">Este es tu panel como tutor Erasmus.</p>

        {/* WIDGETS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <WidgetCard icon={<Globe className="w-6 h-6" />} title="Destinos asignados" value={destinos.length} color="from-indigo-500 to-blue-600" />
          <WidgetCard icon={<GraduationCap className="w-6 h-6" />} title="Estudiantes asignados" value={estudiantes.length} color="from-green-500 to-emerald-600" />
          <WidgetCard icon={<FileText className="w-6 h-6" />} title="Acuerdos enviados" value={acuerdosEnviados} color="from-yellow-500 to-amber-500" />
          <WidgetCard icon={<ClipboardCheck className="w-6 h-6" />} title="Pendientes de revisión" value={acuerdosPendientes} color="from-red-500 to-pink-500" />
        </div>

        {/* DESTINOS */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Destinos asignados
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            {destinos.map((d) => (
              <li key={d.codigo}>
                <strong>{d.nombre_uni}</strong> ({d.codigo})
              </li>
            ))}
          </ul>
        </div>

        {/* ESTUDIANTES */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Estudiantes con destino asignado
          </h2>

          {estudiantes.length === 0 ? (
            <p className="text-gray-500">No hay estudiantes asignados a tus destinos todavía.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Nombre</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Destino</th>
                  <th className="border p-2 text-left">Estado Acuerdo</th>
                  <th className="border p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((e, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{e.nombre} {e.apellido1} {e.apellido2}</td>
                    <td className="border px-2 py-1">{e.email}</td>
                    <td className="border px-2 py-1">{e.destino}</td>
                    <td className="border px-2 py-1 capitalize">{e.acuerdo}</td>
                    <td className="border px-2 py-1 text-center">
                      {e.acuerdo !== "no enviado" ? (
                        <button
                          onClick={() => navigate(`/tutor/acuerdo/${e.email}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Ver Acuerdo
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

function WidgetCard({ icon, title, value, color }) {
  return (
    <div
      className={`bg-gradient-to-br ${color} text-white rounded-xl p-4 shadow-md flex items-center gap-4`}
    >
      <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm">{title}</div>
      </div>
    </div>
  );
}
