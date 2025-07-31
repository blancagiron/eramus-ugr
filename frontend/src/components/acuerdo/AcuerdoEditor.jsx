import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../dashboard/Sidebar";
import Hamburguesa from "../dashboard/Hamburguesa";
import InfoModal from "./InfoModal";

export default function AcuerdoEditor() {
  const [usuario, setUsuario] = useState(null);
  const [acuerdo, setAcuerdo] = useState(null);
  const [versiones, setVersiones] = useState([]);
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

        // cargar versiones
        fetch(`http://localhost:5000/api/acuerdos/${user.email}`)
          .then((res) => {
            if (res.status === 404) return [];
            return res.json();
          })
          .then((lista) => {
            setVersiones(lista);
            if (lista.length > 0) {
              const ultima = lista[0];
              setAcuerdo(ultima);
              setBloques(ultima.bloques || []);
              setDatosPersonales(ultima.datos_personales || {});
              setDatosMovilidad(ultima.datos_movilidad || {});
            }
          });

        fetch(`http://localhost:5000/api/acuerdos/${user.email}`)
          .then((res) => res.json())
          .then(setVersiones);

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

  const actualizarAcuerdo = async (estado = "borrador") => {
    if (!acuerdo?.version) return alert("No se ha cargado la versión actual");

    const payload = {
      email_estudiante: usuario.email,
      destino_codigo: usuario.destino_confirmado.codigo,
      datos_personales: {
        ...datosPersonales,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
      },
      datos_movilidad: {
        ...datosMovilidad,
        nombre_universidad: destino?.nombre_uni || "",
        codigo_universidad: destino?.codigo || "",
        pais: destino?.pais || "",
      },
      bloques,
      estado,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/acuerdos/${usuario.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.msg || "Acuerdo actualizado");
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  const crearNuevaVersion = async () => {
    const payload = {
      email_estudiante: usuario.email,
      destino_codigo: usuario.destino_confirmado.codigo,
      datos_personales: {
        ...datosPersonales,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
      },
      datos_movilidad: {
        ...datosMovilidad,
        nombre_universidad: destino?.nombre_uni || "",
        codigo_universidad: destino?.codigo || "",
        pais: destino?.pais || "",
      },
      bloques,
      estado,
    };

    try {
      const res = await fetch("http://localhost:5000/api/acuerdos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.msg || "Nueva versión creada");
      window.location.reload();
    } catch (err) {
      alert("Error al crear versión: " + err.message);
    }
  };

  const guardarAcuerdo = async (estado = "borrador", nuevaVersion = false) => {
    const payload = {
      email_estudiante: usuario.email,
      destino_codigo: usuario.destino_confirmado.codigo,
      datos_personales: {
        ...datosPersonales,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
      },
      datos_movilidad: {
        ...datosMovilidad,
        nombre_universidad: destino?.nombre_uni || "",
        codigo_universidad: destino?.codigo || "",
        pais: destino?.pais || "",
      },
      bloques,
      estado,
    };

    try {
      const endpoint = nuevaVersion || !acuerdo?.version
        ? "http://localhost:5000/api/acuerdos"
        : `http://localhost:5000/api/acuerdos/${usuario.email}`;
      const method = nuevaVersion || !acuerdo?.version ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.msg || "Guardado correctamente");
      window.location.reload();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };


  const añadirBloque = async (asig, tipo = "1x1", optatividad = false) => {
    const codigoUGR = asig.codigo_ugr;
    let asignaturaUGR = null;

    if (!optatividad && codigoUGR && asig.codigos_grado?.length > 0) {
      try {
        const res = await fetch("http://localhost:5000/api/asignaturas");
        const lista = await res.json();
        asignaturaUGR = lista.find(
          (a) => a.codigo === codigoUGR && asig.codigos_grado.includes(a.codigo_grado)
        );
      } catch (err) {
        console.error("Error cargando asignatura UGR:", err);
      }
    }

    const bloque = {
      asignaturas_destino: [
        {
          codigo: codigoUGR,
          nombre: asig.nombre_destino,
          ects: asig.creditos,
          guia: asig.guia || "",
          semestre: asig.semestre || "",
          curso: asig.curso || "",
        },
      ],
      asignaturas_ugr: [
        {
          codigo: optatividad ? "" : codigoUGR,
          nombre: optatividad ? "Optatividad" : asignaturaUGR?.nombre || asig.nombre_ugr || "Asignatura UGR",
          ects: optatividad ? asig.creditos : asignaturaUGR?.creditos || asig.creditos,
          guia: asignaturaUGR?.enlace || "",
          semestre: asignaturaUGR?.semestre || "",
          tipo: optatividad ? "OPT" : asignaturaUGR?.tipo || "OB",
          curso: asignaturaUGR?.curso || asig.curso || "",
        },
      ],
      tipo,
      optatividad,
    };

    setBloques((prev) => [...prev, bloque]);
  };

  const eliminarBloque = (index) => {
    const nuevosBloques = [...bloques];
    nuevosBloques.splice(index, 1);
    setBloques(nuevosBloques);
  };

  const exportarPDF = () => {
    if (!usuario?.email) return;
    window.open(`http://localhost:5000/api/acuerdos/${usuario.email}/exportar`, "_blank");
  };

  const totalECTS = (list, key) =>
    list.reduce((acc, b) => acc + (b[key]?.[0]?.ects || 0), 0);

  if (cargando) return <div className="p-10 text-center text-gray-600">Cargando datos...</div>;

  if (!usuario?.destino_confirmado) {
    return <div className="p-10 text-center text-red-600">No tienes destino confirmado.</div>;
  }

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen">
          <DashboardHeader
            titulo="Acuerdo de Estudios"
            subtitulo="Gestiona y envía tu propuesta de asignaturas para tu movilidad"
          />

          <div className="max-w-6xl mx-auto px-6 py-6">
            <button onClick={() => setMostrarInfo(true)} className="text-sm text-blue-700 underline">
              💡 ¿Necesitas ayuda para rellenar tu acuerdo?
            </button>
          </div>

          <InfoModal open={mostrarInfo} onClose={() => setMostrarInfo(false)} />

          <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
            {/* Mostrar versiones */}
            {versiones.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <strong>Versiones anteriores:</strong>{" "}
                {versiones.map((v, idx) => (
                  <span key={idx} className="inline-block mr-2 text-sm text-gray-700">
                    v{v.version || 1}
                  </span>
                ))}
              </div>
            )}

            {/* ... resto de componentes de datos personales, movilidad, asignaturas, bloques ... */}
            {/* DATOS PERSONALES */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Datos Personales</h2>
              <p className="text-sm text-gray-500">
                Estos datos se rellenan automáticamente desde tu perfil. Solo debes añadir tu DNI.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <input className="input" disabled value={usuario.nombre} />
                <input className="input" disabled value={usuario.apellidos} />
                <input className="input" disabled value={usuario.email} />
                <input
                  className="input"
                  placeholder="DNI / NIF"
                  value={datosPersonales.dni || ""}
                  onChange={(e) =>
                    setDatosPersonales({
                      ...datosPersonales,
                      dni: e.target.value,
                    })
                  }
                />
              </div>
            </section>

            {/* DATOS DE MOVILIDAD */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Datos de Movilidad</h2>
              <p className="text-sm text-gray-500">
                Introduce información relevante de tu estancia en el extranjero y del personal académico responsable.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="Curso académico"
                  value={datosMovilidad.curso_academico || ""}
                  onChange={(e) =>
                    setDatosMovilidad({
                      ...datosMovilidad,
                      curso_academico: e.target.value,
                    })
                  }
                />
                <input
                  className="input"
                  placeholder="Programa (ERASMUS+ o Programa Propio)"
                  value={datosMovilidad.programa || ""}
                  onChange={(e) =>
                    setDatosMovilidad({
                      ...datosMovilidad,
                      programa: e.target.value,
                    })
                  }
                />
                <input className="input" disabled value={destino?.nombre_uni || ""} />
                <input className="input" disabled value={destino?.codigo || ""} />
                <input className="input" disabled value={destino?.pais || ""} />
                <select
                  className="input"
                  value={datosMovilidad.periodo_estudios || ""}
                  onChange={(e) =>
                    setDatosMovilidad({
                      ...datosMovilidad,
                      periodo_estudios: e.target.value,
                    })
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
                    setDatosMovilidad({
                      ...datosMovilidad,
                      responsable: e.target.value,
                    })
                  }
                />
                <input
                  className="input"
                  placeholder="Tutor Docente"
                  value={datosMovilidad.tutor || ""}
                  onChange={(e) =>
                    setDatosMovilidad({
                      ...datosMovilidad,
                      tutor: e.target.value,
                    })
                  }
                />
                <input
                  className="input"
                  placeholder="Email Tutor Docente"
                  value={datosMovilidad.email_tutor || ""}
                  onChange={(e) =>
                    setDatosMovilidad({
                      ...datosMovilidad,
                      email_tutor: e.target.value,
                    })
                  }
                />
              </div>
            </section>

            {/* ASIGNATURAS DISPONIBLES */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Asignaturas en {destino?.nombre_uni}
              </h2>
              <p className="text-sm text-gray-500">
                Aquí tienes la lista de asignaturas que han sido reconocidas previamente en tu titulación. Puedes añadirlas a tu acuerdo.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destino?.asignaturas?.map((asig, idx) => (
                  <li key={idx} className="p-4 border rounded-lg shadow-sm space-y-2">
                    <div className="font-medium">{asig.nombre_destino}</div>
                    <div className="text-sm text-gray-500">
                      {asig.creditos} ECTS
                    </div>
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
              <h2 className="text-lg font-semibold text-gray-700">
                Asignaturas Seleccionadas
              </h2>
              <p className="text-sm text-gray-500">
                Estas son las asignaturas que has vinculado entre la UGR y la universidad de destino.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th colSpan="5" className="px-2 py-2 border text-center">UGR</th>
                      <th colSpan="4" className="px-2 py-2 border text-center">Destino</th>
                      <th className="px-2 py-2 border text-center">Acciones</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-1 border">Nombre</th>
                      <th className="px-2 py-1 border">Curso</th>
                      <th className="px-2 py-1 border">Semestre</th>
                      <th className="px-2 py-1 border">ECTS</th>
                      <th className="px-2 py-1 border">Tipo</th>
                      <th className="px-2 py-1 border">Nombre</th>
                      <th className="px-2 py-1 border">Curso</th>
                      <th className="px-2 py-1 border">Semestre</th>
                      <th className="px-2 py-1 border">ECTS</th>
                      <th className="px-2 py-1 border"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloques.map((bloque, i) => {
                      const ugr = bloque.asignaturas_ugr[0] || {};
                      const dest = bloque.asignaturas_destino[0] || {};
                      return (
                        <tr key={i}>
                          <td className="px-2 py-1 border">{ugr.nombre}</td>
                          <td className="px-2 py-1 border">{ugr.curso || ""}</td>
                          <td className="px-2 py-1 border">{ugr.semestre || ""}</td>
                          <td className="px-2 py-1 border">{ugr.ects}</td>
                          <td className="px-2 py-1 border">{ugr.tipo || "OPT"}</td>
                          <td className="px-2 py-1 border">{dest.nombre}</td>
                          <td className="px-2 py-1 border">{dest.curso || ""}</td>
                          <td className="px-2 py-1 border">{dest.semestre || ""}</td>
                          <td className="px-2 py-1 border">{dest.ects}</td>
                          <td className="px-2 py-1 border text-center">
                            <button
                              onClick={() => eliminarBloque(i)}
                              className="text-red-500 hover:underline text-xs"
                            >
                              ❌ Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan="3" className="px-2 py-2 border text-right">TOTAL CRÉDITOS</td>
                      <td className="px-2 py-2 border text-center">
                        {bloques.reduce((acc, b) => acc + (b.asignaturas_ugr?.[0]?.ects || 0), 0)}
                      </td>
                      <td className="px-2 py-2 border"></td>
                      <td colSpan="3" className="px-2 py-2 border text-right">TOTAL CRÉDITOS</td>
                      <td className="px-2 py-2 border text-center">
                        {bloques.reduce((acc, b) => acc + (b.asignaturas_destino?.[0]?.ects || 0), 0)}
                      </td>
                      <td className="px-2 py-2 border"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            <div className="flex gap-4">
              <button
                onClick={() => guardarAcuerdo("borrador")}
                className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => guardarAcuerdo("enviado")}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700"
              >
                Enviar al tutor
              </button>
              <button
                onClick={() => guardarAcuerdo("borrador", true)}
                className="bg-yellow-400 text-black px-6 py-3 rounded-xl hover:bg-yellow-500"
              >
                Guardar como nueva versión
              </button>
              <button
                onClick={exportarPDF}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
