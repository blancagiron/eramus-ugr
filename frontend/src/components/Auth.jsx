import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import RolSelector from "./auth/RolSelector";
import RegistroForm from "./auth/RegistroForm";
import HeaderLanding from "./landing_page_layout/HeaderLanding";
import FooterLanding from "./landing_page_layout/FooterLanding";

export default function Auth() {
  const [modo, setModo] = useState("login"); // login | seleccionar-rol | registro
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [form, setForm] = useState({
    email: "", contraseña: "", nombre: "", apellidos: "",
    grado: "", codigo_centro: "", rol: "", codigo_tutor: "", codigo_grado: ""
  });
  const [grados, setGrados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" | "error"
  const navigate = useNavigate();
  const [autenticando, setAutenticando] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      const { rol } = JSON.parse(user);
  
      if (rol === "admin") {
        navigate("/dashboard/admin");
      } else if (rol === "tutor") {
        navigate("/dashboard/tutor");
      } else {
        navigate("/dashboard/estudiante");
      }
    } else {
      setAutenticando(false); // Solo si no hay usuario
    }
  }, [navigate]);

  const [centros, setCentros] = useState([]);

  useEffect(() => {
    if (modo === "registro") {
      fetch("http://localhost:5000/grados")
        .then(res => res.json())
        .then(data => setGrados(data))
        .catch(() => setGrados([]));

      // Solo si es tutor, carga centros
      if (rolSeleccionado === "tutor") {
        fetch("http://localhost:5000/api/centros")
          .then(res => res.json())
          .then(data => setCentros(data))
          .catch(() => setCentros([]));
      }
    }
  }, [modo, rolSeleccionado]);

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    if (name === "codigo_grado") {
      const gradoSeleccionado = grados.find(g => g.codigo === value);
      setForm(prev => ({
        ...prev,
        codigo_grado: value,
        grado: gradoSeleccionado?.nombre || "",
        codigo_centro: gradoSeleccionado?.codigo_centro || ""
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const registrar = async e => {
    e.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    // if (rolSeleccionado === "tutor" && form.codigo_tutor !== process.env.REACT_APP_CODIGO_TUTOR) {
    //   setMensaje("Código de tutor incorrecto");
    //   setTipoMensaje("error");
    //   return;
    // }

    const payload = { ...form, rol: rolSeleccionado };
    try {
      const res = await fetch("http://localhost:5000/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("Registro exitoso");
        setTipoMensaje("exito");
        setTimeout(() => {
          setModo("login");
          setMensaje("");
          setTipoMensaje("");
        }, 2000);
      } else {
        setMensaje(data.error || "Error inesperado");
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor");
      setTipoMensaje("error");
    }
  };

  const login = async e => {
    e.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    try {
      const res = await fetch("http://localhost:5000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("usuario", JSON.stringify(data));
        navigate(data.rol === "tutor" ? "/dashboard/tutor" : "/dashboard/estudiante");
      } else {
        setMensaje(data.error || "Login fallido");
        setTipoMensaje("error");
      }
    } catch {
      setMensaje("Error de conexión al intentar iniciar sesión");
      setTipoMensaje("error");
    }
  };
  if (autenticando) return null;

  return (
    <>
      <HeaderLanding />
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
        {modo === "login" && (
          <LoginForm
            form={form}
            actualizarCampo={actualizarCampo}
            onLogin={login}
            cambiarModo={() => setModo("seleccionar-rol")}
            mensaje={mensaje}
            tipoMensaje={tipoMensaje}
          />
        )}
        {modo === "seleccionar-rol" && (
          <RolSelector
            seleccionarRol={(rol) => {
              setRolSeleccionado(rol);
              setModo("registro");
            }}
          />
        )}
        {modo === "registro" && (
          <RegistroForm
            form={form}
            actualizarCampo={actualizarCampo}
            rol={rolSeleccionado}
            grados={grados}
            centros={centros}
            onBack={() => setModo("seleccionar-rol")}
            onRegister={registrar}
            mensaje={mensaje}
            tipoMensaje={tipoMensaje}
          />
        )}
      </div>
      <FooterLanding />
    </>
  );
}
