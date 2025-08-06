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
  const [mensajeValidacion, setMensajeValidacion] = useState("");
  const [nombreTutorDocente, setNombreTutorDocente] = useState("");

  const [asignaturaUGRSeleccionada, setAsignaturaUGRSeleccionada] = useState(null);
  const [asignaturasUGRDisponibles, setAsignaturasUGRDisponibles] = useState([]);
  const [seleccionadasDestino, setSeleccionadasDestino] = useState([]);

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

        fetch("http://localhost:5000/api/asignaturas")
          .then((res) => res.json())
          .then((lista) => {
            if (user?.codigo_grado) {
              const delGrado = lista.filter((a) => a.codigo_grado === user.codigo_grado);
              setAsignaturasUGRDisponibles(delGrado);
            }
          });

        if (user.destino_confirmado?.codigo) {
          fetch(`http://localhost:5000/api/destinos/codigo/${encodeURIComponent(user.destino_confirmado.codigo)}`)
            .then((res) => res.json())
            .then((dest) => {
              setDestino(dest);

              if (dest.tutor_asignado) {
                fetch(`http://localhost:5000/usuarios/email/${encodeURIComponent(dest.tutor_asignado)}`)
                  .then((res) => res.json())
                  .then((tutor) => {
                    if (tutor?.nombre && tutor?.primer_apellido) {
                      const nombreCompleto = `${tutor.nombre} ${tutor.primer_apellido} ${tutor.segundo_apellido || ""}`.trim();
                      setNombreTutorDocente(nombreCompleto);
                      setDatosMovilidad((prev) => ({
                        ...prev,
                        email_tutor: tutor.email,
                      }));
                    }
                  })
                  .catch((err) => console.error("Error obteniendo tutor docente:", err));
              }
            })
            .finally(() => setCargando(false));
        }
      });
  }, []);

  useEffect(() => {
    if (mensajeValidacion) {
      const timeout = setTimeout(() => setMensajeValidacion(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensajeValidacion]);

  const toggleSeleccionDestino = (asig) => {
    setSeleccionadasDestino((prev) => {
      const yaSeleccionada = prev.find(
        (a) =>
          a.codigo_ugr === asig.codigo_ugr &&
          a.codigos_grado?.[0] === asig.codigos_grado?.[0]
      );

      if (yaSeleccionada) {
        return prev.filter(
          (a) =>
            !(a.codigo_ugr === asig.codigo_ugr &&
              a.codigos_grado?.[0] === asig.codigos_grado?.[0])
        );
      } else if (prev.length < 2) {
        return [...prev, asig];
      } else {
        // en lugar de alert, puedes usar un mensaje de estado o toast
        console.warn("Solo puedes seleccionar hasta 2 asignaturas del destino");
        return prev;
      }
    });
  };

  const codigosUGRUtilizados = bloques.flatMap(b =>
    b.asignaturas_ugr.map(a => a.codigo)
  );


  const crearBloquePersonalizado = () => {
    if (!asignaturaUGRSeleccionada || seleccionadasDestino.length === 0) {
      setMensajeValidacion("Selecciona al menos una asignatura UGR y 1-2 del destino");
      return;
    }

    if (!asignaturaUGRSeleccionada || seleccionadasDestino.length === 0) {
      setMensajeValidacion("Selecciona al menos una asignatura UGR y 1-2 del destino.");
      return;
    }

    if (codigosUGRUtilizados.includes(asignaturaUGRSeleccionada.codigo)) {
      setMensajeValidacion("Esa asignatura UGR ya está utilizada.");
      return;
    }

    const bloque = {
      asignaturas_ugr: [
        {
          codigo: asignaturaUGRSeleccionada.codigo,
          nombre: asignaturaUGRSeleccionada.nombre,
          ects: asignaturaUGRSeleccionada.creditos,
          guia: asignaturaUGRSeleccionada.enlace || "",
          semestre: asignaturaUGRSeleccionada.semestre || "",
          tipo: asignaturaUGRSeleccionada.tipo || "OB",
          curso: asignaturaUGRSeleccionada.curso || "",
        }
      ],
      asignaturas_destino: seleccionadasDestino.map((a) => ({
        codigo: a.codigo,
        nombre: a.nombre_destino,
        ects: a.creditos,
        guia: a.guia || "",
        semestre: a.semestre || "",
        curso: a.curso || "",
      })),
      tipo: "bloque",
      optatividad: false,
    };

    setBloques((prev) => [...prev, bloque]);
    setAsignaturaUGRSeleccionada(null);
    setSeleccionadasDestino([]);
  };

  const actualizarAcuerdo = async (estado = "borrador") => {
    if (!acuerdo?.version) return alert("No se ha cargado la versión actual");

    const payload = {
      email_estudiante: usuario.email,
      destino_codigo: usuario.destino_confirmado.codigo,
      datos_personales: {
        ...datosPersonales,
        nombre: usuario.nombre,
        primer_apellido: usuario.primer_apellido,
        segundo_apellido: usuario.segundo_apellido,
        grado: usuario.grado,
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



  const guardarAcuerdo = async (estado = "borrador", nuevaVersion = false) => {
    const payload = {
      email_estudiante: usuario.email,
      destino_codigo: usuario.destino_confirmado.codigo,
      datos_personales: {
        ...datosPersonales,
        nombre: usuario.nombre,
        primer_apellido: usuario.primer_apellido,
        segundo_apellido: usuario.segundo_apellido,
        email: usuario.email,
        grado: usuario.grado,
      },
      datos_movilidad: {
        ...datosMovilidad,
        nombre_universidad: destino?.nombre_uni || "",
        codigo_universidad: destino?.codigo || "",
        pais: destino?.pais || "",
        periodo_estudios: datosMovilidad.periodo_estudios || "",
        tutor: nombreTutorDocente || "", // ← nombre completo del tutor
        email_tutor: destino?.tutor_asignado || "", // ← email del tutor
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

    if (!optatividad && codigosUGRUtilizados.includes(asig.codigo_ugr)) {
      setMensajeValidacion("Esa asignatura UGR ya ha sido añadida a otro bloque.");
      return;
    }
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
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Datos Personales</h2>
              <p className="text-sm text-gray-500">
                Estos datos se rellenan automáticamente desde tu perfil. Solo debes añadir tu DNI.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <input className="input" disabled value={usuario.nombre} />
                <input className="input" disabled value={usuario.primer_apellido} />
                <input className="input" disabled value={usuario.segundo_apellido} />
                <input className="input" disabled value={usuario.email} />
                <input className="input" disabled value={usuario.grado} />
                <input
                  className="input"
                  placeholder="DNI / NIF"
                  value={datosPersonales.dni || ""}
                  onChange={(e) =>
                    setDatosPersonales({ ...datosPersonales, dni: e.target.value })
                  }
                />
              </div>
            </section>

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
                    setDatosMovilidad({ ...datosMovilidad, curso_academico: e.target.value })
                  }
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="programa"
                      value="ERASMUS+"
                      checked={datosMovilidad.programa === "ERASMUS+"}
                      onChange={(e) => setDatosMovilidad({ ...datosMovilidad, programa: e.target.value })}
                    />
                    ERASMUS+
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="programa"
                      value="Programa Propio"
                      checked={datosMovilidad.programa === "Programa Propio"}
                      onChange={(e) => setDatosMovilidad({ ...datosMovilidad, programa: e.target.value })}
                    />
                    Programa Propio
                  </label>
                </div>
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
                  onChange={(e) => setDatosMovilidad({ ...datosMovilidad, responsable: e.target.value })}
                />

                {/* <input
                  className="input"
                  placeholder="Nombre del tutor"
                  value={datosMovilidad.email_tutor || ""}
                  onChange={(e) => setDatosMovilidad({ ...datosMovilidad, email_tutor: e.target.value })}
                /> */}
                <input className="input" disabled value={nombreTutorDocente || "Tutor todavía no asignado"} />

                <input className="input" disabled value={destino.tutor_asignado || "Tutor todavía no asignado"} />
              </div>
            </section>

            {/* ASIGNATURAS DISPONIBLES
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
            {/* <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
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
            </section> */}
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
                    <div className="text-sm text-gray-500">{asig.creditos} ECTS</div>
                    <div className="flex gap-2">
                      {/* <button
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
                        onClick={() => añadirBloque(asig)}
                      >
                        Añadir 1x1
                      </button> */}
                      <button
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded disabled:bg-gray-400"
                        onClick={() => añadirBloque(asig)}
                        disabled={codigosUGRUtilizados.includes(asig.codigo_ugr)}
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

            {/* CREAR BLOQUE PERSONALIZADO 1↔2 */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Crear Bloque Personalizado 1↔2</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-600">Asignatura UGR</label>
                  {/* <select
                    className="input w-full"
                    value={asignaturaUGRSeleccionada?.codigo || ""}
                    onChange={(e) => {
                      const codigo = e.target.value;
                      const seleccionada = asignaturasUGRDisponibles.find((a) => a.codigo === codigo);
                      setAsignaturaUGRSeleccionada(seleccionada);
                    }}
                  >
                    <option value="">-- Selecciona una asignatura UGR --</option>
                    {asignaturasUGRDisponibles.map((a) => (
                      <option key={`${a.codigo}-${a.codigo_grado}`} value={a.codigo}>
                        {a.nombre} ({a.creditos} ECTS)
                      </option>
                    ))}
                  </select> */}
                  <select
                    className="input w-full"
                    value={asignaturaUGRSeleccionada?.codigo || ""}
                    onChange={(e) => {
                      const codigo = e.target.value;
                      const seleccionada = asignaturasUGRDisponibles.find((a) => a.codigo === codigo);
                      setAsignaturaUGRSeleccionada(seleccionada);
                    }}
                  >
                    <option value="">-- Selecciona una asignatura UGR --</option>
                    {asignaturasUGRDisponibles
                      .filter((a) => !usuario.asignaturas_superadas.includes(a.codigo))
                      .map((a) => (
                        <option key={`${a.codigo}-${a.codigo_grado}`} value={a.codigo}>
                          {a.nombre} ({a.creditos} ECTS)
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-600">Asignaturas de destino (hasta 2)</label>
                  <ul className="space-y-1 max-h-48 overflow-y-auto border rounded p-2">
                    {destino?.asignaturas?.map((asig) => {
                      const keyUnico = `${asig.codigo_ugr}-${asig.codigos_grado?.[0] || "sin-grado"}`;
                      const estaSeleccionada = !!seleccionadasDestino.find(
                        (a) => a.codigo_ugr === asig.codigo_ugr && a.codigos_grado?.[0] === asig.codigos_grado?.[0]
                      );

                      return (
                        <li key={keyUnico} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={estaSeleccionada}
                            onChange={() => toggleSeleccionDestino(asig)}
                            disabled={!estaSeleccionada && seleccionadasDestino.length >= 2}
                          />
                          <span>{asig.nombre_destino} ({asig.creditos} ECTS)</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                onClick={crearBloquePersonalizado}
              >
                Añadir bloque personalizado
              </button>
            </section>
            {mensajeValidacion && (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded text-sm">
                {mensajeValidacion}
              </div>
            )}

            {/* BLOQUES AÑADIDOS */}
            <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Asignaturas Seleccionadas</h2>
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
                      const maxFilas = Math.max(
                        bloque.asignaturas_ugr.length,
                        bloque.asignaturas_destino.length
                      );
                      return [...Array(maxFilas)].map((_, j) => {
                        const ugr = bloque.asignaturas_ugr[j] || {};
                        const dest = bloque.asignaturas_destino[j] || {};
                        return (
                          <tr key={`${i}-${j}`}>
                            <td className="px-2 py-1 border">{ugr.nombre || ""}</td>
                            <td className="px-2 py-1 border">{ugr.curso || ""}</td>
                            <td className="px-2 py-1 border">{ugr.semestre || ""}</td>
                            <td className="px-2 py-1 border">{ugr.ects || ""}</td>
                            <td className="px-2 py-1 border">{ugr.tipo || ""}</td>
                            <td className="px-2 py-1 border">{dest.nombre || ""}</td>
                            <td className="px-2 py-1 border">{dest.curso || ""}</td>
                            <td className="px-2 py-1 border">{dest.semestre || ""}</td>
                            <td className="px-2 py-1 border">{dest.ects || ""}</td>
                            {j === 0 ? (
                              <td className="px-2 py-1 border text-center" rowSpan={maxFilas}>
                                <button
                                  onClick={() => eliminarBloque(i)}
                                  className="text-red-500 hover:underline text-xs"
                                >
                                  ❌ Eliminar
                                </button>
                              </td>
                            ) : (
                              <td className="px-2 py-1 border"></td>
                            )}
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan="3" className="px-2 py-2 border text-right">TOTAL CRÉDITOS</td>
                      <td className="px-2 py-2 border text-center">
                        {bloques.reduce((acc, b) =>
                          acc + b.asignaturas_ugr.reduce((sum, a) => sum + (a.ects || 0), 0), 0)}
                      </td>
                      <td className="px-2 py-2 border"></td>
                      <td colSpan="3" className="px-2 py-2 border text-right">TOTAL CRÉDITOS</td>
                      <td className="px-2 py-2 border text-center">
                        {bloques.reduce((acc, b) =>
                          acc + b.asignaturas_destino.reduce((sum, a) => sum + (a.ects || 0), 0), 0)}
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
