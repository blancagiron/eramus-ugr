import { useEffect, useState } from "react";

export default function ResetPasswordForm({ onBack }) {
  const [token, setToken] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("resetToken") || "");
  },[]);

  const enviar = async (e) => {
    e.preventDefault();
    setMsg(""); setTipo("");
    try {
      const res = await fetch("http://localhost:5000/usuarios/reset-password", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ token, nueva_contraseña: pwd })
      });
      const data = await res.json();
      if (res.ok) {
        setTipo("exito");
        setMsg("Tu contraseña se ha actualizado. Ya puedes iniciar sesión.");
      } else {
        setTipo("error");
        setMsg(data.error || "No se pudo actualizar la contraseña.");
      }
    } catch {
      setTipo("error");
      setMsg("Error de conexión con el servidor.");
    }
  };

  if (!token) {
    return (
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8">
        <h1 className="text-2xl font-semibold text-black text-center mb-6">Restablecer contraseña</h1>
        <p className="text-center text-gray-700">Enlace inválido. Solicita uno nuevo.</p>
        <div className="text-center mt-6">
          <button onClick={onBack} className="text-red-500 hover:text-red-700 font-semibold hover:underline">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8">
      <h1 className="text-2xl font-semibold text-black text-center mb-6">Elige tu nueva contraseña</h1>
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label className="block text-xl font-medium text-gray-700 mb-2">Nueva contraseña</label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
            value={pwd}
            onChange={(e)=>setPwd(e.target.value)}
            required
          />
        </div>
        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg">
          Guardar
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
