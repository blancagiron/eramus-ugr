import { useState, useEffect } from "react";

export default function EditarUsuarioModal({ usuario, onClose }) {
  const [form, setForm] = useState({ ...usuario });
  const [centros, setCentros] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/centros")
      .then(res => res.json())
      .then(setCentros)
      .catch(() => setCentros([]));
  }, []);

  const actualizar = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const guardar = async () => {
    const res = await fetch(`http://localhost:5000/usuarios/${usuario.email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) onClose();
    else alert("Error al actualizar");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">Editar usuario</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nombre" value={form.nombre} onChange={actualizar} placeholder="Nombre" className="p-2 border rounded" />
          <input name="apellidos" value={form.apellidos} onChange={actualizar} placeholder="Apellidos" className="p-2 border rounded" />
          <input name="email" value={form.email} onChange={actualizar} placeholder="Email" className="p-2 border rounded" />
          <select name="rol" value={form.rol} onChange={actualizar} className="p-2 border rounded">
            <option value="estudiante">Estudiante</option>
            <option value="tutor">Tutor</option>
            <option value="admin">Admin</option>
          </select>
          <select name="codigo_centro" value={form.codigo_centro} onChange={actualizar} className="p-2 border rounded">
            <option value="">Selecciona centro</option>
            {centros.map(c => (
              <option key={c.codigo} value={c.codigo}>{c.nombre}</option>
            ))}
          </select>
          <input name="grado" value={form.grado || ""} onChange={actualizar} placeholder="Grado" className="p-2 border rounded" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button onClick={guardar} className="px-4 py-2 bg-red-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
