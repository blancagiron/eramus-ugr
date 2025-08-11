// src/dashboard/TutorRevisarAcuerdo.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "../dashboard/DashboardHeader";
import Hamburguesa from "../dashboard/Hamburguesa";

import {
  GraduationCap,
  CheckCircle2,
  Reply,
  Loader2,
  ExternalLink,
  FileText,
  BadgeCheck,
  ClipboardList,
  User,
  MapPin,
  Calendar,
  Mail,
  Building2,
  Hash,
  CreditCard,
  MessageSquare
} from "lucide-react";

export default function TutorRevisarAcuerdo() {
  const { email } = useParams(); // email del estudiante
  const [acuerdo, setAcuerdo] = useState(null);
  const [globalComment, setGlobalComment] = useState("");
  const [bloqueComments, setBloqueComments] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/acuerdos/${email}/ultima`)
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (!doc) return;
        setAcuerdo(doc);
        // precarga de comentario global y por bloque
        setGlobalComment(doc?.comentarios_tutor || "");
        const mapping = {};
        (doc?.bloques || []).forEach((b, i) => (mapping[i] = b.comentario_tutor || ""));
        setBloqueComments(mapping);
      });
  }, [email]);

  const updateBloqueComment = (i, v) =>
    setBloqueComments((prev) => ({ ...prev, [i]: v }));

  const pedirCambios = async () => {
    setSaving(true);
    setMsg("");
    const payload = {
      comentarios_tutor: globalComment,
      bloques: Object.entries(bloqueComments).map(([index, comentario]) => ({
        index: Number(index),
        comentario,
      })),
    };
    await fetch(`http://localhost:5000/api/acuerdos/${email}/pedir-cambios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => setMsg("Has solicitado cambios al estudiante."))
      .finally(() => setSaving(false));
  };

  const aprobar = async () => {
    setSaving(true);
    setMsg("");
    await fetch(`http://localhost:5000/api/acuerdos/${email}/aprobar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comentarios_tutor: globalComment }),
    })
      .then((r) => r.json())
      .then(() => setMsg("Acuerdo aprobado correctamente."))
      .finally(() => setSaving(false));
  };

  const totalUGR = useMemo(
    () =>
      (acuerdo?.bloques || []).reduce(
        (acc, b) =>
          acc +
          (b.asignaturas_ugr || []).reduce((s, a) => s + (Number(a.ects) || 0), 0),
        0
      ),
    [acuerdo]
  );
  
  const totalDest = useMemo(
    () =>
      (acuerdo?.bloques || []).reduce(
        (acc, b) =>
          acc +
          (b.asignaturas_destino || []).reduce(
            (s, a) => s + (Number(a.ects) || 0),
            0
          ),
        0
      ),
    [acuerdo]
  );

  const EstadoBadge = ({ estado }) => {
    const configs = {
      borrador: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: <FileText className="w-4 h-4" />,
        label: "Borrador"
      },
      enviado: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: <FileText className="w-4 h-4" />,
        label: "Enviado"
      },
      comentado: {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        icon: <ClipboardList className="w-4 h-4" />,
        label: "Cambios solicitados"
      },
      aprobado: {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200",
        icon: <BadgeCheck className="w-4 h-4" />,
        label: "Aprobado"
      }
    };
    const config = configs[estado] || configs.borrador;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  if (!acuerdo)
    return (
      <>
        <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
        <Sidebar visible={sidebarVisible}>
          <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
              <span className="text-lg font-medium">Cargando acuerdo...</span>
            </div>
          </div>
        </Sidebar>
      </>
    );

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen bg-gray-50 ">
          <DashboardHeader
            titulo={`Revisar acuerdo — ${email}`}
            subtitulo={
              <div className="flex items-center gap-3">
                <EstadoBadge estado={acuerdo?.estado} />
              </div>
            }
          />

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Mensaje de estado */}
            {msg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <p className="text-emerald-800 font-medium">{msg}</p>
                </div>
              </div>
            )}

            {/* Tarjetas de información */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Datos de Movilidad */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <Building2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>Datos de Movilidad</h2>
                </div>
                
                <div className="space-y-4">
                  <Campo label="Universidad" icon={<Building2 className="w-5 h-5 text-gray-400 mt-0.5" />} value={acuerdo?.datos_movilidad?.nombre_universidad} />
                  <Campo label="Código" icon={<Hash className="w-5 h-5 text-gray-400 mt-0.5" />} value={acuerdo?.datos_movilidad?.codigo_universidad} />
                  <Campo label="País" icon={<MapPin className="w-5 h-5 text-gray-400 mt-0.5" />} value={acuerdo?.datos_movilidad?.pais} />
                  <Campo label="Periodo" icon={<Calendar className="w-5 h-5 text-gray-400 mt-0.5" />} value={acuerdo?.datos_movilidad?.periodo_estudios} />
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tutor asignado</p>
                        <p className="font-semibold text-gray-900">{acuerdo?.datos_movilidad?.tutor || "—"}</p>
                        <p className="text-sm text-gray-600">{acuerdo?.datos_movilidad?.email_tutor || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos Personales */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>Datos del Estudiante</h2>
                </div>
                
                <div className="space-y-4">
                  <Campo
                    label="Nombre completo"
                    icon={<User className="w-5 h-5 text-gray-400 mt-0.5" />}
                    value={`${acuerdo?.datos_personales?.nombre || ""} ${acuerdo?.datos_personales?.primer_apellido || ""} ${acuerdo?.datos_personales?.segundo_apellido || ""}`.trim() || "—"}
                  />
                  <Campo label="Email" icon={<Mail className="w-5 h-5 text-gray-400 mt-0.5" />} value={acuerdo?.datos_personales?.email} />
                  <Campo label="Titulación" icon={<GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />} value={acuerdo?.datos_personales?.grado} />
                  <Campo label="DNI/NIF" icon={<Hash className="w-5 h-5 text-gray-400 mt-0.5" />} value={acuerdo?.datos_personales?.dni} />
                </div>
              </div>
            </div>

            {/* Comentario global */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>Comentario General</h3>
              </div>
              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl  resize-none transition-colors placeholder-gray-400 text-gray-900"
                rows="4"
                value={globalComment}
                onChange={(e) => setGlobalComment(e.target.value)}
                placeholder="Escribe comentarios generales sobre el acuerdo de estudios..."
              />
            </div>

            {/* Detalle del acuerdo */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "Inter, sans-serif" }}> Detalle del Acuerdo por Bloques</h3>

              <div className="space-y-8">
                {(acuerdo.bloques || []).map((bloque, i) => (
                  <div key={i} className="border border-gray-200 rounded-2xl p-6">
                    {/* Header del bloque */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">{i + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>Bloque {i + 1}</h4>
                          {bloque.optatividad && (
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full mt-1">
                              Optatividad
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Grid de asignaturas */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                      {/* UGR */}
                      <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                        <div className="flex items-center gap-2 mb-4">
                          <h5 className="font-bold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>Universidad de Granada</h5>
                        </div>
                        
                        <div className="space-y-4">
                          {(bloque.asignaturas_ugr || []).map((asignatura, k) => (
                            <div key={k} className="bg-white rounded-lg p-4 border border-red-100">
                              <div className="flex items-start justify-between mb-2">
                                <h6 className="font-semibold text-gray-900 leading-snug">
                                  {asignatura.nombre}
                                </h6>
                                <div className="flex items-center gap-1 ml-3">
                                 
                                  <span className="font-bold text-red-600 text-sm">{asignatura.ects} ECTS</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {asignatura.tipo && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                    {asignatura.tipo}
                                  </span>
                                )}
                                {asignatura.curso && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {asignatura.curso}
                                  </span>
                                )}
                                {asignatura.semestre && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                    {asignatura.semestre} Semestre
                                  </span>
                                )}
                              </div>
                              
                              {asignatura.guia && (
                                <a
                                  href={asignatura.guia}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Ver guía docente
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Destino */}
                      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center gap-2 mb-4">
                    
                          <h5 className="font-bold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>Universidad de Destino</h5>
                        </div>
                        
                        <div className="space-y-4">
                          {(bloque.asignaturas_destino || []).map((asignatura, k) => (
                            <div key={k} className="bg-white rounded-lg p-4 border border-blue-100">
                              <div className="flex items-start justify-between mb-2">
                                <h6 className="font-semibold text-gray-900 leading-snug">
                                  {asignatura.nombre}
                                  {asignatura.propuesta && (
                                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                      Propuesta
                                    </span>
                                  )}
                                </h6>
                                <div className="flex items-center gap-1 ml-3">
                                
                                  <span className="font-bold text-blue-600 text-sm">{asignatura.ects} ECTS</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {asignatura.curso && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {asignatura.curso}
                                  </span>
                                )}
                                {asignatura.semestre && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                    {asignatura.semestre} Semestre
                                  </span>
                                )}
                              </div>
                              
                              {asignatura.guia && (
                                <a
                                  href={asignatura.guia}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Ver guía docente
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Comentario del bloque */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentarios específicos para el Bloque {i + 1}
                      </label>
                      <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl  resize-none transition-colors placeholder-gray-400 text-gray-900"
                        rows="3"
                        value={bloqueComments[i] || ""}
                        onChange={(e) => updateBloqueComment(i, e.target.value)}
                        placeholder="Comentarios específicos para este bloque..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de créditos */}
              <div className="grid sm:grid-cols-2 gap-4 mt-8 mb-8">
                <ResumenCard
                  title="Total UGR"
                  value={`${totalUGR} ECTS`}
                  icon={<CreditCard className="w-5 h-5 text-red-600" />}
                  bg="bg-red-50"
                  border="border-red-200"
                />
                <ResumenCard
                  title="Total Destino"
                  value={`${totalDest} ECTS`}
                  icon={<Building2 className="w-5 h-5 text-blue-600" />}
                  bg="bg-blue-50"
                  border="border-blue-200"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={pedirCambios}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Reply className="w-5 h-5" />
                  )}
                  Solicitar Cambios
                </button>
                
                <button
                  onClick={aprobar}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  Aprobar Acuerdo
                </button>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}

function Campo({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value || "—"}</p>
      </div>
    </div>
  );
}

function ResumenCard({ title, value, icon, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-xl p-6`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 ${bg.replace('50','100')} rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
