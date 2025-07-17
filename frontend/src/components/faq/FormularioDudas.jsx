import React, { useState } from "react";
import logo from '../../assets/logo-tfg-final-v2.svg';

export default function FormularioDuda() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    mensaje: "",
  });

  const [estado, setEstado] = useState({ enviando: false, error: "", exito: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ enviando: true, error: "", exito: "" });

    if (!form.nombre || !form.apellidos || !form.email || !form.mensaje) {
      setEstado({
        enviando: false,
        error: "Todos los campos son obligatorios.",
        exito: "",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/dudas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar el mensaje.");
      }

      setEstado({
        enviando: false,
        error: "",
        exito: "Tu consulta ha sido enviada correctamente.",
      });
      setForm({ nombre: "", apellidos: "", email: "", mensaje: "" });
    } catch (err) {
      setEstado({
        enviando: false,
        error: err.message || "Error inesperado al enviar el mensaje.",
        exito: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-10">
        {/* Logo y título */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={logo} 
              alt="Erasmus UGR Logo" 
              className="h-32 w-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
            ¿Tienes alguna duda?
          </h1>
          <p className="text-gray-500 text-lg">
            Contacta con nosotros y te ayudaremos
          </p>
        </div>

        <div className="space-y-7">
          {/* Nombre y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-3">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Tus apellidos"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-3">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
              required
            />
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-3">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              rows="4"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Describe tu duda o consulta..."
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base resize-none"
              required
            ></textarea>
          </div>

          {/* Botón Enviar */}
          <button 
            type="submit"
            disabled={estado.enviando}
            onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 text-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {estado.enviando ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </div>
            ) : (
              "Enviar"
            )}
          </button>
        </div>

        {/* Mensajes de estado */}
        {estado.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-600 text-sm font-medium">{estado.error}</p>
            </div>
          </div>
        )}

        {estado.exito && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-600 text-sm font-medium">{estado.exito}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}