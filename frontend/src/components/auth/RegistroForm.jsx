import React, { useState } from 'react';

export default function RegistroForm({
  form,
  actualizarCampo,
  rol,
  grados,
  centros,
  onBack,
  onRegister,
  mensaje,
  tipoMensaje
}) {
  const [gradoSeleccionado, setGradoSeleccionado] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-black" style={{ fontFamily: "Inter, sans-serif" }}>
          Registro como {rol}
        </h1>
      </div>

      <form onSubmit={onRegister} className="space-y-6">
        {/* Nombre y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={actualizarCampo}
              placeholder="Escribe tu nombre"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">Apellidos</label>
            <input
              name="apellidos"
              value={form.apellidos}
              onChange={actualizarCampo}
              placeholder="Escribe tus apellidos"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Email y Contraseña */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={actualizarCampo}
              placeholder="Escribe tu correo UGR"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              name="contraseña"
              type="password"
              value={form.contraseña}
              onChange={actualizarCampo}
              placeholder="Escribe tu contraseña"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Campo Grado (solo estudiante) */}
        {rol === "estudiante" && (
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">Grado</label>
            <select
              name="codigo_grado"
              value={form.codigo_grado}
              onChange={(e) => {
                const codigo = e.target.value;
                const gradoSeleccionado = grados.find(g => g.codigo === codigo);
                if (gradoSeleccionado) {
                  actualizarCampo({ target: { name: "codigo_grado", value: gradoSeleccionado.codigo } });
                  actualizarCampo({ target: { name: "grado", value: gradoSeleccionado.nombre } });
                  actualizarCampo({ target: { name: "codigo_centro", value: gradoSeleccionado.codigo_centro } });
                  setGradoSeleccionado(true);
                } else {
                  setGradoSeleccionado(false);
                }
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
              required
            >
              <option value="">Selecciona tu grado</option>
              {grados.map((g) => (
                <option key={g.codigo} value={g.codigo}>{g.nombre}</option>
              ))}
            </select>

            {!gradoSeleccionado && (
              <p className="mt-2 text-sm text-red-500">Selecciona un grado válido</p>
            )}
          </div>
        )}

        {/* Campo Centro (solo tutor) */}
        {rol === "tutor" && (
          <>
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">Centro</label>
              <select
                name="codigo_centro"
                value={form.codigo_centro}
                onChange={actualizarCampo}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Selecciona tu centro</option>
                {centros.map((c) => (
                  <option key={c.codigo} value={c.codigo}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">Código de validación</label>
              <input
                name="codigo_tutor"
                value={form.codigo_tutor}
                onChange={actualizarCampo}
                placeholder="Escribe el código de validación"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </>
        )}

        {/* Botón y mensaje */}
        <div className="space-y-2">
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Registrarse
          </button>

          {mensaje && (
            <p className={`text-sm text-center ${
              tipoMensaje === "exito" ? "text-green-600" : "text-red-600"
            }`}>
              {mensaje}
            </p>
          )}
        </div>
      </form>

      {/* Enlace para volver */}
      <div className="text-center mt-6">
        <p className="text-base text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={onBack}
            className="text-red-500 hover:text-red-700 font-semibold hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
