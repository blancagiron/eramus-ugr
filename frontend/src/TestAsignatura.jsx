import { useState, useEffect } from "react";

export default function TestAsignaturaSearch() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/asignaturas")
      .then(res => res.json())
      .then(data => {
        console.log("ASIGNATURAS:", data);
        setAsignaturas(data);
      })
      .catch(err => console.error("Error al cargar asignaturas:", err));
  }, []);

  const resultados = asignaturas.filter(a =>
    a?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Buscar asignaturas</h2>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded mb-4"
        placeholder="Buscar por nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <ul className="space-y-2">
        {resultados.map((a, i) => (
          <li key={i} className="bg-gray-100 px-3 py-2 rounded">
            <strong>{a.nombre}</strong> — Código: {a.codigo} — Créditos: {a.creditos}
          </li>
        ))}
      </ul>

      {resultados.length === 0 && <p className="text-gray-500">No hay resultados.</p>}
    </div>
  );
}
