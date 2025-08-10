import {
  Upload,
  ImagePlus,
  Trash2,
  CheckCircle2,
  XCircle,
  UserRound,
  Pencil,
  ShieldCheck
} from "lucide-react";
import estrella from "../../assets/landing/estrella_roja_pagina.svg";

export default function SidebarPerfil({
  perfil,
  editando,
  setEditando,
  guardarCambios,
  cancelarCambios,

  // FOTO (borrador controlado por el padre)
  fotoSrc,           // preview > cloudinary > placeholder (calculado en Perfil.jsx)
  file,              // File seleccionado (borrador)
  setFile,           // (file|null) -> el padre gestiona preview
  quitarFotoFlag,    // bool: marcar quitar (borrador)
  setQuitarFotoFlag, // setter
}) {
  const nombre = `${perfil.nombre || ""} ${perfil.primer_apellido || ""} ${perfil.segundo_apellido || ""}`.trim();
  const rol = perfil.rol || "estudiante";
  const estado = perfil.estado_proceso || "desconocido";

  const estados = {
    "no iniciado": { texto: "No iniciado", estilo: "bg-gray-200 text-gray-700" },
    "sin destino": { texto: "Sin destino", estilo: "bg-gray-100 text-gray-600" },
    "con destino": { texto: "Destino asignado", estilo: "bg-blue-100 text-blue-700" },
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
    const selected = e.target.files?.[0];
    if (selected && selected.type?.startsWith("image/")) {
      setFile(selected);      // el padre crea la preview y desmarca quitar
      setQuitarFotoFlag(false);
    }
  };

  const handleQuitarFoto = () => {
    if (!editando) return;
    setFile(null);            // sin archivo en borrador
    setQuitarFotoFlag(true);  // marcar quitar (borrador)
  };

  return (
    <aside className="w-full bg-white rounded-xl p-5 font-inter min-h-[500px] flex flex-col  shadow-lg">
      <div className="flex flex-col items-center flex-1">
        {/* Foto */}
        <div className="w-36 h-36 relative mb-3">
          <img src={estrella} alt="Marco de foto" className="w-full h-full object-contain" />
          <div className="absolute inset-0 flex items-center justify-center">
            {fotoSrc ? (
              <img
                src={fotoSrc}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
              // onError={(e) => {
              //   e.currentTarget.src = "/assets/avatar-placeholder.png";
              // }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                Sin foto
              </div>
            )}
          </div>

          {/* Input para subir cuando se edita */}
          {editando && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Subir foto"
            />
          )}
        </div>

        {/* Mensajes bajo imagen */}
        {editando && (
          <div className="flex flex-col items-center gap-2 mb-4">
            {!file && !quitarFotoFlag && (
              <label className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                Pulsa sobre la imagen para subir
              </label>
            )}
            {file && (
              <div className="text-xs text-blue-700 flex items-center gap-1">
                <ImagePlus className="w-3 h-3" />
                Vista previa (se guardará al aplicar)
              </div>
            )}
            {(perfil.foto_url || file) && (
              <button
                onClick={handleQuitarFoto}
                className="text-sm text-red-600 flex items-center gap-1 hover:underline"
                type="button"
              >
                <Trash2 className="w-3 h-3" />
                Quitar foto
              </button>
            )}
            {quitarFotoFlag && !file && (
              <div className="text-xs text-red-600">
                La foto se eliminará al guardar cambios
              </div>
            )}
          </div>
        )}

        {/* Nombre */}
        <h2 className="text-center font-semibold text-lg flex items-center gap-2 mb-2 px-2">
          <UserRound className="w-5 h-5 text-gray-700" />
          <span className="break-words" style={{ fontFamily: "Inter, sans-serif" }}>
            {nombre || "Usuario"}
          </span>
        </h2>

        {/* Rol */}
        <div className="text-sm text-gray-600 mb-4 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-gray-500" />
          Rol: <span className="font-medium capitalize">{rol}</span>
        </div>

        {/* Estado (solo estudiantes) */}
        {rol === "estudiante" && (
          <div className={`text-l rounded-full px-3 py-1.5 mb-6 ${estadoClase}`}>
            Estado: <span className="font-medium">{estadoTexto}</span>
          </div>
        )}

        {/* Botones únicos (perfil completo) */}
        <div className="w-full space-y-2">
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium text-m"
              type="button"
            >
              <Pencil className="w-4 h-4" />
              Editar Perfil
            </button>
          ) : (
            <>
              <button
                onClick={guardarCambios}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium text-m"
                type="button"
              >
                <CheckCircle2 className="w-4 h-4" />
                Guardar Cambios
              </button>
              <button
                onClick={cancelarCambios}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors duración-200 font-medium text-m"
                type="button"
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
