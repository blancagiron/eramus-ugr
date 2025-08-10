import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, Layers, Download, Info, HelpCircle, X, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../dashboard/Sidebar";
import Hamburguesa from "../dashboard/Hamburguesa";
import InfoModal from "./InfoModal";

// ---- UI helpers ----
const btn = {
  primary:
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
  secondary:
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300",
  danger:
    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  ghost:
    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm  bg-green-600 text-white border hover:bg-green-700",
};

function SectionCard({ title, subtitle, help, children }) {
  return (
    <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
      {help && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-900 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5" />
          <div>{help}</div>
        </div>
      )}
    </section>
  );
}

function InlineNotice({ type="info", children }) {
  const isSuccess = type === "success";
  const isError = type === "error";
  const classes = isSuccess
    ? "bg-green-50 border-green-300 text-green-800"
    : isError
    ? "bg-red-50 border-red-300 text-red-800"
    : "bg-yellow-50 border-yellow-300 text-yellow-800";
  const Icon = isSuccess ? CheckCircle2 : isError ? AlertTriangle : Info;
  return (
    <div className={`mt-3 p-3 border rounded text-sm flex items-start gap-2 ${classes}`}>
      <Icon className="w-4 h-4 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

export default function AcuerdoEditor() {
  const [usuario, setUsuario] = useState(null);
  const [acuerdo, setAcuerdo] = useState(null);
  const [versiones, setVersiones] = useState([]);
  const [indiceVersionSeleccionada, setIndiceVersionSeleccionada] = useState(0);

  const [destino, setDestino] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [datosPersonales, setDatosPersonales] = useState({});
  const [datosMovilidad, setDatosMovilidad] = useState({});
  const [cargando, setCargando] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  // Mensajes
  const [mensajeValidacion, setMensajeValidacion] = useState(""); // por secciones (duplicados, etc)
  const [versionMsg, setVersionMsg] = useState({ type: "", text: "" }); // zona de versiones/guardado

  const [nombreTutorDocente, setNombreTutorDocente] = useState("");

  // Bloque personalizado (hasta 3 por lado) - EXISTENTES
  const [asignaturasUGRDisponibles, setAsignaturasUGRDisponibles] = useState([]);
  const [seleccionUGR, setSeleccionUGR] = useState([]);        // array de códigos (UGR)
  const [seleccionDestino, setSeleccionDestino] = useState([]); // array de objetos destino
  const [optPersonalizado, setOptPersonalizado] = useState(false);

  // Sección APARTE: Propuestas (lado destino nuevo) con mapeo a UGR (n×m)
  const [propUGR, setPropUGR] = useState([]); // codigos ugr (máx 3) para propuesta
  const [propDestinos, setPropDestinos] = useState([]); // sólo destinos propuestos (máx 3)
  const [propOpt, setPropOpt] = useState(false);
  const navigate = useNavigate();

  // cargar usuario + datos
  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;
    const localUser = JSON.parse(raw);

    fetch(`http://localhost:5000/usuarios/${localUser.email}`)
      .then((res) => res.json())
      .then((user) => {
        setUsuario(user);
        localStorage.setItem("usuario", JSON.stringify(user));

        // versiones
        fetch(`http://localhost:5000/api/acuerdos/${user.email}`)
          .then((res) => (res.status === 404 ? [] : res.json()))
          .then((lista) => {
            setVersiones(lista || []);
            if (lista?.length > 0) {
              const ultima = lista[0];
              setIndiceVersionSeleccionada(0);
              setAcuerdo(ultima);
              setBloques(ultima.bloques || []);
              setDatosPersonales(ultima.datos_personales || {});
              setDatosMovilidad(ultima.datos_movilidad || {});
            }
          });

        // asignaturas del grado
        fetch("http://localhost:5000/api/asignaturas")
          .then((res) => res.json())
          .then((lista) => {
            if (user?.codigo_grado) {
              const delGrado = lista.filter((a) => a.codigo_grado === user.codigo_grado);
              setAsignaturasUGRDisponibles(delGrado);
            }
          });

        // destino
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
                      setDatosMovilidad((prev) => ({ ...prev, email_tutor: tutor.email }));
                    }
                  })
                  .catch(() => {});
              }
            })
            .finally(() => setCargando(false));
        } else {
          setCargando(false);
        }
      });
  }, []);

  useEffect(() => {
    if (mensajeValidacion) {
      const t = setTimeout(() => setMensajeValidacion(""), 3200);
      return () => clearTimeout(t);
    }
  }, [mensajeValidacion]);

  useEffect(() => {
    if (versionMsg.text) {
      const t = setTimeout(() => setVersionMsg({ type: "", text: "" }), 3000);
      return () => clearTimeout(t);
    }
  }, [versionMsg]);

  // ===== Helpers y duplicados =====
  const claveDestino = (asig) => `${asig?.codigo_ugr || ""}-${asig?.codigos_grado?.[0] || "sin-grado"}`;

  const codigosUGRUsados = useMemo(
    () =>
      new Set(
        (bloques || []).flatMap((b) => (b.asignaturas_ugr || []).map((a) => a?.codigo).filter(Boolean))
      ),
    [bloques]
  );

  const clavesDestinoUsadas = useMemo(
    () =>
      new Set(
        (bloques || []).flatMap((b) => (b.asignaturas_destino || []).map((a) => a?.codigo_mapeo_destino || "").filter(Boolean))
      ),
    [bloques]
  );

  // ===== selección múltiple UGR (hasta 3) — si Optatividad ON, deshabilitamos la selección
  const toggleUGR = (codigoUGR) => {
    if (optPersonalizado) return;
    if (codigosUGRUsados.has(codigoUGR) && !seleccionUGR.includes(codigoUGR)) {
      setMensajeValidacion("Esa asignatura UGR ya está utilizada en otro bloque.");
      return;
    }
    setSeleccionUGR((prev) => {
      if (prev.includes(codigoUGR)) return prev.filter((c) => c !== codigoUGR);
      if (prev.length >= 3) {
        setMensajeValidacion("Máximo 3 asignaturas UGR por bloque.");
        return prev;
      }
      return [...prev, codigoUGR];
    });
  };

  // ===== selección múltiple destino (hasta 3) sin duplicar global y por bloque =====
  const toggleDestino = (asig) => {
    const k = claveDestino(asig);
    if (clavesDestinoUsadas.has(k) && !seleccionDestino.find((x) => claveDestino(x) === k)) {
      setMensajeValidacion("Esa asignatura de destino ya está usada en otro bloque.");
      return;
    }
    setSeleccionDestino((prev) => {
      const ya = prev.find((x) => claveDestino(x) === k);
      if (ya) return prev.filter((x) => claveDestino(x) !== k);
      if (prev.length >= 3) {
        setMensajeValidacion("Máximo 3 asignaturas de destino por bloque.");
        return prev;
      }
      return [...prev, asig];
    });
  };

  // ===== construir bloque personalizado (n×m) — sólo destinos EXISTENTES aquí
  const crearBloquePersonalizado = () => {
    const destinosExistentes = seleccionDestino.map((a) => ({
      codigo_mapeo_destino: claveDestino(a),
      codigo: a.codigo || a.codigo_ugr || "",
      nombre: a.nombre_destino,
      ects: a.creditos,
      guia: a.guia || "",
      semestre: a.semestre || "",
      curso: a.curso || "",
    }));

    if (destinosExistentes.length === 0) {
      setMensajeValidacion("Selecciona al menos 1 asignatura de destino.");
      return;
    }
    // Validaciones de duplicados globales de destino
    for (const d of destinosExistentes) {
      if (clavesDestinoUsadas.has(d.codigo_mapeo_destino)) {
        setMensajeValidacion("Alguna asignatura de destino ya está en otro bloque.");
        return;
      }
    }

    let ugrs = [];
    if (!optPersonalizado) {
      if (seleccionUGR.length === 0) {
        setMensajeValidacion("Selecciona al menos 1 asignatura UGR o activa 'Optatividad'.");
        return;
      }
      ugrs = seleccionUGR.map((codigo) => {
        const a = asignaturasUGRDisponibles.find((x) => x.codigo === codigo);
        return {
          codigo: a?.codigo || "",
          nombre: a?.nombre || "Asignatura UGR",
          ects: a?.creditos || 0,
          guia: a?.enlace || "",
          semestre: a?.semestre || "",
          tipo: a?.tipo || "OB",
          curso: a?.curso || "",
        };
      });
      for (const c of ugrs.map((u) => u.codigo)) {
        if (codigosUGRUsados.has(c)) {
          setMensajeValidacion("Alguna UGR seleccionada ya está en otro bloque.");
          return;
        }
      }
    } else {
      const totalECTSSeleccionDest = destinosExistentes.reduce((s, d) => s + (d.ects || 0), 0);
      ugrs = [
        {
          codigo: "",
          nombre: "Optatividad",
          ects: totalECTSSeleccionDest,
          guia: "",
          semestre: "",
          tipo: "OPT",
          curso: "",
        },
      ];
    }

    const bloque = {
      asignaturas_ugr: ugrs,
      asignaturas_destino: destinosExistentes,
      tipo: "bloque",
      optatividad: optPersonalizado,
    };

    setBloques((prev) => [...prev, bloque]);
    setSeleccionUGR([]);
    setSeleccionDestino([]);
    setOptPersonalizado(false);
    setVersionMsg({ type: "success", text: "Bloque añadido." });
  };

  // ===== Sección APARTE: Propuestas n×m mapeadas a UGR =====
  const togglePropUGR = (codigoUGR) => {
    if (propOpt) return;
    if (codigosUGRUsados.has(codigoUGR) && !propUGR.includes(codigoUGR)) {
      setVersionMsg({ type: "error", text: "Esa UGR ya está en otro bloque." });
      return;
    }
    setPropUGR((prev) => {
      if (prev.includes(codigoUGR)) return prev.filter((c) => c !== codigoUGR);
      if (prev.length >= 3) {
        setVersionMsg({ type: "error", text: "Máximo 3 UGR por propuesta." });
        return prev;
      }
      return [...prev, codigoUGR];
    });
  };

  const addPropuesto = () => {
    if (propDestinos.length >= 3) {
      setVersionMsg({ type: "error", text: "Máximo 3 destinos propuestos por bloque." });
      return;
    }
    setPropDestinos((p) => [...p, { nombre: "", ects: "", guia: "", semestre: "", curso: "" }]);
  };
  const removePropuesto = (idx) => setPropDestinos((p) => p.filter((_, i) => i !== idx));
  const updatePropuesto = (idx, field, val) =>
    setPropDestinos((p) => p.map((x, i) => (i === idx ? { ...x, [field]: val } : x)));

  const crearPropuestaBloque = () => {
    if (propDestinos.length === 0) {
      setVersionMsg({ type: "error", text: "Añade al menos 1 destino propuesto." });
      return;
    }
    const destinosPropuestos = propDestinos.map((p) => ({
      codigo_mapeo_destino: `propuesta-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      codigo: "",
      nombre: (p.nombre || "").trim(),
      ects: Number(p.ects) || 0,
      guia: (p.guia || "").trim(),
      semestre: p.semestre || "",
      curso: p.curso || "",
      propuesta: true,
      estado_propuesta: "pendiente_revision",
    }));
    if (!propOpt && propUGR.length === 0) {
      setVersionMsg({ type: "error", text: "Selecciona al menos 1 UGR o activa Optatividad." });
      return;
    }
    let ugrs = [];
    if (!propOpt) {
      ugrs = propUGR.map((codigo) => {
        const a = asignaturasUGRDisponibles.find((x) => x.codigo === codigo);
        return {
          codigo: a?.codigo || "",
          nombre: a?.nombre || "Asignatura UGR",
          ects: a?.creditos || 0,
          guia: a?.enlace || "",
          semestre: a?.semestre || "",
          tipo: a?.tipo || "OB",
          curso: a?.curso || "",
        };
      });
      for (const c of ugrs.map((u) => u.codigo)) {
        if (codigosUGRUsados.has(c)) {
          setVersionMsg({ type: "error", text: "Alguna UGR ya está en otro bloque." });
          return;
        }
      }
    } else {
      const ectsSum = destinosPropuestos.reduce((s, d) => s + (d.ects || 0), 0);
      ugrs = [
        {
          codigo: "",
          nombre: "Optatividad",
          ects: ectsSum,
          guia: "",
          semestre: "",
          tipo: "OPT",
          curso: "",
        },
      ];
    }

    const bloque = {
      asignaturas_ugr: ugrs,
      asignaturas_destino: destinosPropuestos,
      tipo: "bloque",
      optatividad: propOpt,
    };

    setBloques((prev) => [...prev, bloque]);
    // limpiar
    setPropUGR([]);
    setPropDestinos([]);
    setPropOpt(false);
    setVersionMsg({ type: "success", text: "Propuesta añadida como bloque (pendiente de revisión)." });
  };

  const eliminarBloque = (index) => {
    const nuevos = [...bloques];
    nuevos.splice(index, 1);
    setBloques(nuevos);
    setVersionMsg({ type: "success", text: "Bloque eliminado." });
  };

  const exportarPDF = () => {
    if (!usuario?.email) return;
    window.open(`http://localhost:5000/api/acuerdos/${usuario.email}/exportar`, "_blank");
  };

  // ===== Guardado / actualización =====
  const construirPayload = (estado = "borrador") => ({
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
      tutor: nombreTutorDocente || "",
      email_tutor: destino?.tutor_asignado || "",
    },
    bloques,
    estado,
  });

  const actualizarAcuerdo = async (estado = "borrador") => {
    if (!acuerdo?.version) {
      setVersionMsg({ type: "error", text: "No se ha cargado la versión actual." });
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/acuerdos/${usuario.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(construirPayload(estado)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al guardar.");
      setVersionMsg({ type: "success", text: data.msg || "Acuerdo actualizado." });
      await recargarVersiones();
    } catch (err) {
      setVersionMsg({ type: "error", text: err.message });
    }
  };

  const guardarAcuerdo = async (estado = "borrador", nuevaVersion = false) => {
    try {
      const endpoint =
        nuevaVersion || !acuerdo?.version
          ? "http://localhost:5000/api/acuerdos"
          : `http://localhost:5000/api/acuerdos/${usuario.email}`;
      const method = nuevaVersion || !acuerdo?.version ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(construirPayload(estado)),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al guardar.");
      setVersionMsg({ type: "success", text: data.msg || (nuevaVersion ? "Nueva versión guardada." : "Cambios guardados.") });
      await recargarVersiones();
    } catch (err) {
      setVersionMsg({ type: "error", text: err.message });
    }
  };

  const borrarVersion = async () => {
    const v = versiones[indiceVersionSeleccionada];
    if (!v?.version) {
      setVersionMsg({ type: "error", text: "No hay versión seleccionada." });
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/acuerdos/${encodeURIComponent(usuario.email)}/versiones/${v.version}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al eliminar.");
      setVersionMsg({ type: "success", text: data.msg || `v${v.version} eliminada.` });
      await recargarVersiones();
    } catch (e) {
      setVersionMsg({ type: "error", text: e.message });
    }
  };

  const recargarVersiones = async () => {
    if (!usuario?.email) return;
    const res = await fetch(`http://localhost:5000/api/acuerdos/${usuario.email}`);
    if (res.status === 404) {
      setVersiones([]);
      setAcuerdo(null);
      setBloques([]);
      return;
    }
    const lista = await res.json();
    setVersiones(lista || []);
    if (lista?.length > 0) {
      setIndiceVersionSeleccionada(0);
      setAcuerdo(lista[0]);
      setBloques(lista[0].bloques || []);
      setDatosPersonales(lista[0].datos_personales || {});
      setDatosMovilidad(lista[0].datos_movilidad || {});
    } else {
      setAcuerdo(null);
      setBloques([]);
    }
  };

  // ===== Cargar versión seleccionada =====
  const onCambiarVersion = (idx) => {
    setIndiceVersionSeleccionada(idx);
    const elegido = versiones[idx];
    if (elegido) {
      setAcuerdo(elegido);
      setBloques(elegido.bloques || []);
      setDatosPersonales(elegido.datos_personales || {});
      setDatosMovilidad(elegido.datos_movilidad || {});
    }
  };

  // ===== Totales =====
  const totalECTSUGR = useMemo(
    () =>
      (bloques || []).reduce(
        (acc, b) => acc + (b.asignaturas_ugr || []).reduce((sum, a) => sum + (a.ects || 0), 0),
        0
      ),
    [bloques]
  );

  const totalECTSDest = useMemo(
    () =>
      (bloques || []).reduce(
        (acc, b) => acc + (b.asignaturas_destino || []).reduce((sum, a) => sum + (a.ects || 0), 0),
        0
      ),
    [bloques]
  );

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

          {/* Barra superior con ayuda y versiones */}
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => setMostrarInfo(true)}
              className="inline-flex items-center gap-2 text-sm text-blue-700 underline"
            >
              <HelpCircle className="w-4 h-4" />
              ¿Necesitas ayuda para rellenar tu acuerdo?
            </button>

            {versiones.length > 0 && (
              <div className="ml-auto flex flex-col gap-2 items-stretch">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Versión:</label>
                  <select
                    className="input"
                    value={indiceVersionSeleccionada}
                    onChange={(e) => onCambiarVersion(parseInt(e.target.value, 10))}
                  >
                    {versiones.map((v, idx) => (
                      <option key={v.version || idx} value={idx}>
                        {`v${v.version ?? (versiones.length - idx)}${v.estado ? ` · ${v.estado}` : ""}`}
                      </option>
                    ))}
                  </select>

                  <button className={btn.danger} onClick={borrarVersion} title="Eliminar versión">
                    <Trash2 className="w-4 h-4" />
                    Eliminar versión
                  </button>

                  <button
                    onClick={() => guardarAcuerdo("borrador", true)}
                    className={btn.primary}
                    title="Guardar como nueva versión"
                  >
                    <Layers className="w-4 h-4" />
                    Nueva versión
                  </button>
                  <button
                    onClick={() => actualizarAcuerdo("borrador")}
                    className={btn.secondary}
                    title="Guardar cambios en esta versión"
                  >
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </button>
                </div>

                {versionMsg.text && (
                  <InlineNotice type={versionMsg.type}>
                    {versionMsg.text}
                  </InlineNotice>
                )}
              </div>
            )}
          </div>

          <InfoModal open={mostrarInfo} onClose={() => setMostrarInfo(false)} />

          <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
            {/* DATOS PERSONALES */}
            <SectionCard
              title="Datos Personales"
              subtitle="Estos datos se rellenan automáticamente desde tu perfil. Solo debes añadir tu DNI."
              help="La información personal debe coincidir con la que figure en tu expediente. Si detectas algún error, actualízalo en tu perfil antes de exportar el PDF."
            >
              <div className="grid grid-cols-2 gap-4">
                <input className="input" disabled value={usuario.nombre || ""} />
                <input className="input" disabled value={usuario.primer_apellido || ""} />
                <input className="input" disabled value={usuario.segundo_apellido || ""} />
                <input className="input" disabled value={usuario.email || ""} />
                <input className="input" disabled value={usuario.grado || ""} />
                <input
                  className="input"
                  placeholder="DNI / NIF"
                  value={datosPersonales.dni || ""}
                  onChange={(e) => setDatosPersonales({ ...datosPersonales, dni: e.target.value })}
                />
              </div>
            </SectionCard>

            {/* DATOS MOVILIDAD */}
            <SectionCard
              title="Datos de Movilidad"
              subtitle="Introduce información relevante de tu estancia y del personal académico responsable."
              help="El 'Responsable académico' puede diferir del 'Tutor docente'. Si el tutor no aparece, es probable que aún no esté asignado por tu centro."
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="Curso académico"
                  value={datosMovilidad.curso_academico || ""}
                  onChange={(e) => setDatosMovilidad({ ...datosMovilidad, curso_academico: e.target.value })}
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
                  onChange={(e) => setDatosMovilidad({ ...datosMovilidad, periodo_estudios: e.target.value })}
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
                <input className="input" disabled value={nombreTutorDocente || "Tutor todavía no asignado"} />
                <input className="input" disabled value={destino?.tutor_asignado || "Tutor todavía no asignado"} />
              </div>
            </SectionCard>

            {/* ASIGNATURAS DISPONIBLES (rápidos 1x1 / OPT) */}
            <SectionCard
              title={`Asignaturas en ${destino?.nombre_uni || ""}`}
              subtitle="Lista de asignaturas reconocidas previamente en tu titulación."
              help="Si la asignatura no aparece, usa la sección de 'Propuestas de equivalencia' para crear un bloque con destino nuevo."
            >
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destino?.asignaturas?.map((asig, idx) => {
                  const k = claveDestino(asig);
                  const disabled1x1 = codigosUGRUsados.has(asig.codigo_ugr) || clavesDestinoUsadas.has(k);
                  return (
                    <li key={idx} className="p-4 border rounded-lg shadow-sm space-y-2">
                      <div className="font-medium">{asig.nombre_destino}</div>
                      <div className="text-sm text-gray-500">{asig.creditos} ECTS</div>
                      <div className="flex gap-2 flex-wrap">
                        {/* 1x1 normal */}
                        <button
                          className={btn.primary}
                          onClick={() => {
                            const codigoUGR = asig.codigo_ugr;
                            if (codigosUGRUsados.has(codigoUGR) || clavesDestinoUsadas.has(k)) {
                              setMensajeValidacion("UGR o destino ya está en otro bloque.");
                              return;
                            }
                            const a = asignaturasUGRDisponibles.find(
                              (x) => x.codigo === codigoUGR && asig.codigos_grado?.includes(x.codigo_grado)
                            );
                            setBloques((prev) => [
                              ...prev,
                              {
                                asignaturas_ugr: [
                                  {
                                    codigo: codigoUGR,
                                    nombre: a?.nombre || asig.nombre_ugr || "Asignatura UGR",
                                    ects: a?.creditos || asig.creditos || 0,
                                    guia: a?.enlace || "",
                                    semestre: a?.semestre || "",
                                    tipo: a?.tipo || "OB",
                                    curso: a?.curso || asig.curso || "",
                                  },
                                ],
                                asignaturas_destino: [
                                  {
                                    codigo_mapeo_destino: k,
                                    codigo: asig.codigo || asig.codigo_ugr || "",
                                    nombre: asig.nombre_destino,
                                    ects: asig.creditos,
                                    guia: asig.guia || "",
                                    semestre: asig.semestre || "",
                                    curso: asig.curso || "",
                                  },
                                ],
                                tipo: "bloque",
                                optatividad: false,
                              },
                            ]);
                            setVersionMsg({ type: "success", text: "Bloque 1×1 añadido." });
                          }}
                          disabled={disabled1x1}
                          title={disabled1x1 ? "UGR o destino ya usado" : "Añadir 1×1"}
                        >
                          <Plus className="w-4 h-4" />
                          Añadir 1×1
                        </button>

                        {/* 1x1 como OPTATIVIDAD */}
                        <button
                          className={btn.ghost}
                          onClick={() => {
                            if (clavesDestinoUsadas.has(k)) {
                              setMensajeValidacion("Esa asignatura de destino ya está en otro bloque.");
                              return;
                            }
                            setBloques((prev) => [
                              ...prev,
                              {
                                asignaturas_ugr: [
                                  {
                                    codigo: "",
                                    nombre: "Optatividad",
                                    ects: asig.creditos,
                                    guia: "",
                                    semestre: "",
                                    tipo: "OPT",
                                    curso: "",
                                  },
                                ],
                                asignaturas_destino: [
                                  {
                                    codigo_mapeo_destino: k,
                                    codigo: asig.codigo || asig.codigo_ugr || "",
                                    nombre: asig.nombre_destino,
                                    ects: asig.creditos,
                                    guia: asig.guia || "",
                                    semestre: asig.semestre || "",
                                    curso: asig.curso || "",
                                  },
                                ],
                                tipo: "bloque",
                                optatividad: true,
                              },
                            ]);
                            setVersionMsg({ type: "success", text: "Bloque (Optatividad) añadido." });
                          }}
                          disabled={clavesDestinoUsadas.has(k)}
                          title={clavesDestinoUsadas.has(k) ? "Destino ya usado" : "Añadir como Optatividad"}
                        >
                          <Sparkles className="w-4 h-4" />
                          Añadir como Optatividad
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionCard>

            {/* BLOQUE PERSONALIZADO n×m (existentes) */}
            <SectionCard
              title="Crear Bloque Personalizado (1×2, 2×1, hasta 3×3)"
              help="No puedes reutilizar una misma asignatura (UGR o destino) en más de un bloque. Selecciona hasta 3 por cada lado. Activa 'Optatividad' si quieres que los créditos del destino cuenten como optativos en UGR."
            >
              <div className="flex items-center gap-3 mb-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={optPersonalizado}
                    onChange={(e) => {
                      setOptPersonalizado(e.target.checked);
                      if (e.target.checked) setSeleccionUGR([]); // limpiar UGR al activar OPT
                    }}
                  />
                  Contabilizar como Optatividad (UGR)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UGR */}
                <div>
                  <label className="block text-sm mb-1 text-gray-600">
                    Asignaturas UGR (máx 3){optPersonalizado ? " · desactivado por Optatividad" : ""}
                  </label>
                  <div className={`border rounded p-2 max-h-56 overflow-y-auto space-y-1 ${optPersonalizado ? "opacity-50 pointer-events-none" : ""}`}>
                    {asignaturasUGRDisponibles
                      .filter((a) => !usuario.asignaturas_superadas.includes(a.codigo))
                      .map((a) => {
                        const disabled = codigosUGRUsados.has(a.codigo) && !seleccionUGR.includes(a.codigo);
                        return (
                          <label key={`${a.codigo}-${a.codigo_grado}`} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={seleccionUGR.includes(a.codigo)}
                              onChange={() => toggleUGR(a.codigo)}
                              disabled={disabled || optPersonalizado}
                            />
                            <span className={disabled ? "text-gray-400" : ""}>
                              {a.nombre} ({a.creditos} ECTS){disabled ? " · ya usada" : ""}
                            </span>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {/* Destino existentes */}
                <div>
                  <label className="block text-sm mb-1 text-gray-600">Asignaturas destino (máx 3)</label>
                  <div className="border rounded p-2 max-h-56 overflow-y-auto space-y-1">
                    {destino?.asignaturas?.map((asig) => {
                      const k = claveDestino(asig);
                      const yaSel = !!seleccionDestino.find((x) => claveDestino(x) === k);
                      const disabled = (!yaSel && seleccionDestino.length >= 3) || (clavesDestinoUsadas.has(k) && !yaSel);
                      return (
                        <label key={k} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={yaSel}
                            onChange={() => toggleDestino(asig)}
                            disabled={disabled}
                          />
                          <span className={disabled && !yaSel ? "text-gray-400" : ""}>
                            {asig.nombre_destino} ({asig.creditos} ECTS)
                            {clavesDestinoUsadas.has(k) && !yaSel ? " · ya usada" : ""}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button className={btn.primary} onClick={crearBloquePersonalizado}>
                  <Plus className="w-4 h-4" />
                  Añadir bloque personalizado
                </button>
              </div>

              {mensajeValidacion && (
                <InlineNotice>{mensajeValidacion}</InlineNotice>
              )}
            </SectionCard>

            {/* SECCIÓN APARTE: PROPUESTAS DE EQUIVALENCIA (bloques con destino nuevo) */}
            <SectionCard
              title="Propuestas de equivalencia (bloque con destino nuevo)"
              subtitle="Crea un bloque n×m indicando UGR(s) y asignaturas de destino nuevas."
              help="Las propuestas quedan con estado 'pendiente de revisión' y se imprimirán como parte del acuerdo. Puedes usar Optatividad si procede."
            >
              <div className="flex items-center gap-3 mb-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={propOpt}
                    onChange={(e) => {
                      setPropOpt(e.target.checked);
                      if (e.target.checked) setPropUGR([]);
                    }}
                  />
                  Contabilizar como Optatividad (UGR)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UGR para propuesta */}
                <div>
                  <label className="block text-sm mb-1 text-gray-600">
                    Asignaturas UGR (máx 3){propOpt ? " · desactivado por Optatividad" : ""}
                  </label>
                  <div className={`border rounded p-2 max-h-56 overflow-y-auto space-y-1 ${propOpt ? "opacity-50 pointer-events-none" : ""}`}>
                    {asignaturasUGRDisponibles
                      .filter((a) => !usuario.asignaturas_superadas.includes(a.codigo))
                      .map((a) => {
                        const disabled = codigosUGRUsados.has(a.codigo) && !propUGR.includes(a.codigo);
                        return (
                          <label key={`prop-${a.codigo}-${a.codigo_grado}`} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={propUGR.includes(a.codigo)}
                              onChange={() => togglePropUGR(a.codigo)}
                              disabled={disabled || propOpt}
                            />
                            <span className={disabled ? "text-gray-400" : ""}>
                              {a.nombre} ({a.creditos} ECTS){disabled ? " · ya usada" : ""}
                            </span>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {/* Destinos propuestos */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm mb-1 text-gray-600">Asignaturas destino propuestas (máx 3)</label>
                    <button className={btn.ghost} onClick={addPropuesto}>
                      <Plus className="w-4 h-4" />
                      Añadir propuesta
                    </button>
                  </div>

                  <div className="space-y-3">
                    {propDestinos.map((p, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border rounded p-2">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                          <input
                            className="input w-full"
                            value={p.nombre}
                            onChange={(e) => updatePropuesto(idx, "nombre", e.target.value)}
                            placeholder="Ej. Computer Vision"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">ECTS</label>
                          <input
                            type="number"
                            min="0"
                            className="input w-full"
                            value={p.ects}
                            onChange={(e) => updatePropuesto(idx, "ects", e.target.value)}
                            placeholder="6"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Guía docente (URL)</label>
                          <input
                            className="input w-full"
                            value={p.guia}
                            onChange={(e) => updatePropuesto(idx, "guia", e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Semestre</label>
                          <input
                            className="input w-full"
                            value={p.semestre}
                            onChange={(e) => updatePropuesto(idx, "semestre", e.target.value)}
                            placeholder="1º / 2º / anual"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Curso</label>
                          <input
                            className="input w-full"
                            value={p.curso}
                            onChange={(e) => updatePropuesto(idx, "curso", e.target.value)}
                            placeholder="3º"
                          />
                        </div>
                        <div className="md:col-span-6">
                          <button className={btn.danger} onClick={() => removePropuesto(idx)}>
                            <Trash2 className="w-4 h-4" />
                            Quitar propuesta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button className={btn.primary} onClick={crearPropuestaBloque}>
                  <Plus className="w-4 h-4" />
                  Añadir bloque con propuestas
                </button>
              </div>

              {versionMsg.text && (
                <InlineNotice type={versionMsg.type}>{versionMsg.text}</InlineNotice>
              )}
            </SectionCard>

            {/* BLOQUES AÑADIDOS */}
            <SectionCard
              title="Asignaturas Seleccionadas"
              subtitle="Estas son las asignaturas que has vinculado entre la UGR y la universidad de destino."
              help="Revisa que la suma de créditos sea coherente. Las propuestas nuevas figuran como 'propuesta'."
            >
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
                        (bloque.asignaturas_ugr || []).length,
                        (bloque.asignaturas_destino || []).length
                      );
                      return [...Array(maxFilas)].map((_, j) => {
                        const ugr = bloque.asignaturas_ugr?.[j] || {};
                        const dest = bloque.asignaturas_destino?.[j] || {};
                        return (
                          <tr key={`${i}-${j}`}>
                            <td className="px-2 py-1 border">{ugr.nombre || ""}</td>
                            <td className="px-2 py-1 border">{ugr.curso || ""}</td>
                            <td className="px-2 py-1 border">{ugr.semestre || ""}</td>
                            <td className="px-2 py-1 border">{ugr.ects || ""}</td>
                            <td className="px-2 py-1 border">{ugr.tipo || ""}</td>
                            <td className="px-2 py-1 border">
                              {dest.nombre || ""}
                              {dest.propuesta ? " (propuesta)" : ""}
                            </td>
                            <td className="px-2 py-1 border">{dest.curso || ""}</td>
                            <td className="px-2 py-1 border">{dest.semestre || ""}</td>
                            <td className="px-2 py-1 border">{dest.ects || ""}</td>
                            {j === 0 ? (
                              <td className="px-2 py-1 border text-center" rowSpan={maxFilas}>
                                <button onClick={() => eliminarBloque(i)} className={`${btn.danger} !px-2`}>
                                  <Trash2 className="w-4 h-4" />
                                  Eliminar
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
                      <td className="px-2 py-2 border text-center">{totalECTSUGR}</td>
                      <td className="px-2 py-2 border"></td>
                      <td colSpan="3" className="px-2 py-2 border text-right">TOTAL CRÉDITOS</td>
                      <td className="px-2 py-2 border text-center">{totalECTSDest}</td>
                      <td className="px-2 py-2 border"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </SectionCard>

            {/* Acciones finales */}
            <div className="flex gap-4">
              <button onClick={() => guardarAcuerdo("borrador")} className={btn.secondary}>
                <Save className="w-4 h-4" />
                Guardar cambios
              </button>
              <button onClick={exportarPDF} className={btn.primary}>
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
