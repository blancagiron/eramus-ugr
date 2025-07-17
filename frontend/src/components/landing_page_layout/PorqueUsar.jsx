import React from 'react';
import { MapPin, FileCheck, MessageCircle, Eye, FileText, Filter } from 'lucide-react';

export default function PorqueUsar() {
  const razones = [
    {
      icon: MapPin,
      texto: "Accede a destinos validados"
    },
    {
      icon: FileCheck,
      texto: "Convalidaciones simplificadas"
    },
    {
      icon: MessageCircle,
      texto: "Contacto directo con tu tutor"
    },
    {
      icon: Eye,
      texto: "Visualiza experiencias reales"
    },
    {
      icon: FileText,
      texto: "Documentación automática"
    },
    {
      icon: Filter,
      texto: "Filtros avanzados por asignatura"
    }
  ];

  return (
    <section className="bg-[#c42a2a] py-24 px-6 text-center" >
      <h2
        className="text-3xl md:text-4xl font-semibold text-stone-100 mb-20"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        ¿Por qué usar nuestra plataforma?
      </h2>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {razones.map((razon, index) => (
          <div
            key={index}
            className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105"
          >
            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <razon.icon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Text */}
            <p className="text-white font-medium text-lg leading-relaxed">
              {razon.texto}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button */}

    </section>
  );
}