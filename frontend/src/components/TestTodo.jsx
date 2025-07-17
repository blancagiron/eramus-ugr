import React from "react";

export default function TestTodo() {
  const probarDestinos = async () => {
    const destino = {
      nombre_uni: "Politecnico di Torino",
      pais: "Italia",
      requisitos_idioma: "B2 inglés",
      plazas: 3,
      asignaturas: [
        { codigo: "SE-TOR", nombre: "Software Engineering", creditos: 6 },
        { codigo: "DS-TOR", nombre: "Distributed Systems", creditos: 6 }
      ]
    };

    const res = await fetch("http://localhost:5000/api/destinos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(destino)
    });

    const data = await res.json();
    alert("Destino → " + (data.id ? "creado ✅" : data.message || data.error));
  };

  const verDestinos = async () => {
    const res = await fetch("http://localhost:5000/api/destinos");
    const data = await res.json();
    alert(`Se encontraron ${data.length} destinos`);
  };

  const probarEquivalencia = async () => {
    const equivalencia = {
      grado: "Grado en Ingeniería Informática",
      universidad_destino: "Politecnico di Torino",
      asignatura_destino: {
        nombre: "Software Engineering",
        creditos: 6,
        codigo: "SE-TOR"
      },
      asignaturas_ugr: [
        {
          codigo: "IS-015",
          nombre: "Ingeniería del Software",
          creditos: 6
        }
      ],
      tipo_reconocimiento: "individual"
    };

    const res = await fetch("http://localhost:5000/api/equivalencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equivalencia)
    });

    const data = await res.json();
    alert("Equivalencia → " + (data.id ? "creada ✅" : data.message || data.error));
  };

  const verEquivalencias = async () => {
    const res = await fetch(
      "http://localhost:5000/api/equivalencias?grado=Grado en Ingeniería Informática&universidad=Politecnico di Torino"
    );
    const data = await res.json();
    alert(`Se encontraron ${data.length} equivalencias`);
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-red-700">🔍 Test de destinos y equivalencias</h2>
      <button onClick={probarDestinos} className="bg-red-600 text-white px-4 py-2 rounded">Crear destino</button>
      <button onClick={verDestinos} className="bg-red-500 text-white px-4 py-2 rounded">Ver destinos</button>
      <button onClick={probarEquivalencia} className="bg-red-600 text-white px-4 py-2 rounded">Crear equivalencia</button>
      <button onClick={verEquivalencias} className="bg-red-500 text-white px-4 py-2 rounded">Ver equivalencias</button>
    </div>
  );
}
