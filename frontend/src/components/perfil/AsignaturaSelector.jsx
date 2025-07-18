import { useState } from "react";

export default function AsignaturaSelector({ asignaturas, seleccionadas, onChange }) {
  const [busqueda, setBusqueda] = useState("");

  const coloresCurso = {
    1: "bg-yellow-200",
    2: "bg-blue-200",
    3: "bg-pink-200",
    4: "bg-green-200"
  };


  const normalizar = (texto) =>
    texto
      ?.normalize("NFD")               // separa letras de sus tildes
      .replace(/[\u0300-\u036f]/g, "") // elimina las tildes
      .toLowerCase();

  const toggle = (codigo) => {
    const nuevas = seleccionadas.includes(codigo)
      ? seleccionadas.filter(c => c !== codigo)
      : [...seleccionadas, codigo];
    onChange(nuevas);
  };


  const filtrar = busqueda.trim()
    ? asignaturas.filter(a =>
        normalizar(a.nombre).includes(normalizar(busqueda))
      )
    : [];

  const porCurso = [1, 2, 3, 4].map(curso => ({
    curso,
    asignaturas: filtrar.filter(a => a.curso === curso)
  }));

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar asignatura..."
        className="w-full border px-3 py-2 rounded"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {filtrar.length === 0 && busqueda.trim() !== "" && (
        <p className="text-sm text-gray-500">No se encontraron asignaturas.</p>
      )}
      {filtrar.length > 0 && porCurso.map(({ curso, asignaturas }) => (
        <div key={curso} className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-600">Curso {curso}</h3>
          <div className="flex flex-wrap gap-2">
            {asignaturas.map(asig => (
              <button
                key={asig.codigo}
                type="button"
                className={`px-3 py-1 text-sm rounded-full transition ${
                  seleccionadas.includes(asig.codigo)
                    ? "bg-red-600 text-white"
                    : `${coloresCurso[curso] || "bg-gray-100"} text-black`
                }`}
                onClick={() => toggle(asig.codigo)}
              >
                {asig.nombre}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
