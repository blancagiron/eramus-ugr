import {
  Upload,
  ImagePlus,
  Trash2,
  CheckCircle2,
  XCircle,
  UserRound,
  Pencil
} from "lucide-react";
import estrella from "../../assets/landing/estrella_roja_pagina.svg";
import { useState } from "react";

export default function SidebarPerfil({
  perfil,
  editando,
  setEditando,
  guardarCambios,
  cancelarCambios,
  file,
  setFile,
  setQuitarFotoFlag,
}) {
  const BASE_URL = "http://localhost:5000";
  const nombre = `${perfil.nombre || ""} ${perfil.apellidos || ""}`;
  const estado = perfil.estado_proceso || "desconocido";

  const [fotoRemovida, setFotoRemovida] = useState(false);

  const fotoGuardada =
    !fotoRemovida && perfil.foto_perfil
      ? `${BASE_URL}/uploads/perfiles/${perfil.foto_perfil}`
      : null;

  const estados = {
    "sin destino": { texto: "Sin destino", estilo: "bg-gray-100 text-gray-600" },
    "destino_asignado": { texto: "Destino asignado", estilo: "bg-blue-100 text-blue-700" },
    "en revision": { texto: "En revisión", estilo: "bg-yellow-100 text-yellow-700" },
    "aceptado": { texto: "Aceptado", estilo: "bg-green-100 text-green-700" },
    "rechazado": { texto: "Rechazado", estilo: "bg-red-100 text-red-700" },
  };

  const { texto: estadoTexto, estilo: estadoClase } = estados[estado] || {
    texto: "Desconocido",
    estilo: "bg-gray-200 text-gray-700",
  };

  const handleFileChange = (e) => {
    if (!editando) return;
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setFotoRemovida(false);
      setQuitarFotoFlag(false);
    }
  };

  const handleQuitarFoto = () => {
    setFile(null);
    setFotoRemovida(true);
    setQuitarFotoFlag(true);
  };

  return (
    <aside className="w-full bg-white rounded-xl shadow-sm p-5 font-inter">
      {/* Información del usuario */}
      <div className="flex flex-col items-center">
        {/* Marco y foto */}
        <div className="w-36 h-36 relative mb-3">
          <img src={estrella} alt="Marco de foto" className="w-full h-full object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Vista previa"
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
              />
            ) : fotoGuardada ? (
              <img
                src={fotoGuardada}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
                onError={(e) => {
                  e.target.src = estrella;
                  e.target.classList.add("opacity-30");
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                Sin foto
              </div>
            )}
          </div>
          {editando && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>

        {/* Mensajes bajo la imagen */}
        {editando && (
          <div className="flex flex-col items-center gap-1 mb-4">
            {file && (
              <div className="text-xs text-blue-700 flex items-center gap-1">
                <ImagePlus className="w-3 h-3" />
                Vista previa (se guardará al aplicar)
              </div>
            )}
            {!file && (
              <label className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                Pulsa sobre la imagen para subir
              </label>
            )}
            {(perfil.foto_perfil || file) && (
              <button
                onClick={handleQuitarFoto}
                className="text-sm text-red-600 flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3 h-3" />
                Quitar foto
              </button>
            )}
          </div>
        )}

        {/* Nombre */}
        <h2 className="text-center font-semibold text-lg flex items-center gap-2 mb-3 px-2">
          <UserRound className="w-5 h-5 text-gray-700 flex-shrink-0" /> {/* Ajusté el tamaño del ícono también */}
          <span className="break-words" style={{ fontFamily: "Inter, sans-serif" }}>{nombre}</span>
        </h2>

        {/* Estado del proceso */}
        <div className={`text-l rounded-full px-3 py-1.5 mb-6 ${estadoClase}`}>
          Estado: <span className="font-medium">{estadoTexto}</span>
        </div>

        {/* Botones de acción */}
        <div className="w-full space-y-2">
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium text-m"
            >
              <Pencil className="w-4 h-4" />
              Editar Perfil
            </button>
          ) : (
            <>
              <button
                onClick={guardarCambios}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium text-m"
              >
                <CheckCircle2 className="w-4 h-4" />
                Guardar Cambios
              </button>
              <button
                onClick={cancelarCambios}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium text-m"
              >
                <XCircle className="w-4 h-4" />
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}