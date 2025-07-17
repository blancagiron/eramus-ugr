import HeaderLanding from "./landing_page_layout/HeaderLanding";

export default function Privacidad() {
  return (
    <>
      <HeaderLanding />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Política de Privacidad</h1>
        <p className="mb-4">
          Esta plataforma Erasmus de la Universidad de Granada ha sido desarrollada como parte de un Trabajo de Fin de Grado con fines académicos. No almacena ni trata datos reales sin consentimiento.
        </p>
        <p className="mb-4">
          Solo se guardan los datos necesarios para el uso de la plataforma, como el nombre, email, titulación, y asignaturas simuladas. No se comparten con terceros.
        </p>
        <p className="mb-4">
          Si deseas eliminar tus datos, contáctanos en intlinfo@ugr.es.
        </p>
      </div>
    </>
  );
}
