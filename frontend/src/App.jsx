import { Routes, Route, Link } from "react-router-dom";
import Perfil from "./components/perfil/Perfil";
import Destinos from "./components/destinos/Destinos";
import LandingPage from "./components/LandingPage";
import Privacidad from "./components/Privacidad";
import Legal from "./components/Legal";
import FaqPage from "./components/Faq";
import Auth from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";
import TutorDashboard from "./components/dashboard/TutorDashboard";
import EstudianteDashboard from "./components/dashboard/EstudianteDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import TestAsignaturaSearch from "./TestAsignatura";
import DestinoDetalle from "./components/destinos/DestinoDetalle";
import GestionUsuarios from "./components/dashboard/admin/usuarios/GestionUsuarios";
import GestionDestinos from "./components/dashboard/admin/destinos/GestionDestinos";
import GestionCentros from "./components/dashboard/admin/centros/GestionCentros";
import GestionGrados from "./components/dashboard/admin/grados/GestionGrados";
import GestionAsignaturas from "./components/dashboard/admin/asignaturas/GestionAsignaturas";
import TestAsignaturas from "./components/destinos/TestAsignaturas";
import DestinoNoAsignado from "./components/destinos/DestinoNoAsignado";
import VerificarEmail from "./components/VerificarCorreo";
import EstudianteComunicacion from "./components/dashboard/EstudianteComunicacion";
import TutorRevisarAcuerdo from "./components/dashboard/TutorRevisarAcuerdo";

import AcuerdoEditor from "./components/acuerdo/AcuerdoEditor";
function App() {
  return (
    <div className="min-h-screen w-full text-black">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/test-asignatura" element={<TestAsignaturaSearch />} />
        <Route path="/destinos/:nombre_uni" element={<DestinoDetalle />} />
        <Route path="/admin/usuarios" element={<PrivateRoute><GestionUsuarios /></PrivateRoute>} />

        <Route path="/admin/destinos" element={<GestionDestinos />} />
        <Route path="/admin/centros" element={<GestionCentros />} />
        <Route path="/admin/grados" element={<GestionGrados />} />
        <Route path="/admin/asignaturas" element={<GestionAsignaturas />} />
        <Route path="/test-asignaturas" element={<TestAsignaturas />} />
        <Route path="/estudiante/destino-no-asignado" element={<DestinoNoAsignado />} />
        <Route path="/verificar-email" element={<VerificarEmail />} />
        <Route path="/estudiante/comunicacion" element={<EstudianteComunicacion />} />

        <Route path="/tutor/acuerdo/:email" element={<TutorRevisarAcuerdo />} />
        {/* Rutas privadas */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/estudiante"
          element={
            <PrivateRoute>
              <EstudianteDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/tutor"
          element={
            <PrivateRoute>
              <TutorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/estudiante/acuerdo"
          element={
            <PrivateRoute>
              <AcuerdoEditor />
            </PrivateRoute>
          }
        />



      </Routes>
    </div>
  );
}

export default App;
