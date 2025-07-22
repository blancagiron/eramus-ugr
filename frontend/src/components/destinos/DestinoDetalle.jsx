import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import { ExternalLink } from "lucide-react";

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

  if (!destino) return <p className="p-8">Cargando destino...</p>;

  const imagenes = [
    `https://source.unsplash.com/1200x400/?university,${destino.pais}`,
    `https://source.unsplash.com/600x400/?campus,${destino.nombre_uni}`,
    `https://source.unsplash.com/600x400/?students,${destino.nombre_uni}`,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        titulo={destino.nombre_uni}
        subtitulo={`${destino.pais}`}
      />

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6 pb-20">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/destinos")}
          className="text-sm text-red-600 hover:underline mb-6"
        >
          ← Volver a destinos
        </button>

        {/* Galería estilo mockup */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="md:col-span-2">
            <img
              src={imagenes[0]}
              alt="Imagen principal"
              className="rounded-2xl w-full h-72 md:h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <img
              src={imagenes[1]}
              alt="Imagen secundaria 1"
              className="rounded-2xl w-full h-36 object-cover"
            />
            <img
              src={imagenes[2]}
              alt="Imagen secundaria 2"
              className="rounded-2xl w-full h-36 object-cover"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 text-lg font-medium text-black mb-6">
          {["universidad", "asignaturas", "experiencias"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 transition-colors duration-200 relative capitalize ${
                tab === t
                  ? "text-red-700 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-red-700"
                  : "hover:text-red-700"
              }`}
            >
              {t === "universidad"
                ? "Universidad"
                : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* TAB: Universidad */}
        {tab === "universidad" && (
          <div className="space-y-10 text-gray-700">
            {/* Sobre la universidad */}
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-red-600"></span>
                Sobre la universidad
              </h2>
              <p className="text-sm">{destino.descripcion_uni || "Sin descripción."}</p>
              {destino.web && (
                <a
                  href={destino.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline inline-flex items-center gap-1 mt-2"
                >
                  Sitio web oficial <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Requisitos y contacto */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Requisitos */}
              <div className="bg-red-100 p-4 rounded-2xl">
                <h3 className="text-md font-semibold flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  Requisitos
                </h3>
                <ul className="text-sm list-disc pl-4 space-y-1">
                  <li>Plazas disponibles: {destino.plazas}</li>
                  <li>Duración: {destino.meses} meses</li>
                  <li>Idioma requerido: {destino.requisitos_idioma}</li>
                </ul>
              </div>

              {/* Contacto */}
              <div className="bg-red-100 p-4 rounded-2xl">
                <h3 className="text-md font-semibold flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  Información de contacto
                </h3>
                <p className="text-sm">
                  <strong>Email:</strong> {destino.info_contacto?.email || "No disponible"}
                  <br />
                  <strong>Teléfono:</strong> {destino.info_contacto?.telefono || "No disponible"}
                </p>
              </div>
            </div>

            {/* Ciudad */}
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-red-600"></span>
                Sobre la ciudad
              </h2>
              <p className="text-sm">
                {destino.descripcion_ciudad || "Sin información sobre la ciudad."}
              </p>
            </div>

            {/* Mapa */}
            {destino.lat && destino.lng && (
              <div className="rounded-xl overflow-hidden shadow mt-6">
                <iframe
                  title="Mapa"
                  src={`https://maps.google.com/maps?q=${destino.lat},${destino.lng}&z=15&output=embed`}
                  className="rounded-xl w-full h-64 border"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {/* TAB: Asignaturas */}
        {tab === "asignaturas" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {destino.asignaturas.map((a, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl shadow border hover:shadow-md"
              >
                <h3 className="font-bold text-gray-800">{a.nombre}</h3>
                <p className="text-gray-600">Créditos: {a.creditos}</p>
                <p className="text-gray-500 text-xs">Código: {a.codigo}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Experiencias */}
        {tab === "experiencias" && (
          <div className="text-gray-500 italic mt-6">
            Aún no hay experiencias registradas en esta universidad.
          </div>
        )}
      </div>
    </div>
  );
}
