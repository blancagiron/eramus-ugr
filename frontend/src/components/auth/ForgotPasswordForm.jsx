import { useState } from "react";

export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [tipo, setTipo] = useState("");

  const solicitar = async (e) => {
    e.preventDefault();
    setMsg(""); setTipo("");
    try {
      const res = await fetch("http://localhost:5000/usuarios/olvido-password", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setTipo("exito");
        setMsg("Si el email existe, te hemos enviado un enlace de recuperación.");
      } else {
        setTipo("error");
        setMsg(data.error || "Error al solicitar recuperación.");
      }
    } catch {
      setTipo("error");
      setMsg("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8">
      <h1 className="text-2xl font-semibold text-black text-center mb-6">Recuperar contraseña</h1>
      <form onSubmit={solicitar} className="space-y-4">
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>
        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg">
          Enviarme el enlace
        </button>
        {msg && <p className={`text-center ${tipo==="exito"?"text-green-600":"text-red-600"}`}>{msg}</p>}
      </form>
      <div className="text-center mt-6">
        <button onClick={onBack} className="text-red-500 hover:text-red-700 font-semibold hover:underline">
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
}
