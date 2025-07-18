export default function InfoAcademica({ perfil, form, nombreCentro }) {
    return (
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-blue-700">Información académica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <label className="block text-gray-500 mb-1">Centro</label>
            <input value={nombreCentro} disabled className="w-full bg-gray-100 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Grado</label>
            <input value={perfil.grado} disabled className="w-full bg-gray-100 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            <input value={perfil.email} disabled className="w-full bg-gray-100 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Créditos superados</label>
            <input value={form.creditos_superados} disabled className="w-full bg-gray-100 rounded px-3 py-2" />
          </div>
        </div>
      </div>
    );
  }
  