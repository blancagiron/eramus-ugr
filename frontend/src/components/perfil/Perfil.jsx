import { useEffect, useState } from "react";
import SidebarPerfil from "./SidebarPerfil";
import InfoAcademica from "./InfoAcademica";
import AsignaturasSuperadas from "./AsignaturasSuperadas";
import Idiomas from "./Idiomas";

export default function Perfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const email = usuario?.email;

  const [perfil, setPerfil] = useState(null);
  const [asignaturasBD, setAsignaturasBD] = useState([]);
  const [centros, setCentros] = useState([]);
  const [form, setForm] = useState({
    idiomas: [],
    asignaturas_superadas: [],
    creditos_superados: 0
  });
  const [nuevoIdioma, setNuevoIdioma] = useState({ idioma: "", nivel: "" });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" o "error"

  useEffect(() => {
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
    const payload = {
      asignaturas_superadas: form.asignaturas_superadas,
      creditos_superados: form.creditos_superados,
      idiomas: form.idiomas
    };
    const res = await fetch(`http://localhost:5000/usuarios/${email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setMensaje("Cambios guardados correctamente.");
      setTipoMensaje("exito");
      setEditando(false);
      setPerfil(prev => ({ ...prev, ...payload }));
    } else {
      setMensaje("Error al guardar cambios.");
      setTipoMensaje("error");
    }
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 4000);
  };

  const cancelarCambios = () => {
    setEditando(false);
    setForm({
      idiomas: perfil.idiomas || [],
      asignaturas_superadas: perfil.asignaturas_superadas || [],
      creditos_superados: perfil.creditos_superados || 0
    });
  };

  if (!perfil) return <p className="p-8">Cargando perfil...</p>;

  const nombreCentro = centros.find(c => c.codigo === perfil.codigo_centro)?.nombre || perfil.codigo_centro;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {mensaje && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-white shadow-lg z-50 ${
          tipoMensaje === "exito" ? "bg-green-600" : "bg-red-600"
        }`}>
          {mensaje}
        </div>
      )}

      <SidebarPerfil
        editando={editando}
        setEditando={setEditando}
        guardarCambios={guardarCambios}
        cancelarCambios={cancelarCambios}
      />

      <section className="flex-1 space-y-6">
        <InfoAcademica perfil={perfil} form={form} nombreCentro={nombreCentro} />

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
      </section>
    </div>
  );
}
