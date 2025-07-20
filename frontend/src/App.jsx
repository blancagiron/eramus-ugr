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
import TestAsignaturaSearch from "./TestAsignatura";  
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

      </Routes>
    </div>
  );
}

export default App;
