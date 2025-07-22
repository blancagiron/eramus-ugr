import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Usa Lucide o cambia por íconos propios

export default function QuestionCard({ pregunta, respuesta }) {
  const [abierta, setAbierta] = useState(false);

  return (
    <div
      onClick={() => setAbierta(!abierta)}
      className={`cursor-pointer transition-all duration-300 rounded-xl p-5 shadow-sm flex justify-between items-start gap-4 ${
        abierta
          ? "bg-red-100 border-red-600"
          : "bg-white border-red-400 hover:bg-red-50"
      }`}
      style={{ borderWidth: "2px" }}
    >
      <div className="flex-1">
        <h3
          className={`font-semibold text-l ${
            abierta ? "text-red-700" : "text-red-600"
          }`}
        >
          {pregunta}
        </h3>
        {abierta && (
          <p className="mt-3 text-gray-800 leading-relaxed">{respuesta}</p>
        )}
      </div>
      <div className="pt-1">
        {abierta ? (
          <ChevronUp className="text-red-700" />
        ) : (
          <ChevronDown className="text-red-700" />
        )}
      </div>
    </div>
  );
}
