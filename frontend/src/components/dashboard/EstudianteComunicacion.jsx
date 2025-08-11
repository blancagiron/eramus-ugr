import { useEffect, useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import Hamburguesa from "../dashboard/Hamburguesa";
import DashboardHeader from "../dashboard/DashboardHeader";
import { 
  MessageSquareText, 
  Send, 
  FileDown, 
  CheckCircle2, 
  Loader2,
  User,
  Clock,
  MessageCircle,
  FileText,
  BadgeCheck,
  ClipboardList,
  Building2,
  CreditCard,
  ExternalLink
} from "lucide-react";

export default function EstudianteComunicacion() {
  const [user, setUser] = useState(null);
  const [acuerdo, setAcuerdo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) {
      setLoading(false);
      return;
    }
    const u = JSON.parse(raw);
    setUser(u);
    fetch(`http://localhost:5000/api/acuerdos/${u.email}/ultima`)
      .then(r => r.ok ? r.json() : null)
      .then(setAcuerdo)
      .finally(() => setLoading(false));
  }, []);

  const estado = acuerdo?.estado || "sin_acuerdo";
  const puedeEnviar = ["borrador", "cambios_solicitados"].includes(estado);

  const EstadoBadge = ({ estadoActual }) => {
    const configs = {
      enviado: {
        bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
        icon: <FileText className="w-4 h-4" />, label: "Enviado"
      },
      cambios_solicitados: {
        bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200",
        icon: <ClipboardList className="w-4 h-4" />, label: "Cambios solicitados"
      },
      aprobado: {
        bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200",
        icon: <BadgeCheck className="w-4 h-4" />, label: "Aprobado"
      },
      borrador: {
        bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200",
        icon: <FileText className="w-4 h-4" />, label: "Borrador"
      },
      sin_acuerdo: {
        bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200",
        icon: <FileText className="w-4 h-4" />, label: "Sin acuerdo"
      }
    };
    const config = configs[estadoActual] || configs.sin_acuerdo;
    return (
      <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  const enviar = async () => {
    if (!user?.email) return;
    setMsg("");
    await fetch(`http://localhost:5000/api/acuerdos/${user.email}/enviar`, { method: "POST" })
      .then(r => r.json())
      .then(async () => {
        setMsg("Acuerdo enviado al tutor para revisión.");
        const doc = await fetch(`http://localhost:5000/api/acuerdos/${user.email}/ultima`).then(r => r.json());
        setAcuerdo(doc);
      })
      .catch(() => setMsg("No se pudo enviar. Intenta de nuevo."));
  };

  const descargarPDF = () => {
    if (!user?.email) return;
    window.open(`http://localhost:5000/api/acuerdos/${user.email}/exportar`, "_blank");
  };

  if (loading) {
    return (
      <>
        <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
        <Sidebar visible={sidebarVisible}>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
              <span className="text-lg font-medium">Cargando comunicación...</span>
            </div>
          </div>
        </Sidebar>
      </>
    );
  }

  if (!acuerdo) {
    return (
      <>
        <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
        <Sidebar visible={sidebarVisible}>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6">
            <div className="text-center bg-white rounded-2xl border border-gray-200 shadow-md p-8 max-w-lg">
              <div className="p-4 bg-red-100 rounded-xl mb-4 inline-block">
                <MessageSquareText className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 font-['Inter',system-ui,sans-serif]">
                No hay acuerdo disponible
              </h2>
              <p className="text-gray-600">
                No tienes un acuerdo guardado todavía. Crea uno primero para poder comunicarte con tu tutor.
              </p>
            </div>
          </div>
        </Sidebar>
      </>
    );
  }

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <DashboardHeader
            titulo="Comunicación con el Tutor"
            subtitulo="Envía tu acuerdo a revisión, consulta el estado y revisa los comentarios"
            rightSlot={<EstadoBadge estadoActual={estado} />}
          />

          {/* Contenido principal */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Panel de acciones */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1 font-['Inter',system-ui,sans-serif]">
                    Acciones disponibles
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {estado === "aprobado" 
                      ? "Tu acuerdo ha sido aprobado. Puedes descargar el PDF oficial."
                      : puedeEnviar 
                      ? "Puedes enviar tu acuerdo al tutor para revisión."
                      : "Tu acuerdo está en revisión. Espera comentarios del tutor."
                    }
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {estado === "aprobado" && (
                    <button 
                      onClick={descargarPDF} 
                      className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      <FileDown className="w-5 h-5" />
                      Descargar PDF
                    </button>
                  )}
                  {puedeEnviar && (
                    <button 
                      onClick={enviar} 
                      className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                      Enviar a revisión
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mensaje de feedback */}
            {msg && (
              <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <p className="text-blue-800 font-medium">{msg}</p>
                </div>
              </div>
            )}

            {/* Comentario global del tutor */}
            {acuerdo.comentarios_tutor ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 font-['Inter',system-ui,sans-serif]">
                    Comentario General del Tutor
                  </h2>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {acuerdo.comentarios_tutor}
                  </p>
                </div>
              </div>
            ) : (
              estado === "enviado" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 font-['Inter',system-ui,sans-serif]">
                        En espera de revisión
                      </h2>
                      <p className="text-amber-700 mt-1">
                        Tu acuerdo está enviado. El tutor aún no ha dejado comentarios.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Comentarios por bloque */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-['Inter',system-ui,sans-serif]">
                  Comentarios por Bloque
                </h2>
              </div>

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
                          <h4 className="font-bold text-gray-900 font-['Inter',system-ui,sans-serif]">Bloque {i + 1}</h4>
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
                          <h5 className="font-bold text-gray-900 font-['Inter',system-ui,sans-serif]">Universidad de Granada</h5>
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
                          <h5 className="font-bold text-gray-900 font-['Inter',system-ui,sans-serif]">Universidad de Destino</h5>
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

                    {/* Comentario del tutor */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Comentarios específicos para el Bloque {i + 1}</span>
                      </div>
                      {bloque.comentario_tutor ? (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {bloque.comentario_tutor}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex items-center gap-2 text-gray-500">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">Sin comentarios específicos para este bloque.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje si no hay bloques */}
              {(!acuerdo.bloques || acuerdo.bloques.length === 0) && (
                <div className="text-center py-8">
                  <div className="p-4 bg-gray-100 rounded-xl mb-4 inline-block">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No hay bloques de asignaturas en este acuerdo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}