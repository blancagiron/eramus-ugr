import React from 'react';
import logo from '../../assets/logo-tfg-final-v2.svg';

export default function LoginForm({ form, actualizarCampo, onLogin, cambiarModo, mensaje, tipoMensaje }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8">
      {/* Logo y título */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <img
            src={logo}
            alt="Erasmus UGR Logo"
            className="h-32 w-auto"
          />
        </div>
        <h1 className="text-2xl font-semibold text-black" style={{ fontFamily: "Inter, sans-serif" }}>
          ¡Hola de nuevo!
        </h1>
      </div>

      <form onSubmit={onLogin} className="space-y-6">
        {/* Campo Email */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={actualizarCampo}
            placeholder="Escribe tu correo"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Campo Contraseña */}
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            name="contraseña"
            type="password"
            value={form.contraseña}
            onChange={actualizarCampo}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Botón y mensaje */}
        <div className="space-y-2">
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Enviar
          </button>

          {mensaje && (
            <p className={`text-sm text-center ${tipoMensaje === "exito" ? "text-green-600" : "text-red-600"
              }`}>
              {mensaje}
            </p>
          )}
        </div>
      </form>

      {/* Enlace de registro */}
      <div className="text-center mt-6">
        <p className="text-base text-gray-600">
          ¿Es tu primera vez?{" "}
          <button
            type="button"
            onClick={() => cambiarModo("seleccionar-rol")}
            className="text-red-500 hover:text-red-700 font-semibold hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>
      <div className="text-center mt-3">
        <button
          type="button"
          onClick={() => cambiarModo("olvido")}
          className="text-red-500 hover:text-red-700 font-semibold hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}
