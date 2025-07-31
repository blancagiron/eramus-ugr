// components/estudiante/InfoModal.jsx
import { X } from "lucide-react";

export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold text-yellow-700 mb-4">
          🧠 ¿Cómo elaborar tu Acuerdo de Estudios?
        </h2>

        <div className="text-sm text-gray-800 space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>Selecciona asignaturas que tengan relación en contenidos, competencias y créditos.</li>
            <li>Puedes hacer bloques 1x1, 2x1, 1x2, 2x2… lo importante es que sean coherentes.</li>
            <li>Asignaturas sin equivalencia pueden ir como <strong>Optatividad</strong>.</li>
            <li><strong>ECTS orientativos:</strong> Máx. 30 por semestre / Máx. 60 por curso.</li>
          </ul>

          <p className="font-medium">¿Y si necesitas modificar tu acuerdo?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Solo se puede modificar <strong>una vez por semestre</strong>.</li>
            <li>El plazo es hasta 1 mes tras el inicio de semestre en destino.</li>
            <li>Solo puedes modificar asignaturas del semestre actual.</li>
            <li>Debes hablar con tu tutor y subir el acuerdo modificado a sede electrónica:</li>
            <li>
              <a
                href="https://sede.ugr.es/procs/Movilidad-internacional-Modificacion-del-acuerdo-de-estudios-Grado/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                sede.ugr.es - Modificación del Acuerdo
              </a>
            </li>
          </ul>

          <div className="bg-yellow-100 p-3 rounded-md text-yellow-800 font-medium mt-4">
             Consejo: Equilibra créditos totales. Se permiten pequeñas diferencias justificadas.
          </div>
        </div>
      </div>
    </div>
  );
}
