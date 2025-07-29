import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import { ExternalLink, ArrowLeft, MapPin, Clock, Users, Globe } from "lucide-react";

export default function DestinoDetalle() {
  const { nombre_uni } = useParams();
  const navigate = useNavigate();
  const [destino, setDestino] = useState(null);
  const [tab, setTab] = useState("universidad");

  useEffect(() => {
    fetch("http://localhost:5000/api/destinos")
      .then((res) => res.json())
      .then((data) => {
        const match = data.find(
          (d) =>
            d.nombre_uni.toLowerCase() ===
            decodeURIComponent(nombre_uni).toLowerCase()
        );
        setDestino(match);
      });
  }, [nombre_uni]);

  if (!destino) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando destino...</p>
        </div>
      </div>
    );
  }

  const imagenes = [
    destino.imagenes?.principal || `https://source.unsplash.com/1200x400/?university,${destino.pais}`,
    destino.imagenes?.secundarias?.[0] || `https://source.unsplash.com/600x400/?campus,${destino.nombre_uni}`,
    destino.imagenes?.secundarias?.[1] || `https://source.unsplash.com/600x400/?students,${destino.nombre_uni}`,
  ];

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: "Inter, sans-serif" }}>
      <DashboardHeader
        titulo={destino.nombre_uni}
        subtitulo={`${destino.pais}`}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-24">
        {/* Botón volver mejorado */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/destinos")}
            className="inline-flex items-center gap-3 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-red-300 rounded-xl text-gray-700 hover:text-red-600 transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Volver a destinos</span>
          </button>
        </div>

        {/* Galería mejorada */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={imagenes[0]}
                alt="Imagen principal"
                className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-3xl shadow-lg">
              <img
                src={imagenes[1]}
                alt="Imagen secundaria 1"
                className="w-full h-44 object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-lg">
              <img
                src={imagenes[2]}
                alt="Imagen secundaria 2"
                className="w-full h-44 object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            </div>
          </div>
        </div>

        {/* Tabs mejorados */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-6 text-lg md:text-xl font-medium text-black" style={{ fontFamily: "Inter, sans-serif" }}>
            {[
              { key: "universidad", label: "Universidad" },
              { key: "asignaturas", label: "Asignaturas" },
              { key: "experiencias", label: "Experiencias" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`pb-2 transition-colors duration-200 relative capitalize ${tab === key
                  ? "text-red-700 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-red-700"
                  : "hover:text-red-700"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="h-[1px] bg-gray-300 mt-3" />
        </div>

        {/* TAB: Universidad */}
        {tab === "universidad" && (
          <div className="space-y-12 text-gray-700">
            {/* Hero section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Sobre la universidad
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                    {destino.descripcion_uni || "Sin descripción disponible."}
                  </p>
                  {destino.web && (
                    <a
                      href={destino.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      <span>Sitio web oficial</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Información práctica */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Requisitos */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 shadow-lg border border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Requisitos
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700">
                      <strong>Plazas:</strong> {destino.plazas}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700">
                      <strong>Duración:</strong> {destino.meses} meses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700">
                      <strong>Idioma:</strong> {destino.requisitos_idioma}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Información de contacto
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Email:</strong><br />
                    <span className="text-blue-600">{destino.info_contacto?.email || "No disponible"}</span>
                  </p>
                  <p className="text-gray-700">
                    <strong>Teléfono:</strong><br />
                    <span className="text-blue-600">{destino.info_contacto?.telefono || "No disponible"}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Ciudad */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Sobre la ciudad
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {destino.descripcion_ciudad || "Sin información sobre la ciudad disponible."}
                  </p>
                </div>
              </div>
            </div>

            {/* Mapa */}
            {destino.lat && destino.lng && (
              <div className="bg-white rounded-3xl p-2 shadow-lg border border-gray-100">
                <iframe
                  title="Mapa"
                  src={`https://maps.google.com/maps?q=${destino.lat},${destino.lng}&z=15&output=embed`}
                  className="rounded-2xl w-full h-80 border-0"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {/* TAB: Asignaturas */}
        {tab === "asignaturas" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destino.asignaturas.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg italic">
                  No hay asignaturas registradas para este destino.
                </p>
              </div>
            ) : (
              destino.asignaturas.map((a, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                >
                  {/* Línea roja decorativa */}
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-red-500 rounded-r-md"></div>

                  {/* Título: nombre en destino */}
                  <h3 className="font-bold text-gray-900 mb-3 text-lg border-b-2 border-red-200 pb-1">
                    {a.nombre_destino}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 text-sm">
                      <strong className="text-red-700">Asignatura UGR:</strong><br />
                      <span className="text-gray-800">{a.nombre_ugr}</span>
                    </p>
                    <p className="text-gray-600">
                      <strong className="text-red-700">Créditos:</strong>{" "}
                      <span className="text-gray-800">{a.creditos}</span>
                    </p>
                    {a.semestre && (
                      <p className="text-gray-600">
                        <strong className="text-red-700">Semestre:</strong>{" "}
                        <span className="text-gray-800">{a.semestre}</span>
                      </p>
                    )}
                  </div>

                  {a.ultimo_anio_reconocimiento && (
                    <p className="text-gray-500 text-sm italic mb-3">
                      Último año de reconocimiento: {a.ultimo_anio_reconocimiento}
                    </p>
                  )}

                  {a.guia && (
                    <a
                      href={a.guia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200"
                    >
                      <span>Ver guía</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}


        {/* TAB: Experiencias */}
        {tab === "experiencias" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg italic">
              Aún no hay experiencias registradas en esta universidad.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}