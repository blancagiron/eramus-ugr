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
    grado: "", codigo_centro: "", rol: "", codigo_tutor: ""
  });
  const [grados, setGrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      const rol = JSON.parse(user).rol;
      navigate(rol === "tutor" ? "/dashboard/tutor" : "/dashboard/estudiante");
    }
  }, [navigate]);

  useEffect(() => {
    if (modo === "registro") {
      fetch("http://localhost:5000/grados")
        .then(res => res.json())
        .then(data => setGrados(data))
        .catch(() => setGrados([]));
    }
  }, [modo]);

  const actualizarCampo = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const registrar = async e => {
    e.preventDefault();
    if (rolSeleccionado === "tutor" && form.codigo_tutor !== "ERASMUSUGR2025") {
      alert("Código de tutor incorrecto");
      return;
    }

    const payload = { ...form, rol: rolSeleccionado };
    const res = await fetch("http://localhost:5000/usuarios/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registro exitoso");
      setModo("login");
    } else {
      alert(data.error || "Error inesperado");
    }
  };

  const login = async e => {
    e.preventDefault();
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
      alert(data.error || "Login fallido");
    }
  };

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
            onBack={() => setModo("seleccionar-rol")}
            onRegister={registrar}
          />
        )}
      </div>
      <FooterLanding />
    </>
  );
}
