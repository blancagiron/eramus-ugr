import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AcuerdoTutor() {
  const { email } = useParams();
  const [acuerdo, setAcuerdo] = useState(null);
  const [comentarios, setComentarios] = useState("");
  const [bloques, setBloques] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/acuerdos/${email}/ultima`)
      .then((res) => res.json())
      .then((data) => {
        setAcuerdo(data);
        setBloques(data.bloques || []);
        setComentarios(data.comentarios_tutor || "");
      });
  }, [email]);

  const guardarComentarios = async () => {
    const payload = {
      comentarios_tutor: comentarios,
      estado: "comentado",
      bloques: bloques.map((b, index) => ({
        index,
        comentario: b.comentario_tutor || ""
      }))
    };

    try {
      const res = await fetch(`http://localhost:5000/api/acuerdos/${email}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(data.msg || "Comentarios guardados");
    } catch (err) {
      alert("Error al guardar comentarios: " + err.message);
    }
  };

  const aceptarAcuerdo = async () => {
    const res = await fetch(`http://localhost:5000/api/acuerdos/${email}/comentario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comentarios_tutor: comentarios, estado: "aceptado" })
    });
    const data = await res.json();
    alert(data.msg || "Acuerdo aceptado");
  };

  if (!acuerdo) return <div className="p-10">Cargando acuerdo...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Acuerdo de {email}</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold">Comentarios globales</h2>
        <textarea
          className="w-full p-2 mt-2 border rounded"
          rows="3"
          placeholder="Comentarios generales para el acuerdo"
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
        ></textarea>
      </div>

      <div className="space-y-4">
        {bloques.map((b, i) => (
          <div key={i} className="bg-white p-4 border rounded-lg">
            <h3 className="font-semibold mb-1">Bloque {i + 1} - Tipo: {b.tipo} {b.optatividad && '(Optatividad)'}</h3>

            <div className="text-sm text-gray-600">
              <strong>UGR:</strong> {b.asignaturas_ugr?.map(a => a.nombre).join(', ')}<br />
              <strong>Destino:</strong> {b.asignaturas_destino?.map(a => a.nombre).join(', ')}
            </div>

            <textarea
              className="w-full p-2 mt-2 border rounded text-sm"
              rows="2"
              placeholder="Comentario específico del bloque"
              value={b.comentario_tutor || ""}
              onChange={(e) => {
                const nuevos = [...bloques];
                nuevos[i].comentario_tutor = e.target.value;
                setBloques(nuevos);
              }}
            ></textarea>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={guardarComentarios}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          💬 Guardar comentarios
        </button>

        <button
          onClick={aceptarAcuerdo}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ✅ Aceptar acuerdo
        </button>
      </div>
    </div>
  );
}
