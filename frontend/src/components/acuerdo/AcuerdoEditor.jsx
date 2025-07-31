import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../dashboard/Sidebar";
import Hamburguesa from "../dashboard/Hamburguesa";
import InfoModal from "./InfoModal";

export default function AcuerdoEditor() {
  const [usuario, setUsuario] = useState(null);
  const [acuerdo, setAcuerdo] = useState(null);
  const [destino, setDestino] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [datosPersonales, setDatosPersonales] = useState({});
  const [datosMovilidad, setDatosMovilidad] = useState({});
  const [cargando, setCargando] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;

    const localUser = JSON.parse(raw);

    fetch(`http://localhost:5000/usuarios/${localUser.email}`)
      .then((res) => res.json())
      .then((user) => {
        setUsuario(user);
        localStorage.setItem("usuario", JSON.stringify(user));

        fetch(`http://localhost:5000/api/acuerdo/${user.email}`)
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            if (data) {
              setAcuerdo(data);
              setBloques(data.bloques || []);
              setDatosPersonales(data.datos_personales || {});
              setDatosMovilidad(data.datos_movilidad || {});
            }
          });

        if (user.destino_confirmado?.codigo) {
          fetch(`http://localhost:5000/api/destinos/codigo/${encodeURIComponent(user.destino_confirmado.codigo)}`)
            .then((res) => res.json())
            .then(setDestino)
            .finally(() => setCargando(false));
        } else {
          setCargando(false);
        }
      });
  }, []);

  const guardarAcuerdo = (estado = "borrador") => {
    const payload = {
      email_estudiante: usuario.email,
      destino_codigo: usuario.destino_confirmado.codigo,
      datos_personales: datosPersonales,
      datos_movilidad: datosMovilidad,
      bloques,
      estado
    };

    fetch("http://localhost:5000/api/acuerdo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      alert(
        estado === "borrador"
          ? "Acuerdo guardado como borrador"
          : "Acuerdo enviado al tutor"
      );
      navigate("/estudiante");
    });
  };

  const añadirBloque = (asig, tipo = "1x1", optatividad = false) => {
    setBloques([
      ...bloques,
      {
        asignaturas_destino: [
          {
            codigo: asig.codigo_ugr,
            nombre: asig.nombre_destino,
            ects: asig.creditos,
            guia: asig.guia || "",
            semestre: asig.semestre || ""
          }
        ],
        asignaturas_ugr: [
          {
            codigo: optatividad ? "" : asig.codigo_ugr,
            nombre: optatividad ? "Optatividad" : asig.nombre_ugr,
            ects: asig.creditos,
            guia: "",
            semestre: asig.semestre || ""
          }
        ],
        tipo,
        optatividad
      }
    ]);
  };

  if (cargando) return <div className="p-10 text-center text-gray-600">Cargando datos...</div>;
  if (!usuario?.destino_confirmado) {
    return <div className="p-10 text-center text-red-600">No tienes destino confirmado.</div>;
  }

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible(prev => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen transition-all duration-300">
          <DashboardHeader
            titulo="Acuerdo de Estudios"
            subtitulo="Gestiona y envía tu propuesta de asignaturas para tu movilidad"
          />
          <div className="flex justify-end max-w-6xl mx-auto px-6 mt-4">
            <button
              onClick={() => setMostrarInfo(true)}
              className="text-sm text-blue-700 hover:underline"
            >
              💡 ¿Necesitas ayuda para rellenar tu acuerdo?
            </button>
          </div>

          <InfoModal open={mostrarInfo} onClose={() => setMostrarInfo(false)} />

          <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            {/* DATOS PERSONALES */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Datos Personales</h2>
              <div className="grid grid-cols-2 gap-4">
                <input className="input" disabled value={usuario.nombre} />
                <input className="input" disabled value={usuario.apellidos} />
                <input className="input" disabled value={usuario.email} />
                <input
                  className="input"
                  placeholder="DNI / NIF"
                  value={datosPersonales.dni || ""}
                  onChange={(e) => setDatosPersonales({ ...datosPersonales, dni: e.target.value })}
                />
              </div>
            </section>

            {/* DATOS MOVILIDAD */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Datos de Movilidad</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="Curso académico"
                  value={datosMovilidad.curso_academico || ""}
                  onChange={(e) =>
                    setDatosMovilidad({ ...datosMovilidad, curso_academico: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="Programa (ERASMUS+ o Programa Propio)"
                  value={datosMovilidad.programa || ""}
                  onChange={(e) =>
                    setDatosMovilidad({ ...datosMovilidad, programa: e.target.value })
                  }
                />
                <input className="input" disabled value={destino?.nombre_uni || ""} />
                <input className="input" disabled value={destino?.codigo || ""} />
                <input className="input" disabled value={destino?.pais || ""} />
                <select
                  className="input"
                  value={datosMovilidad.periodo_estudios || ""}
                  onChange={(e) =>
                    setDatosMovilidad({ ...datosMovilidad, periodo_estudios: e.target.value })
                  }
                >
                  <option value="">-- Periodo de estudios --</option>
                  <option value="Curso completo">Curso completo</option>
                  <option value="1er cuatrimestre">1er cuatrimestre</option>
                  <option value="2º cuatrimestre">2º cuatrimestre</option>
                </select>
                <input
                  className="input"
                  placeholder="Responsable académico"
                  value={datosMovilidad.responsable || ""}
                  onChange={(e) =>
                    setDatosMovilidad({ ...datosMovilidad, responsable: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="Tutor Docente"
                  value={datosMovilidad.tutor || ""}
                  onChange={(e) =>
                    setDatosMovilidad({ ...datosMovilidad, tutor: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="Email Tutor Docente"
                  value={datosMovilidad.email_tutor || ""}
                  onChange={(e) =>
                    setDatosMovilidad({ ...datosMovilidad, email_tutor: e.target.value })
                  }
                />
              </div>
            </section>

            {/* ASIGNATURAS DISPONIBLES */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Asignaturas en {destino?.nombre_uni}</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destino?.asignaturas?.map((asig, idx) => (
                  <li key={idx} className="p-4 border rounded-lg shadow-sm space-y-2">
                    <div className="font-medium">{asig.nombre_destino}</div>
                    <div className="text-sm text-gray-500">{asig.creditos} ECTS</div>
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
                        onClick={() => añadirBloque(asig)}
                      >
                        Añadir 1x1
                      </button>
                      <button
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded"
                        onClick={() => añadirBloque(asig, "optatividad", true)}
                      >
                        Añadir como Optatividad
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* BLOQUES AÑADIDOS */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Asignaturas Seleccionadas</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th colSpan="3" className="px-2 py-2 border text-center">UGR</th>
                      <th colSpan="2" className="px-2 py-2 border text-center">Destino</th>
                    </tr>
                    <tr>
                      <th className="px-2 py-1 border">Nombre / Curso / Sem</th>
                      <th className="px-2 py-1 border">ECTS</th>
                      <th className="px-2 py-1 border">FO/F/OP*</th>
                      <th className="px-2 py-1 border">Nombre / Curso / Sem</th>
                      <th className="px-2 py-1 border">ECTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloques.map((bloque, i) => (
                      <tr key={i}>
                        <td className="px-2 py-1 border">{bloque.asignaturas_ugr.map(a => a.nombre).join(" + ")}</td>
                        <td className="px-2 py-1 border">{bloque.asignaturas_ugr.reduce((acc, a) => acc + a.ects, 0)}</td>
                        <td className="px-2 py-1 border"></td>
                        <td className="px-2 py-1 border">{bloque.asignaturas_destino.map(a => a.nombre).join(" + ")}</td>
                        <td className="px-2 py-1 border">{bloque.asignaturas_destino.reduce((acc, a) => acc + a.ects, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* GUARDAR */}
            <div className="flex gap-4">
              <button
                onClick={() => guardarAcuerdo("borrador")}
                className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300"
              >
                Guardar como borrador
              </button>
              <button
                onClick={() => guardarAcuerdo("enviado")}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700"
              >
                Enviar al tutor
              </button>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
