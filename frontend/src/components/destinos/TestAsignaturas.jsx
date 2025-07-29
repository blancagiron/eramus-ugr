import { useEffect, useState } from "react";

export default function TestAsignatura() {
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const codigo = usuario?.codigo_grado;
    if (codigo) {
      fetch(`http://localhost:5000/api/asignaturas?codigo_grado=${codigo}`)
        .then(res => res.json())
        .then(data => {
          console.log("Asignaturas cargadas:", data);
          setAsignaturas(data);
        });
    }
  }, []);

  return (
    <div>
      <h2>Asignaturas cargadas</h2>
      <ul>
        {asignaturas.map((a) => (
          <li key={a.codigo}>{a.nombre} ({a.codigo})</li>
        ))}
      </ul>
    </div>
  );
}
