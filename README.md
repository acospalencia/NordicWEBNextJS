# Nordictech — Sitio Corporativo

Sitio corporativo de **Nordictech El Salvador S.A. de C.V.** (nordictech-corp.com), empresa de ingeniería y soluciones tecnológicas para seguridad electrónica, protección contra incendios, redes, automatización (BMS) y energía en infraestructura crítica y edificios inteligentes.

## Stack

- **Next.js 16.3.1** (App Router, Turbopack) + **React 19.2.8** + **TypeScript 5**
- **Tailwind CSS v4** vía `@tailwindcss/postcss` — sin `tailwind.config.js` clásico, configuración vía `@import "tailwindcss"` en `app/globals.css`
- **motion** (sucesor de Framer Motion) — animaciones. No usar `framer-motion` (paquete legado)
- **lucide-react** — iconos (única librería de iconos del proyecto)
- **Resend** — envío del formulario de contacto vía Server Action
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
# Resend (https://resend.com) — envío del formulario de contacto
RESEND_API_KEY=

# Opcionales — por defecto usan info@nordictech-corp.com y el remitente sandbox de Resend
# CONTACT_TO_EMAIL=info@nordictech-corp.com
# CONTACT_FROM_EMAIL="Nordictech Web <onboarding@resend.dev>"
```

Sin `RESEND_API_KEY` el formulario de contacto falla de forma controlada (mensaje de error genérico, se loguea en servidor) — no hay mock/fallback silencioso.

## Estructura del proyecto

```
app/
├── page.tsx              # Home
├── layout.tsx            # Layout raíz
├── globals.css           # Estilos globales + import de Tailwind v4
├── actions.ts            # Server Action: sendContactMessage (formulario de contacto vía Resend)
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

## Formulario de contacto

`components/contact-form.tsx` usa el Server Action `sendContactMessage` (`app/actions.ts`) con `useActionState`. Valida nombre, correo, teléfono (8–15 dígitos) y línea de servicio (contra `SERVICE_OPTIONS` de `lib/contact-options.ts`) antes de enviar el correo vía Resend. Sin datos válidos no se llega a llamar a la API.

## Convenciones

- Componentes en TypeScript estricto, sin `any` implícito.
- Estilos: solo utilidades Tailwind v4; evitar CSS custom salvo casos justificados (ej. keyframes complejos en `globals.css`).
- Iconos: siempre `lucide-react`.
- Animaciones: siempre `motion`.
- Idioma del contenido del sitio: **español**, tono corporativo/formal.
- No usar mocks/fallbacks de datos "por si acaso" en flujos que aparenten funcionar sin estarlo (ver `app/actions.ts`: sin `RESEND_API_KEY` falla explícito, no simula envío).

## Roadmap

Fase 2 (futura, no implementada): portal de clientes con backend en **Supabase** (DB + Auth). No agregar dependencias de Supabase hasta confirmar el arranque de esa fase.

## Documentos de referencia

- `docs/Nordictech_Estructura_Sitio_Web.md` — estructura de contenido completa del sitio: secciones, las 13 líneas de negocio, catálogo de proyectos ejecutados, sectores atendidos.
- `design-system/nordictech/MASTER.md` + `pages/landing.md` — recomendaciones de diseño (referencia).
- `CLAUDE.md` — instrucciones de contexto para trabajar con Claude Code en este repo.

## Deploy

Deploy en **Vercel**. Configurar las variables de entorno de Resend (`RESEND_API_KEY`, opcionalmente `CONTACT_TO_EMAIL`/`CONTACT_FROM_EMAIL`) en el proyecto de Vercel antes de publicar, o el formulario de contacto no enviará correos.
