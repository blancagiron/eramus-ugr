import HeaderLanding from "./landing_page_layout/HeaderLanding";

export default function Legal() {
  return (
    <div className="bg-stone-100 min-h-screen">
      <HeaderLanding />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-red-700 mb-8" style={{ fontFamily: 'Inter' }}>Aviso Legal y Términos de Uso</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Sección 1 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>1. Aviso Legal</h2>
            <div className="space-y-4">
              <p>
                Esta plataforma web ha sido desarrollada como parte de un Trabajo Fin de Grado (TFG) de la 
                Escuela Técnica Superior de Ingenierías Informática y de Telecomunicación de la Universidad de Granada. 
                Tiene carácter exclusivamente académico y demostrativo, y no representa ni sustituye a ningún servicio 
                institucional oficial.
              </p>
              <p>
                El autor del proyecto no actúa en representación de la Universidad de Granada, ni existe ninguna 
                relación contractual entre la plataforma y la institución más allá del contexto del desarrollo académico.
              </p>
            </div>
          </section>

          {/* Sección 2 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>2. Condiciones Generales de Uso</h2>
            <div className="space-y-4">
              <p>
                El uso de esta plataforma atribuye a quien accede la condición de <strong>usuario</strong>, 
                y conlleva la aceptación de los siguientes términos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>La plataforma está destinada exclusivamente a fines educativos y de evaluación.</li>
                <li>
                  El contenido mostrado (destinos, asignaturas, equivalencias, acuerdos, etc.) puede estar 
                  basado en datos simulados o ejemplos reales con fines pedagógicos.
                </li>
                <li>No se garantiza la disponibilidad, exactitud o actualización permanente de los contenidos.</li>
                <li>Cualquier mal uso o intento de alteración de los datos queda expresamente prohibido.</li>
              </ul>
              <p>
                Estas condiciones podrán ser modificadas por el autor si fuera necesario durante el desarrollo 
                y evaluación del TFG, lo que se comunicará en la documentación oficial.
              </p>
            </div>
          </section>

          {/* Sección 3 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>3. Contenidos</h2>
            <div className="space-y-4">
              <p>
                La información ofrecida en la plataforma tiene carácter ilustrativo. Su objetivo es representar 
                de forma simulada los procesos administrativos asociados a la movilidad Erasmus de forma accesible 
                y didáctica.
              </p>
              <p>
                El diseño, presentación, navegación y funcionalidades están sujetos a cambios durante el desarrollo 
                del proyecto. No deben interpretarse como procedimientos oficiales ni como sustitutos de las 
                plataformas institucionales reales como la <strong>Sede Electrónica de la Universidad de Granada</strong>.
              </p>
            </div>
          </section>

          {/* Sección 4 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>4. Seguridad</h2>
            <div className="space-y-4">
              <p>
                La plataforma ha sido desarrollada siguiendo buenas prácticas básicas de seguridad informática, 
                conforme a los principios del <strong>Esquema Nacional de Seguridad (ENS)</strong> en su nivel básico. 
                No obstante, al tratarse de un entorno de desarrollo no productivo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No se garantiza la protección frente a ciberataques reales.</li>
                <li>No se han aplicado medidas avanzadas de monitorización o respaldo.</li>
                <li>Cualquier incidente derivado del uso indebido del sistema es responsabilidad del usuario.</li>
              </ul>
            </div>
          </section>

          {/* Sección 5 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>5. Derechos de Propiedad Intelectual e Industrial</h2>
            <div className="space-y-4">
              <p>
                El diseño, código fuente, estructura de datos, interfaces gráficas, documentación y demás elementos 
                integrados en la plataforma son propiedad del autor del TFG, salvo que se indique expresamente otra fuente.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Se permite su reproducción parcial o total con fines docentes o investigativos, 
                  citando adecuadamente su procedencia.
                </li>
                <li>
                  Las imágenes utilizadas provienen de bancos de imágenes gratuitos como Unsplash o Pexels, 
                  o han sido generadas artificialmente sin fines comerciales.
                </li>
              </ul>
            </div>
          </section>

          {/* Sección 6 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>6. Enlaces</h2>
            <p>
              La plataforma puede contener enlaces reales o simulados a sitios externos, tales como universidades 
              asociadas, sedes electrónicas o documentos normativos. El autor no se hace responsable del contenido, 
              accesibilidad o política de privacidad de dichos sitios.
            </p>
          </section>

          {/* Sección 7 */}
          <section>
            <h2 className="text-xl font-semibold text-red-600 mb-4" style={{ fontFamily: 'Inter' }}>7. Actuaciones Prohibidas y Errores</h2>
            <div className="space-y-4">
              <p className="font-medium">Queda prohibido:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Intentar acceder a partes protegidas del sistema mediante ingeniería inversa.</li>
                <li>Introducir código malicioso, manipular la base de datos o falsear información.</li>
                <li>Suplantar roles o eludir validaciones de usuario.</li>
              </ul>
              <p>
                En caso de detectarse errores o mal funcionamiento, se ruega informar al desarrollador del proyecto.
              </p>
            </div>
          </section>

          {/* Footer informativo */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border-l-4 border-red-500 shadow-lg">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Esta plataforma ha sido desarrollada con fines educativos como parte de un TFG 
              en la Universidad de Granada. No representa oficialmente a la UGR ni sustituye los canales oficiales 
              de movilidad internacional. El uso de esta plataforma implica la aceptación de estas condiciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}