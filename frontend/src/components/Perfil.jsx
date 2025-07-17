import { useState, useEffect } from "react";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const email = "blanca@correo.ugr.es"; // más adelante: usar sesión

  useEffect(() => {
    fetch(`http://localhost:5000/api/usuarios/${email}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data));
  }, []);

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">👤 Perfil del usuario</h2>
      <ul className="list-disc ml-6">
        <li>Nombre: {usuario.nombre}</li>
        <li>Grado: {usuario.grado}</li>
        <li>Nivel de idioma: {usuario.nivel_idioma}</li>
        <li>Asignaturas cursadas: {usuario.asignaturas_cursadas.join(", ")}</li>
      </ul>
    </div>
  );
}
