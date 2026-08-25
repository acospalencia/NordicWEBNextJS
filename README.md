# Nordictech — Sitio Corporativo

Sitio corporativo de **Nordictech El Salvador S.A. de C.V.** (nordictech-corp.com), empresa de ingeniería y soluciones tecnológicas para seguridad electrónica, protección contra incendios, redes, automatización (BMS) y energía en infraestructura crítica y edificios inteligentes.

## Stack

- **Next.js 16.3.1** (App Router, Turbopack) + **React 19.2.8** + **TypeScript 5**
- **Tailwind CSS v4** vía `@tailwindcss/postcss` — sin `tailwind.config.js` clásico, configuración vía `@import "tailwindcss"` en `app/globals.css`
- **motion** (sucesor de Framer Motion) — animaciones. No usar `framer-motion` (paquete legado)
- **lucide-react** — iconos (única librería de iconos del proyecto)
- **Endpoints PHP en Bluehost** — formulario de contacto, autenticación, tickets y persistencia del portal
- **ESLint 9** + `eslint-config-next`
- Deploy: **Vercel**

## Requisitos

- Node.js 20+
- npm

## Getting Started

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

`npm run dev` corre `scripts/start-dev.mjs`: libera el puerto 3000 (mata cualquier proceso que lo esté usando) antes de levantar `next dev`, para evitar el típico "port already in use" en desarrollo. Configurable con `PORT`.

### Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (libera puerto + `next dev`) |
| `npm run build` | Build de producción (`next build`) |
| `npm run start` | Sirve el build de producción (`next start`) |
| `npm run lint` | ESLint |

## Variables de entorno

Copiar `.env.local.example` a `.env.local`:

```bash
# Endpoints PHP alojados en Bluehost (contacto y portal de tickets)
PORTAL_API_BASE_URL=https://api.nordictech-corp.com/assets/php
```

El formulario de contacto y el portal requieren la URL pública de los endpoints PHP.
El portal también necesita el secreto de sesión indicado en `.env.local.example`.
Vercel no se conecta a MySQL: todas las operaciones pasan por Bluehost mediante
`PORTAL_API_BASE_URL`.

Sin `PORTAL_API_BASE_URL`, tanto el formulario de contacto como el portal fallan de
forma controlada; no hay mocks ni fallbacks que simulen un envío exitoso.

## Estructura del proyecto

```
app/
├── page.tsx              # Home
├── layout.tsx            # Layout raíz
├── globals.css           # Estilos globales + import de Tailwind v4
├── actions.ts            # Server Action: sendContactMessage (formulario vía endpoint PHP)
├── nosotros/page.tsx     # Página "Nosotros"
└── servicios/
    ├── page.tsx           # Listado de líneas de negocio
    └── [slug]/page.tsx    # Detalle de cada servicio (dinámico, ver lib/services.ts)

components/                # Secciones de página y componentes compartidos
├── hero.tsx, about.tsx, business-lines.tsx, services-grid.tsx,
│   services-orbit.tsx, featured-projects.tsx, alliances-section.tsx,
│   logo-cloud.tsx, cta-section.tsx, contact.tsx, contact-form.tsx,
│   footer.tsx, navbar.tsx, preloader.tsx
├── FloatingWhatsApp.tsx / WhatsAppLink.tsx   # Widget y enlaces de WhatsApp
└── ui/                    # Primitivas de UI (count-up, encrypted-text, reveal, resizable-navbar, hover-glow...)

lib/
├── services.ts            # Catálogo de líneas de negocio (fuente de verdad de /servicios)
├── contact-options.ts     # Opciones del select del formulario de contacto
└── utils.ts

hooks/
└── use-outside-click.ts

design-system/nordictech/  # Recomendaciones de diseño generadas con skill ui-ux-pro-max (referencia, no adoptadas 1:1)
docs/
├── PRD.md                                  # Alcance, páginas, fases, contexto de marca (si existe)
├── Nordictech_Estructura_Sitio_Web.md       # Estructura de contenido completa del sitio (secciones, servicios, proyectos, sectores)
└── Binder cv nordictech.pdf                 # Material fuente (portafolio/perfil de empresa)
```

Import alias: `@/*` → raíz del proyecto (ver `tsconfig.json`).

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Home — hero, líneas de negocio, proyectos destacados, alianzas, contacto |
| `/nosotros` | Perfil empresarial, misión/visión, valores, alianzas |
| `/servicios` | Listado de las líneas de negocio |
| `/servicios/[slug]` | Detalle de cada línea de negocio (slugs definidos en `lib/services.ts`) |
| `/portal/iniciar-sesion` | Inicio de sesión del portal |
| `/portal/registro` | Solicitud de cuenta con aprobación manual |
| `/portal/recuperar` | Recuperación de contraseña por código |
| `/portal` | Panel del cliente y creación/seguimiento de tickets |
| `/portal/tecnico` | Panel de bitácora para técnicos |
| `/portal/administracion` | Asignación y gestión administrativa de tickets |
| `/portal/administracion/sistema` | Usuarios, roles, tickets y correos |

## Portal de tickets

El portal conserva los roles de la versión PHP: cliente (`1`), técnico (`2`) y
administrador (`3`). Next.js funciona como interfaz y puente seguro hacia los endpoints
de Bluehost; conserva `PHPSESSID` en una cookie HTTP-only del dominio desplegado y no
expone las credenciales de MySQL. Las cuentas, recuperación, tickets, asignaciones,
bitácoras, estados y correos continúan siendo procesados por el backend PHP existente.

## Formulario de contacto

`components/contact-form.tsx` usa el Server Action `sendContactMessage` (`app/actions.ts`)
con `useActionState`. Valida nombre, correo, teléfono (8–15 dígitos) y línea de servicio
(contra `SERVICE_OPTIONS` de `lib/contact-options.ts`) antes de llamar a `enviar.php`.
La empresa, el teléfono y la línea de servicio se agregan al cuerpo del mensaje para que
el PHP existente lo envíe directamente mediante `mail()`. Sin datos válidos no se llama
al endpoint.

## Convenciones

- Componentes en TypeScript estricto, sin `any` implícito.
- Estilos: solo utilidades Tailwind v4; evitar CSS custom salvo casos justificados (ej. keyframes complejos en `globals.css`).
- Iconos: siempre `lucide-react`.
- Animaciones: siempre `motion`.
- Idioma del contenido del sitio: **español**, tono corporativo/formal.
- No usar mocks/fallbacks de datos "por si acaso" en flujos que aparenten funcionar sin estarlo (ver `app/actions.ts`: si el endpoint PHP falla, no simula el envío).

## Roadmap

Fase 2 implementada: portal de clientes, técnicos y administración consumiendo los
endpoints PHP existentes en Bluehost. La aplicación de Vercel no contiene credenciales
ni conexiones directas a la base MySQL.

## Documentos de referencia

- `docs/Nordictech_Estructura_Sitio_Web.md` — estructura de contenido completa del sitio: secciones, las 13 líneas de negocio, catálogo de proyectos ejecutados, sectores atendidos.
- `design-system/nordictech/MASTER.md` + `pages/landing.md` — recomendaciones de diseño (referencia).
- `CLAUDE.md` — instrucciones de contexto para trabajar con Claude Code en este repo.

## Deploy

Deploy en **Vercel**. Configurar `PORTAL_API_BASE_URL` con la ruta pública de los
endpoints PHP de Bluehost. El formulario utiliza `enviar.php`, y el portal requiere
además las variables de sesión documentadas en `.env.local.example`.
