// ...importaciones
import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import SidebarPerfil from "./SidebarPerfil";
import InfoAcademica from "./InfoAcademica";
import AsignaturasSuperadas from "./AsignaturasSuperadas";
import Idiomas from "./Idiomas";
import Hamburguesa from "../dashboard/Hamburguesa";
import DashboardHeader from "../dashboard/DashboardHeader";

export default function Perfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const email = usuario?.email;
  const rol = usuario?.rol;

  const [perfil, setPerfil] = useState(null);
  const [asignaturasBD, setAsignaturasBD] = useState([]);
  const [centros, setCentros] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [form, setForm] = useState({
    idiomas: [],
    asignaturas_superadas: [],
    creditos_superados: 0
  });
  const [nuevoIdioma, setNuevoIdioma] = useState({ idioma: "", nivel: "" });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const [file, setFile] = useState(null);
  const [quitarFotoFlag, setQuitarFotoFlag] = useState(false);

  useEffect(() => {
    if (!email) return;
    fetch(`http://localhost:5000/usuarios/${email}`)
      .then(res => res.json())
      .then(data => {
        setPerfil(data);
        setForm({
          idiomas: data.idiomas || [],
          asignaturas_superadas: data.asignaturas_superadas || [],
          creditos_superados: data.creditos_superados || 0
        });
      });
  }, [email]);

  useEffect(() => {
    fetch("http://localhost:5000/api/centros")
      .then(res => res.json())
      .then(data => setCentros(data))
      .catch(() => setCentros([]));
  }, []);

  useEffect(() => {
    if (perfil?.codigo_grado) {
      fetch(`http://localhost:5000/api/asignaturas?codigo_grado=${perfil.codigo_grado}`)
        .then(res => res.json())
        .then(data => setAsignaturasBD(data));
    }
  }, [perfil]);

  const añadirIdioma = () => {
    if (nuevoIdioma.idioma && nuevoIdioma.nivel) {
      setForm(prev => ({
        ...prev,
        idiomas: [...prev.idiomas, nuevoIdioma]
      }));
      setNuevoIdioma({ idioma: "", nivel: "" });
    }
  };

  const eliminarIdioma = (index) => {
    const nuevos = [...form.idiomas];
    nuevos.splice(index, 1);
    setForm({ ...form, idiomas: nuevos });
  };

  const guardarCambios = async () => {
    if (!email) return;

    try {
      if (file) {
        const formData = new FormData();
        formData.append("foto", file);
        formData.append("email", email);

        const resFoto = await fetch("http://localhost:5000/usuarios/foto", {
          method: "POST",
          body: formData,
        });

        if (!resFoto.ok) throw new Error("Error al subir la foto.");
      }

      if (quitarFotoFlag) {
        await fetch(`http://localhost:5000/usuarios/foto?email=${email}`, {
          method: "DELETE",
        });
      }

      const payload = {
        asignaturas_superadas: form.asignaturas_superadas,
        creditos_superados: form.creditos_superados,
        idiomas: form.idiomas,
      };

      const res = await fetch(`http://localhost:5000/usuarios/${email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const actualizado = await fetch(`http://localhost:5000/usuarios/${email}`).then((r) => r.json());
        setPerfil(actualizado);
        setMensaje("Cambios guardados correctamente.");
        setTipoMensaje("exito");
        setEditando(false);
        setFile(null);
        setQuitarFotoFlag(false);
      } else {
        throw new Error("Error al guardar cambios.");
      }
    } catch (err) {
      console.error(err);
      setMensaje(err.message);
      setTipoMensaje("error");
    }

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 4000);
  };

  const cancelarCambios = () => {
    setEditando(false);
    setFile(null);
    setQuitarFotoFlag(false);
    setForm({
      idiomas: perfil.idiomas || [],
      asignaturas_superadas: perfil.asignaturas_superadas || [],
      creditos_superados: perfil.creditos_superados || 0
    });
  };

  if (!perfil) return <p className="p-8">Cargando perfil...</p>;

  const nombreCentro = centros.find(c => c.codigo === perfil.codigo_centro)?.nombre || perfil.codigo_centro;

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible(prev => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen flex flex-col">
          <DashboardHeader titulo="Mi Perfil" subtitulo="Gestiona tu información académica y personal" />

          <div className="flex flex-col md:flex-row flex-1 max-w-screen-2xl mx-auto w-full">
            <div className="w-full md:w-72 p-3">
              <SidebarPerfil
                perfil={perfil}
                editando={editando}
                setEditando={setEditando}
                guardarCambios={guardarCambios}
                cancelarCambios={cancelarCambios}
                file={file}
                setFile={setFile}
                setQuitarFotoFlag={setQuitarFotoFlag}
              />
            </div>

            <section className="flex-1 space-y-6 px-4 md:px-8 pb-10 min-h-full">
              {mensaje && (
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-white shadow-lg z-50 ${tipoMensaje === "exito" ? "bg-green-600" : "bg-red-600"}`}>
                  {mensaje}
                </div>
              )}

              <div className="pt-4">
                <InfoAcademica perfil={perfil} form={form} nombreCentro={nombreCentro} />
              </div>

              {rol === "estudiante" && (
                <>
                  <AsignaturasSuperadas
                    editando={editando}
                    asignaturasBD={asignaturasBD}
                    seleccionadas={form.asignaturas_superadas}
                    onChange={(seleccionadas) => {
                      const total = asignaturasBD
                        .filter(a => seleccionadas.includes(a.codigo))
                        .reduce((sum, a) => sum + (a.creditos || 0), 0);
                      setForm(prev => ({
                        ...prev,
                        asignaturas_superadas: seleccionadas,
                        creditos_superados: total
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
