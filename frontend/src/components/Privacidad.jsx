import HeaderLanding from "./landing_page_layout/HeaderLanding";

export default function Privacidad() {
  return (
    <div className="bg-stone-100 min-h-screen">
      <HeaderLanding />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-red-700 mb-8" style={{ fontFamily: 'Inter' }}>Política de Privacidad</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Sección 1 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>1. Compromiso con la Privacidad</h2>
            <div className="space-y-4">
              <p>
                El autor de esta plataforma se compromete a garantizar la privacidad y la protección de los datos 
                personales tratados en el sistema, conforme a lo dispuesto en:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El Reglamento (UE) 2016/679 de Protección de Datos Personales (RGPD)</li>
                <li>La Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)</li>
              </ul>
              <p>
                Esta política aplica al entorno de desarrollo de la plataforma, que, a pesar de su carácter académico, 
                recoge y trata datos personales simulados y reales para la gestión de perfiles de usuario, asignación 
                de destinos, validación de acuerdos de estudios y otras funcionalidades relacionadas con la movilidad 
                internacional Erasmus.
              </p>
            </div>
          </section>

          {/* Sección 2 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>2. Datos Personales Tratados</h2>
            <div className="space-y-4">
              <p>
                La plataforma recoge y trata los siguientes datos personales, necesarios para el correcto funcionamiento del sistema:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Datos identificativos:</strong> nombre, apellidos, correo electrónico, rol asignado (estudiante, tutor, administrador)</li>
                <li><strong>Datos académicos:</strong> grado, centro, cursos superados, créditos obtenidos, idiomas conocidos</li>
                <li><strong>Datos administrativos:</strong> destinos asignados, acuerdos de estudios generados, historial de convalidaciones, comentarios de revisión</li>
              </ul>
              <p>
                Estos datos se almacenan de forma estructurada en una base de datos MongoDB gestionada por el backend de la aplicación.
              </p>
            </div>
          </section>

          {/* Sección 3 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>3. Finalidad del Tratamiento</h2>
            <div className="space-y-4">
              <p>Los datos personales se recogen y procesan con las siguientes finalidades:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Permitir el acceso autenticado de los usuarios a la plataforma</li>
                <li>Gestionar perfiles y roles diferenciados para cada tipo de usuario</li>
                <li>Facilitar la creación, edición y revisión de acuerdos de estudios</li>
                <li>Permitir la asignación y gestión de destinos Erasmus</li>
                <li>Proporcionar funcionalidades como búsquedas personalizadas, equivalencias, convalidaciones y seguimiento del estado del proceso Erasmus</li>
              </ul>
            </div>
          </section>

          {/* Sección 4 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>4. Legitimación y Consentimiento</h2>
            <div className="space-y-4">
              <p>
                El tratamiento de los datos personales se realiza bajo la base legal del <strong>consentimiento explícito</strong> del usuario, 
                prestado al registrarse y utilizar activamente la plataforma.
              </p>
              <p>En el contexto del TFG, los datos introducidos han sido, en su mayoría:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Simulados o anonimizados, o bien</li>
                <li>Introducidos por los propios usuarios con conocimiento y consentimiento informado, exclusivamente para la evaluación académica del sistema</li>
              </ul>
            </div>
          </section>

          {/* Sección 5 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>5. Medidas de Seguridad</h2>
            <div className="space-y-4">
              <p>La plataforma aplica medidas de seguridad básicas adecuadas al entorno de desarrollo, entre las que se incluyen:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Control de acceso por rol</li>
                <li>Validación de datos en cliente y servidor</li>
                <li>Almacenamiento en base de datos no pública</li>
                <li>Comunicación en entorno local o cifrada en despliegues reales</li>
              </ul>
              <p>
                En un entorno de producción, sería necesario incorporar cifrado de datos sensibles, anonimización, 
                gestión de logs, control de sesiones, y auditorías de acceso conforme al ENS.
              </p>
            </div>
          </section>

          {/* Sección 6 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>6. Conservación de los Datos</h2>
            <div className="space-y-4">
              <p>Los datos personales serán almacenados únicamente durante el tiempo necesario para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>La demostración, evaluación o exposición del proyecto académico</li>
                <li>El análisis de la usabilidad y funcionamiento de la plataforma en entornos de prueba</li>
              </ul>
              <p>Posteriormente, podrán ser anonimizados o eliminados completamente.</p>
            </div>
          </section>

          {/* Sección 7 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>7. Derechos de los Usuarios</h2>
            <div className="space-y-4">
              <p>Los usuarios cuyos datos puedan estar registrados en el sistema tienen derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a sus datos personales</li>
                <li>Solicitar la rectificación o supresión de los mismos</li>
                <li>Oponerse o limitar su tratamiento</li>
                <li>Retirar el consentimiento en cualquier momento</li>
              </ul>
              <p>
                Para ejercer estos derechos, se podrá contactar con el autor del TFG a través de los canales 
                proporcionados en el propio sistema o en la documentación del proyecto.
              </p>
            </div>
          </section>

          {/* Sección 8 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>8. Enlaces a Terceros</h2>
            <p>
              En caso de que la plataforma contenga enlaces a sitios externos (como universidades socias o páginas informativas), 
              el autor no se responsabiliza de sus políticas de privacidad, que deberán ser consultadas directamente en dichos portales.
            </p>
          </section>

          {/* Footer informativo */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border-l-4 border-red-500 shadow-lg">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Esta plataforma Erasmus de la Universidad de Granada ha sido desarrollada como parte de un 
              Trabajo de Fin de Grado con fines académicos. Solo se guardan los datos necesarios para el uso de la plataforma. 
              Si deseas eliminar tus datos, contáctanos en intlinfo@ugr.es.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}