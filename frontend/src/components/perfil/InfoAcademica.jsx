import { GraduationCap, School, BookOpen, Mail, CircleCheck, Map } from "lucide-react";

export default function InfoAcademica({ perfil, form, nombreCentro, editando, setForm }) {
  const rol = perfil?.rol;

  const handleCentroChange = (e) => {
    setForm((prev) => ({ ...prev, codigo_centro: e.target.value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-xl">
          <GraduationCap className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
          Información académica
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Centro */}
        <div>
          <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
            <School className="w-4 h-4" />
            Centro
          </label>
          {rol === "estudiante" || !editando ? (
            <input
              value={nombreCentro}
              disabled
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          ) : (
            <input
              value={perfil.codigo_centro}
              onChange={handleCentroChange}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-700"
              placeholder="Código del centro"
            />
          )}
        </div>

        {/* Grado (solo estudiante) */}
        {rol === "estudiante" && (
          <div>
            <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4" />
              Grado
            </label>
            <input
              value={perfil.grado}
              disabled
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            value={perfil.email}
            disabled
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Créditos superados (solo estudiante) */}
        {rol === "estudiante" && (
          <div>
            <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
              <CircleCheck className="w-4 h-4" />
              Créditos superados
            </label>
            <input
              value={form.creditos_superados}
              disabled
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {/* Destinos asignados (tutor/admin) */}
      {(rol === "tutor" || rol === "admin") && (
        <div>
          <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2 mt-4">
            <Map className="w-4 h-4" />
            Destinos asignados
          </label>
          <ul className="list-disc list-inside text-gray-700 text-base pl-2">
            {Array.isArray(perfil.destinos_asignados) && perfil.destinos_asignados.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 text-base pl-2">
                {perfil.destinos_asignados.map((d, i) => (
                  <li key={i}>{d.nombre_uni} ({d.codigo})</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Sin destinos asignados</p>
            )}

          </ul>
        </div>
      )}
    </div>
  );
}
