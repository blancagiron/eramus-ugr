// ...importaciones
import { useEffect, useState, useRef } from "react";
import Sidebar from "../dashboard/Sidebar";
import SidebarPerfil from "./SidebarPerfil";
import InfoAcademica from "./InfoAcademica";
import AsignaturasSuperadas from "./AsignaturasSuperadas";
import Idiomas from "./Idiomas";
import Hamburguesa from "../dashboard/Hamburguesa";
import DashboardHeader from "../dashboard/DashboardHeader";
import RenunciaDestinoCard from "./RenunciaDestinoCard";

/**
 * Transforma una URL de Cloudinary (avatar cuadrado, centrado en cara, redondeado).
 * Si no es de Cloudinary, devuelve la URL tal cual.
 */
function getAvatarUrl(
  url,
  {
    w = 256,
    h = 256,
    crop = "fill",
    gravity = "face",
    radius = "max",
    fmt = "auto",
    quality = "auto",
  } = {}
) {
  if (!url || typeof url !== "string") return url;
  const isCloudinary =
    url.includes("res.cloudinary.com/") && url.includes("/image/upload/");
  if (!isCloudinary) return url;

  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const prefix = url.substring(0, idx + marker.length);
  const suffix = url.substring(idx + marker.length);

  const transform = [
    `w_${w}`,
    `h_${h}`,
    `c_${crop}`,
    `g_${gravity}`,
    `r_${radius}`,
    `f_${fmt}`,
    `q_${quality}`,
  ].join(",");

  return `${prefix}${transform}/${suffix}`;
}

export default function Perfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const email = usuario?.email;
  const rol = usuario?.rol;

  const [perfil, setPerfil] = useState(null);
  const [asignaturasBD, setAsignaturasBD] = useState([]);
  const [centros, setCentros] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Form académico (no toca la foto directamente)
  const [form, setForm] = useState({
    idiomas: [],
    asignaturas_superadas: [],
    creditos_superados: 0,
  });
  const [nuevoIdioma, setNuevoIdioma] = useState({ idioma: "", nivel: "" });

  // UI estado general
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  // FOTO (borrador local, solo persiste al pulsar Guardar cambios)
  const [fotoDraftFile, setFotoDraftFile] = useState(null); // File seleccionado
  const [quitarFotoDraft, setQuitarFotoDraft] = useState(false); // marcar quitar
  const [previewUrl, setPreviewUrl] = useState(null); // preview local
  const previewRef = useRef(null);

  // Cargar perfil
  useEffect(() => {
    if (!email) return;
    fetch(`http://localhost:5000/usuarios/${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setPerfil(data);
        setForm({
          idiomas: data.idiomas || [],
          asignaturas_superadas: data.asignaturas_superadas || [],
          creditos_superados: data.creditos_superados || 0,
        });
      });
  }, [email]);

  // Cargar centros
  useEffect(() => {
    fetch("http://localhost:5000/api/centros")
      .then((res) => res.json())
      .then((data) => setCentros(data))
      .catch(() => setCentros([]));
  }, []);

  // Cargar asignaturas del grado
  useEffect(() => {
    if (perfil?.codigo_grado) {
      fetch(
        `http://localhost:5000/api/asignaturas?codigo_grado=${perfil.codigo_grado}`
      )
        .then((res) => res.json())
        .then((data) => setAsignaturasBD(data));
    }
  }, [perfil]);

  // ----- idiomas -----
  const añadirIdioma = () => {
    if (nuevoIdioma.idioma && nuevoIdioma.nivel) {
      setForm((prev) => ({
        ...prev,
        idiomas: [...prev.idiomas, nuevoIdioma],
      }));
      setNuevoIdioma({ idioma: "", nivel: "" });
    }
  };
  const eliminarIdioma = (index) => {
    const nuevos = [...form.idiomas];
    nuevos.splice(index, 1);
    setForm({ ...form, idiomas: nuevos });
  };

  // ----- FOTO: selección y preview (local, no persistente) -----
  const onSelectFileDraft = (file) => {
    if (file) setQuitarFotoDraft(false); // si eliges nuevo archivo, desmarca "quitar"
    setFotoDraftFile(file || null);

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // ----- GUARDAR TODO (foto + datos) -----
  const guardarCambios = async () => {
    if (!email) return;

    try {
      // 1) Persistir la FOTO si hay cambios en el borrador
      if (quitarFotoDraft) {
        const resDel = await fetch(
          `http://localhost:5000/usuarios/foto?email=${encodeURIComponent(
            email
          )}`,
          { method: "DELETE" }
        );
        if (!resDel.ok) throw new Error("Error al eliminar la foto.");
      } else if (fotoDraftFile) {
        const formData = new FormData();
        formData.append("foto", fotoDraftFile);
        formData.append("email", email);
        const resFoto = await fetch("http://localhost:5000/usuarios/foto", {
          method: "POST",
          body: formData,
        });
        if (!resFoto.ok) throw new Error("Error al subir la foto.");
      }
      // Importante: si no hay cambios de foto, no tocamos la foto.

      // 2) Guardar DATOS
      const payload = {
        asignaturas_superadas: form.asignaturas_superadas,
        creditos_superados: form.creditos_superados,
        idiomas: form.idiomas,
      };
      const res = await fetch(
        `http://localhost:5000/usuarios/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Error al guardar cambios.");

      // 3) Refrescar perfil desde servidor (trae foto_url nueva si cambió)
      const actualizado = await fetch(
        `http://localhost:5000/usuarios/${encodeURIComponent(email)}`
      ).then((r) => r.json());
      setPerfil(actualizado);

      // 4) Limpiar borradores y estado UI
      onSelectFileDraft(null);
      setQuitarFotoDraft(false);
      setMensaje("Cambios guardados correctamente.");
      setTipoMensaje("exito");
      setEditando(false);
    } catch (err) {
      console.error(err);
      setMensaje(err.message || "Error al guardar cambios.");
      setTipoMensaje("error");
    } finally {
      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 4000);
    }
  };

  // ----- CANCELAR TODO (descarta borrador de foto + datos sin tocar servidor) -----
  const cancelarCambios = () => {
    setEditando(false);
    // Descarta foto en borrador
    onSelectFileDraft(null);
    setQuitarFotoDraft(false);
    // Restaura form desde perfil
    setForm({
      idiomas: perfil?.idiomas || [],
      asignaturas_superadas: perfil?.asignaturas_superadas || [],
      creditos_superados: perfil?.creditos_superados || 0,
    });
  };

  if (!perfil) return <p className="p-8">Cargando perfil...</p>;

  const nombreCentro =
    centros.find((c) => c.codigo === perfil.codigo_centro)?.nombre ||
    perfil.codigo_centro;

  // Imagen a mostrar: preview local > (si marcaste quitar: placeholder) > cloudinary > placeholder
  const fotoGuardada = perfil.foto_url ? getAvatarUrl(perfil.foto_url) : null;
  const fotoParaMostrar =
    // previewUrl ||
    // (quitarFotoDraft
    //   ? "/assets/avatar-placeholder.png"
    //   : fotoGuardada || "/assets/avatar-placeholder.png");
    previewUrl || (quitarFotoDraft ? null : fotoGuardada);

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible((prev) => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen flex flex-col">
          <DashboardHeader
            titulo="Mi Perfil"
            subtitulo="Gestiona tu información académica y personal"
          />

          <div className="flex flex-col md:flex-row flex-1 max-w-screen-2xl mx-auto w-full">
            <div className="w-full md:w-72 p-3">
              <SidebarPerfil
                // Perfil e imagen
                perfil={perfil}
                fotoSrc={fotoParaMostrar}

                // Edición general
                editando={editando}
                setEditando={setEditando}
                guardarCambios={guardarCambios}
                cancelarCambios={cancelarCambios}

                // Foto (borrador)
                file={fotoDraftFile}
                setFile={onSelectFileDraft}
                quitarFotoFlag={quitarFotoDraft}
                setQuitarFotoFlag={setQuitarFotoDraft}
              />
            </div>

            <section className="flex-1 space-y-6 px-4 md:px-8 pb-10 min-h-full">
              {mensaje && (
                <div
                  className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-white shadow-lg z-50 ${tipoMensaje === "exito" ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                  {mensaje}
                </div>
              )}

              <RenunciaDestinoCard
                rol={rol}
                perfil={perfil}
                email={email}
                onPerfilActualizado={setPerfil}
                setMensaje={setMensaje}
                setTipoMensaje={setTipoMensaje}
              />


              <div className="pt-4">
                <InfoAcademica
                  perfil={perfil}
                  form={form}
                  nombreCentro={nombreCentro}
                />
              </div>

              {rol === "estudiante" && (
                <>
                  <AsignaturasSuperadas
                    editando={editando}
                    asignaturasBD={asignaturasBD}
                    seleccionadas={form.asignaturas_superadas}
                    onChange={(seleccionadas) => {
                      const total = asignaturasBD
                        .filter((a) => seleccionadas.includes(a.codigo))
                        .reduce((sum, a) => sum + (a.creditos || 0), 0);
                      setForm((prev) => ({
                        ...prev,
                        asignaturas_superadas: seleccionadas,
                        creditos_superados: total,
                      }));
                    }}
                  />

                  <Idiomas
                    idiomas={form.idiomas}
                    nuevoIdioma={nuevoIdioma}
                    setNuevoIdioma={setNuevoIdioma}
                    añadirIdioma={añadirIdioma}
                    eliminarIdioma={eliminarIdioma}
                    editando={editando}
                  />
                </>
              )}
            </section>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
