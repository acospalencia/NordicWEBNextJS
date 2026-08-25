import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Política de Privacidad de Asistencia NORDICTECH",
  description:
    "Política de privacidad de la aplicación Asistencia NORDICTECH para usuarios autorizados.",
};

const linkClass =
  "font-medium text-[#60A5FA] underline decoration-[#3B82F6]/40 underline-offset-4 transition-colors hover:text-[#93C5FD]";

function PolicySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`section-${number}`} className="scroll-mt-8">
      <h2
        id={`section-${number}`}
        className="text-xl font-semibold tracking-tight text-[#F5F7FA] sm:text-2xl"
      >
        {number}. {title}
      </h2>
      <div className="mt-5 space-y-5 text-[15px] leading-7 text-[#CBD5E1] sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}

function PolicySubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-[#E2E8F0] sm:text-lg">{title}</h3>
      <div className="mt-3 space-y-4">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 pl-5 marker:text-[#3B82F6]">
      {items.map((item) => (
        <li key={item} className="list-disc pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#07111F] px-5 py-12 text-[#F5F7FA] sm:px-8 sm:py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.16),transparent_65%)]"
      />

      <article className="relative mx-auto max-w-4xl">
        <header className="border-b border-white/10 pb-10 sm:pb-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
            Asistencia NORDICTECH
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Política de Privacidad de Asistencia NORDICTECH
          </h1>

          <dl className="mt-7 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
              <dt className="sr-only">Última actualización</dt>
              <dd className="text-[#CBD5E1]">Última actualización: 25 de agosto de 2026</dd>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
              <dt className="sr-only">Versión</dt>
              <dd className="text-[#CBD5E1]">Versión: 1.0</dd>
            </div>
          </dl>

          <div className="mt-8 space-y-4 text-base leading-8 text-[#CBD5E1]">
            <p>
              NORDICTECH EL SALVADOR S.A. DE C.V., en adelante “NORDICTECH”, es responsable
              del tratamiento de la información recopilada mediante la aplicación{" "}
              <strong className="font-semibold text-[#F5F7FA]">Asistencia NORDICTECH</strong>.
            </p>
            <p>
              Esta política explica qué información recopilamos, cómo la utilizamos, con
              quién podemos compartirla y qué opciones tienen los usuarios sobre sus datos.
            </p>
          </div>
        </header>

        <div className="mt-12 space-y-14 sm:mt-14 sm:space-y-16">
          <PolicySection number="1" title="Alcance de esta política">
            <p>
              Esta política aplica a la aplicación Asistencia NORDICTECH, sus servicios
              asociados y la comunicación entre la aplicación y los servidores de NORDICTECH.
            </p>
            <p>
              La aplicación está diseñada para empleados, técnicos, supervisores,
              administradores y demás colaboradores autorizados por NORDICTECH.
            </p>
          </PolicySection>

          <PolicySection number="2" title="Información que recopilamos">
            <PolicySubsection title="2.1 Información de identificación y cuenta">
              <p>
                Cuando un usuario crea una cuenta o es registrado en el sistema, podemos
                recopilar:
              </p>
              <BulletList
                items={[
                  "Nombres y apellidos.",
                  "Documento Único de Identidad (DUI).",
                  "Número de teléfono.",
                  "Fecha de nacimiento.",
                  "Dirección de correo electrónico.",
                  "Nombre de usuario.",
                  "Contraseña.",
                  "Rol, cargo o perfil asignado.",
                  "Estado de la cuenta.",
                  "Supervisor asignado.",
                  "Permisos y funciones habilitadas.",
                ]}
              />
              <p>
                Las contraseñas se almacenan mediante mecanismos de protección criptográfica
                y no se conservan como texto visible.
              </p>
            </PolicySubsection>

            <PolicySubsection title="2.2 Información de asistencia y actividad laboral">
              <p>La aplicación puede registrar y procesar:</p>
              <BulletList
                items={[
                  "Fechas y horas de entrada y salida.",
                  "Horarios laborales y turnos asignados.",
                  "Turnos diurnos, nocturnos y de descanso.",
                  "Calendarios de turnos del personal Bambu.",
                  "Llegadas tardías y salidas tempranas.",
                  "Ausencias, permisos, incapacidades y días sin marcación.",
                  "Comentarios o motivos relacionados con una marcación.",
                  "Horas extras generadas antes de la entrada o después de la salida.",
                  "Horas extras aprobadas y nombre del supervisor que realizó la aprobación.",
                  "Viáticos registrados.",
                  "Misiones, actividades o eventos de jornada.",
                  "Mensajes, comentarios, descripciones y evidencias escritas relacionadas con una actividad.",
                  "Cambios o correcciones realizados por administradores.",
                  "Reportes de asistencia y actividad laboral.",
                ]}
              />
              <p>
                Esta información puede ser consultada por supervisores o administradores
                autorizados según su rol y responsabilidades.
              </p>
            </PolicySubsection>

            <PolicySubsection title="2.3 Información de ubicación">
              <p>
                La aplicación puede solicitar acceso a la ubicación aproximada y precisa del
                dispositivo para:
              </p>
              <BulletList
                items={[
                  "Registrar una entrada o salida.",
                  "Comprobar que el usuario se encuentra dentro de una ubicación autorizada.",
                  "Calcular la distancia entre el usuario y el lugar de trabajo.",
                  "Registrar un viático.",
                  "Iniciar o finalizar una misión o actividad de jornada.",
                  "Mostrar la ubicación registrada en un mapa.",
                ]}
              />
              <p>
                La aplicación obtiene la ubicación cuando el usuario ejecuta una de estas
                acciones. <strong className="font-semibold text-[#F5F7FA]">Asistencia NORDICTECH no solicita permiso de ubicación en segundo plano ni realiza seguimiento continuo del usuario cuando la aplicación no está en uso.</strong>
              </p>
              <p>
                Si el usuario visualiza el mapa incluido en la pantalla de marcación, las
                coordenadas mostradas y determinada información técnica de conexión pueden ser
                procesadas por Google Maps.
              </p>
              <p>
                Si se rechaza el permiso de ubicación, algunas funciones, especialmente las
                marcaciones y los registros que requieren validación geográfica, no estarán
                disponibles.
              </p>
            </PolicySubsection>

            <PolicySubsection title="2.4 Información técnica y del dispositivo">
              <p>
                Para mantener la seguridad, enviar notificaciones y solucionar errores,
                podemos recopilar:
              </p>
              <BulletList
                items={[
                  "Plataforma y sistema operativo utilizado.",
                  "Fabricante y modelo del dispositivo.",
                  "Versión de la aplicación.",
                  "Identificador o token de notificaciones del dispositivo.",
                  "Dirección IP y datos básicos de conexión.",
                  "Pantalla u operación donde ocurrió un error.",
                  "Mensaje, detalle y código del error.",
                  "Dirección del servicio consultado y estado de la respuesta.",
                  "Fecha y hora del incidente.",
                ]}
              />
              <p>
                La aplicación no utiliza identificadores publicitarios ni contiene redes de
                anuncios.
              </p>
            </PolicySubsection>

            <PolicySubsection title="2.5 Comunicaciones y notificaciones">
              <p>Podemos tratar información relacionada con:</p>
              <BulletList
                items={[
                  "Recuperación o restablecimiento de contraseña.",
                  "Códigos de verificación enviados por correo electrónico.",
                  "Recordatorios de entrada o salida.",
                  "Avisos de turnos.",
                  "Notificaciones de misiones o actividades.",
                  "Avisos de asistencia.",
                  "Solicitudes de aprobación de horas extras.",
                  "Comunicaciones entre técnicos, supervisores y administradores.",
                ]}
              />
            </PolicySubsection>

            <PolicySubsection title="2.6 Archivos generados">
              <p>
                Los usuarios autorizados pueden generar reportes en formatos como PDF o Excel.
                Estos archivos pueden incluir nombres, marcaciones, horarios, comentarios,
                horas extras, misiones, viáticos y demás información laboral.
              </p>
              <p>
                Cuando un reporte se guarda o comparte desde el dispositivo, su protección y
                uso también dependerán de las configuraciones del dispositivo y de las
                aplicaciones elegidas por el usuario para abrirlo o compartirlo.
              </p>
            </PolicySubsection>
          </PolicySection>

          <PolicySection number="3" title="Cómo obtenemos la información">
            <p>La información puede ser proporcionada:</p>
            <BulletList
              items={[
                "Directamente por el usuario al registrarse o utilizar la aplicación.",
                "Por administradores o supervisores autorizados.",
                "Automáticamente cuando el usuario utiliza funciones de marcación, notificación o diagnóstico.",
                "Desde el dispositivo, únicamente después de obtener los permisos correspondientes.",
                "A partir de los horarios, roles y calendarios configurados por NORDICTECH.",
              ]}
            />
          </PolicySection>

          <PolicySection number="4" title="Finalidades del tratamiento">
            <p>Utilizamos la información para:</p>
            <BulletList
              items={[
                "Crear, autenticar y administrar cuentas.",
                "Controlar el acceso según el rol del usuario.",
                "Registrar y validar la asistencia.",
                "Confirmar que las marcaciones se realicen en lugares autorizados.",
                "Gestionar horarios, turnos y calendarios Bambu.",
                "Determinar si corresponde permitir una marcación.",
                "Calcular llegadas tardías, salidas tempranas y horas extras.",
                "Permitir la revisión y aprobación de horas extras.",
                "Gestionar viáticos, misiones y actividades laborales.",
                "Generar reportes administrativos y de supervisión.",
                "Enviar recordatorios y notificaciones necesarias.",
                "Atender solicitudes de recuperación de contraseña.",
                "Investigar errores y mejorar la estabilidad y seguridad.",
                "Prevenir accesos no autorizados, fraude o abuso.",
                "Cumplir obligaciones laborales, contractuales, administrativas o legales aplicables.",
              ]}
            />
            <p>
              No utilizamos la información para publicidad personalizada ni vendemos los datos
              personales de los usuarios.
            </p>
          </PolicySection>

          <PolicySection number="5" title="Procesamiento automático">
            <p>
              La aplicación utiliza reglas configuradas por NORDICTECH para clasificar
              automáticamente ciertas marcaciones, incluyendo:
            </p>
            <BulletList
              items={[
                "Llegadas tardías.",
                "Salidas tempranas.",
                "Horas extras potenciales.",
                "Días sin marcación.",
                "Turnos diurnos o nocturnos.",
                "Descansos asignados.",
                "Disponibilidad para realizar una marcación.",
              ]}
            />
            <p>
              Estas clasificaciones se basan en el horario, rol y calendario asignado. Los
              administradores y supervisores autorizados pueden revisar, corregir o aprobar
              determinados registros.
            </p>
          </PolicySection>

          <PolicySection number="6" title="Permisos utilizados por la aplicación">
            <p>La aplicación puede solicitar:</p>
            <ul className="space-y-3 pl-5 marker:text-[#3B82F6]">
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Ubicación:</strong> para
                validar marcaciones, viáticos y actividades.
              </li>
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Notificaciones:</strong> para
                enviar recordatorios y avisos relacionados con el trabajo.
              </li>
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Internet y estado de red:</strong>{" "}
                para comunicarse con los servidores de NORDICTECH.
              </li>
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Almacenamiento:</strong> en
                versiones antiguas de Android, para guardar reportes o paquetes de actualización
                en la carpeta de descargas.
              </li>
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Instalación de paquetes:</strong>{" "}
                solamente cuando el usuario decide instalar una actualización autorizada de la
                aplicación desde los servidores oficiales de NORDICTECH.
              </li>
            </ul>
            <p>
              El permiso para instalar actualizaciones no permite que NORDICTECH consulte otras
              aplicaciones instaladas ni que instale una actualización sin intervención del
              usuario.
            </p>
          </PolicySection>

          <PolicySection number="7" title="Servicios y terceros">
            <p>
              Para operar determinadas funciones podemos utilizar proveedores tecnológicos,
              entre ellos:
            </p>
            <ul className="space-y-3 pl-5 marker:text-[#3B82F6]">
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Google Firebase Cloud Messaging</strong>,
                para enviar notificaciones. Este servicio puede procesar un identificador de
                instalación y datos técnicos necesarios para entregar las notificaciones.
              </li>
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Google Maps</strong>, para mostrar
                en un mapa la ubicación utilizada durante una marcación.
              </li>
              <li className="list-disc pl-1">
                <strong className="font-semibold text-[#F5F7FA]">Google Play</strong>, para
                distribuir y actualizar la aplicación.
              </li>
              <li className="list-disc pl-1">
                Proveedores autorizados de alojamiento, infraestructura, bases de datos y correo
                electrónico.
              </li>
              <li className="list-disc pl-1">
                Proveedores técnicos contratados para mantenimiento o soporte.
              </li>
            </ul>
            <p>
              Estos proveedores podrán procesar únicamente la información necesaria para prestar
              sus servicios, conforme a sus condiciones y medidas de seguridad.
            </p>
            <p>
              Puede consultar la{" "}
              <a
                href="https://policies.google.com/privacy?hl=es"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                Política de Privacidad de Google
              </a>{" "}
              y la{" "}
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                información de privacidad de Firebase
              </a>
              .
            </p>
            <p>
              También podremos comunicar información a autoridades competentes cuando exista una
              obligación legal, orden válida o necesidad de proteger los derechos y la seguridad
              de NORDICTECH o de terceros.
            </p>
          </PolicySection>

          <PolicySection number="8" title="Transferencias y procesamiento internacional">
            <p>
              Algunos proveedores, especialmente los servicios de Google, pueden procesar o
              almacenar información en países diferentes a El Salvador.
            </p>
            <p>
              Cuando corresponda, NORDICTECH procurará que estos proveedores mantengan medidas
              contractuales, técnicas y organizativas adecuadas para proteger la información.
            </p>
          </PolicySection>

          <PolicySection number="9" title="Conservación de la información">
            <p>
              La información se conserva durante el tiempo necesario para cumplir las finalidades
              descritas en esta política.
            </p>
            <p>En particular:</p>
            <BulletList
              items={[
                "Los datos de la cuenta se conservan mientras la cuenta permanezca activa y durante el tiempo necesario después de su desactivación.",
                "Los registros de asistencia, horarios, turnos, horas extras, viáticos, misiones y actividades pueden conservarse para fines laborales, administrativos, de auditoría, seguridad y cumplimiento legal.",
                "Los tokens de notificaciones se conservan mientras el dispositivo esté registrado o hasta que sean reemplazados, desactivados o eliminados.",
                "Los códigos de recuperación de contraseña tienen una vigencia limitada y dejan de ser válidos después del plazo establecido.",
                "Los reportes de errores se conservan durante el tiempo necesario para investigar y corregir problemas técnicos.",
                "Las copias de respaldo pueden conservarse temporalmente hasta completar su ciclo normal de eliminación.",
              ]}
            />
            <p>
              Cuando la información ya no sea necesaria, será eliminada, anonimizada o bloqueada
              de manera segura, salvo que exista una obligación legítima de conservarla.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Seguridad">
            <p>
              NORDICTECH aplica medidas razonables para proteger la información, incluyendo:
            </p>
            <BulletList
              items={[
                "Comunicación cifrada mediante HTTPS.",
                "Contraseñas protegidas criptográficamente.",
                "Tokens de autenticación.",
                "Almacenamiento seguro de la sesión en el dispositivo.",
                "Controles de acceso basados en roles y permisos.",
                "Restricciones para supervisores y administradores.",
                "Límites de solicitudes y mecanismos contra accesos abusivos.",
                "Validaciones de integridad para actualizaciones.",
                "Registro y revisión de errores técnicos.",
              ]}
            />
            <p>
              Ningún sistema puede garantizar seguridad absoluta. Por ello, los usuarios también
              deben proteger sus credenciales, mantener actualizado su dispositivo y no compartir
              su cuenta.
            </p>
          </PolicySection>

          <PolicySection number="11" title="Derechos de los usuarios">
            <p>El usuario puede solicitar:</p>
            <BulletList
              items={[
                "Acceso a sus datos personales.",
                "Corrección o actualización de información incorrecta.",
                "Explicación sobre el uso de sus datos.",
                "Eliminación de su cuenta y de los datos asociados.",
                "Restricción u oposición a ciertos tratamientos, cuando corresponda.",
                "Retiro de permisos concedidos desde el dispositivo.",
                "Información sobre los datos que deban conservarse por obligaciones legítimas.",
              ]}
            />

            <div className="rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/[0.07] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-[#F5F7FA]">
                Solicitud de eliminación de cuenta y datos
              </h3>
              <div className="mt-4 space-y-4">
                <p>
                  Para solicitar la eliminación de una cuenta de Asistencia NORDICTECH, el usuario
                  debe enviar un correo a:
                </p>
                <p>
                  <a href="mailto:info@nordictech-corp.com" className={linkClass}>
                    info@nordictech-corp.com
                  </a>
                </p>
                <p>El asunto del correo debe ser:</p>
                <p>
                  <strong className="font-semibold text-[#F5F7FA]">
                    “Solicitud de eliminación de cuenta – Asistencia NORDICTECH”
                  </strong>
                </p>
                <p>
                  La solicitud debe incluir el nombre completo y el nombre de usuario o correo
                  asociado a la cuenta. NORDICTECH podrá solicitar información adicional únicamente
                  para verificar la identidad del solicitante.
                </p>
                <p>
                  Una vez verificada la solicitud, se eliminará la cuenta y la información asociada
                  que no deba conservarse por obligaciones laborales, legales, administrativas, de
                  seguridad, prevención de fraude o auditoría.
                </p>
                <p>
                  Cuando sea necesario conservar determinada información, se informará al usuario
                  sobre las categorías de datos conservadas y el motivo correspondiente. La simple
                  desactivación de una cuenta no se considerará como cumplimiento de una solicitud
                  de eliminación.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection number="12" title="Retiro de permisos">
            <p>
              El usuario puede retirar los permisos de ubicación o notificaciones desde la
              configuración de Android.
            </p>
            <p>
              Retirar un permiso no elimina automáticamente la información recopilada
              anteriormente. Además, algunas funciones podrían dejar de funcionar cuando el
              permiso sea necesario para realizar la operación solicitada.
            </p>
          </PolicySection>

          <PolicySection number="13" title="Menores de edad">
            <p>
              Asistencia NORDICTECH está destinada exclusivamente a personas mayores de 18 años y
              a usuarios autorizados dentro de un contexto laboral u organizacional.
            </p>
            <p>
              No recopilamos intencionalmente información de menores de edad. Si se identifica una
              cuenta creada por un menor sin autorización válida, podrá ser eliminada.
            </p>
          </PolicySection>

          <PolicySection number="14" title="Cambios en esta política">
            <p>
              Podemos actualizar esta política cuando cambien las funciones de la aplicación, las
              prácticas de tratamiento o los requisitos legales.
            </p>
            <p>
              La fecha de la última actualización aparecerá al inicio del documento. Los cambios
              importantes podrán comunicarse mediante la aplicación, el sitio web o una
              notificación.
            </p>
          </PolicySection>

          <PolicySection number="15" title="Contacto">
            <p>Para preguntas, solicitudes o inquietudes relacionadas con privacidad:</p>
            <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-[11rem_1fr] sm:p-6">
              <dt className="font-semibold text-[#E2E8F0]">Responsable</dt>
              <dd>NORDICTECH EL SALVADOR S.A. DE C.V.</dd>
              <dt className="font-semibold text-[#E2E8F0]">Aplicación</dt>
              <dd>Asistencia NORDICTECH</dd>
              <dt className="font-semibold text-[#E2E8F0]">Correo de privacidad</dt>
              <dd>
                <a href="mailto:info@nordictech-corp.com" className={linkClass}>
                  info@nordictech-corp.com
                </a>
              </dd>
              <dt className="font-semibold text-[#E2E8F0]">Correo de soporte</dt>
              <dd>
                <a href="mailto:soporte@nordictech-corp.com" className={linkClass}>
                  soporte@nordictech-corp.com
                </a>
              </dd>
              <dt className="font-semibold text-[#E2E8F0]">Sitio web</dt>
              <dd>https://nordictech-corp.com/</dd>
              <dt className="font-semibold text-[#E2E8F0]">País</dt>
              <dd>El Salvador</dd>
            </dl>
          </PolicySection>
        </div>
      </article>
    </main>
  );
}
