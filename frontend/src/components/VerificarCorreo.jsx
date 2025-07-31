import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const [mensaje, setMensaje] = useState("Verificando...");
  const [exito, setExito] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMensaje("Token de verificación inválido.");
      setExito(false);
      return;
    }

    fetch("http://localhost:5000/usuarios/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.mensaje) {
          setMensaje(data.mensaje);
          setExito(true);
          setTimeout(() => navigate("/"), 3000);
        } else {
          setMensaje(data.error || "Error al verificar.");
          setExito(false);
        }
      })
      .catch(() => {
        setMensaje("Error de red al verificar.");
        setExito(false);
      });
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Verificación de cuenta</h1>
        <p className={`text-lg ${exito ? "text-green-600" : "text-red-600"}`}>{mensaje}</p>
        {exito && (
          <p className="text-gray-600 mt-2 text-sm">
            Redirigiendo al inicio de sesión...
          </p>
        )}
      </div>
    </div>
  );
}
