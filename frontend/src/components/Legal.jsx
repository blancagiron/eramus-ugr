import HeaderLanding from "./landing_page_layout/HeaderLanding";

export default function Legal() {
  return (
    <>
      <HeaderLanding />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Términos y Condiciones</h1>
        <p className="mb-4">
          Esta plataforma ha sido desarrollada con fines educativos como parte de un TFG en la Universidad de Granada.
        </p>
        <p className="mb-4">
          No representa oficialmente a la UGR ni sustituye los canales oficiales de movilidad internacional.
        </p>
        <p className="mb-4">
          El uso de esta plataforma implica la aceptación de estas condiciones.
        </p>
      </div>
    </>
  );
}
