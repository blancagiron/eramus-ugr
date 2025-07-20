import { GraduationCap, School, BookOpen, Mail, CircleCheck } from "lucide-react";

export default function InfoAcademica({ perfil, form, nombreCentro }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-black flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
        <GraduationCap className="w-6 h-6 text-red-500" />
        Información académica
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <label className="flex items-center gap-2 text-xl font-medium text-gray-600 mb-1">
            <School className="w-5 h-5 text-gray-500" />
            Centro
          </label>
          <input
            value={nombreCentro}
            disabled
            className="w-full bg-gray-100 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xl font-medium text-gray-600 mb-1">
            <BookOpen className="w-5 h-5 text-gray-500" />
            Grado
          </label>
          <input
            value={perfil.grado}
            disabled
            className="w-full bg-gray-100 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xl font-medium text-gray-600 mb-1">
            <Mail className="w-5 h-5 text-gray-500" />
            Email
          </label>
          <input
            value={perfil.email}
            disabled
            className="w-full bg-gray-100 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xl font-medium text-gray-600 mb-1">
            <CircleCheck className="w-5 h-5 text-gray-500" />
            Créditos superados
          </label>
          <input
            value={form.creditos_superados}
            disabled
            className="w-full bg-gray-100 rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
