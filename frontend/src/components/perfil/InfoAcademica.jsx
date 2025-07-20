import { GraduationCap, School, BookOpen, Mail, CircleCheck } from "lucide-react";

export default function InfoAcademica({ perfil, form, nombreCentro }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3" style={{ fontFamily: "Inter, sans-serif" }}>
        <GraduationCap className="w-6 h-6 text-red-500" />
        Información académica
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
            <School className="w-4 h-4" />
            Centro
          </label>
          <input
            value={nombreCentro}
            disabled
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
            <BookOpen className="w-4 h-4" />
            Grado
          </label>
          <input
            value={perfil.grado}
            disabled
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            value={perfil.email}
            disabled
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-l font-medium text-gray-700 mb-2">
            <CircleCheck className="w-4 h-4" />
            Créditos superados
          </label>
          <input
            value={form.creditos_superados}
            disabled
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}