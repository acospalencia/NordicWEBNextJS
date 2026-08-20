"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import {
  Plane,
  Landmark,
  Building2,
  Stethoscope,
  Anchor,
  ShieldAlert,
  ArrowRight,
  X,
} from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, EASE } from "@/components/ui/reveal";
import { HoverGlow } from "@/components/ui/hover-glow";

// Cambiar a `false` para volver a mostrar y habilitar las cards de clientes.
const BLUR_CLIENT_PROJECT_CARDS = true;

const PROJECTS = [
  {
    icon: Plane,
    image: "/Aeropuerto.jpg",
    sector: "Aeroportuario",
    name: "Aeropuerto Internacional Monseñor Óscar Arnulfo Romero",
    impact:
      "Unificación de 600 cámaras y control de acceso CCURE9000 (+4,500 usuarios) sobre plataforma Genetec, con video wall y centro de operaciones.",
  },
  {
    icon: Landmark,
    image: "/Asamblea-legislativa.jpg",
    sector: "Gobierno",
    name: "Asamblea Legislativa de El Salvador",
    impact:
      "Remodelación de centro de monitoreo, video wall y servidores de reconocimiento facial y lectura de placas (LPR).",
  },
  {
    icon: Building2,
    image: "/bambu.webp",
    sector: "Comercial",
    name: "Bambú City Center, Zona Rosa",
    impact:
      "180 cámaras, 64 puertas de control de acceso y automatización BMS Metasys integrada con Johnson Controls.",
  },
  {
    icon: Stethoscope,
    image: "/rosales.jpg",
    sector: "Salud",
    name: "Hospital Rosales — Centro de Medicina Nuclear",
    impact:
      "Videovigilancia, telefonía IP, cableado Cat6 y enlaces de fibra óptica para el hospital nacional de referencia.",
  },
  {
    icon: Anchor,
    image: "/acajutla.jpg",
    sector: "Portuario",
    name: "Puerto de Acajutla — CEPA / Yilport",
    impact:
      "Unificación de CCTV y control de acceso sobre Genetec, red GPON y 20 km de fibra óptica para intercomunicación.",
  },
  {
    icon: ShieldAlert,
    image: "/fiscalia.jpg",
    sector: "Gobierno",
    name: "Fiscalía General de la República",
    impact:
      "Data center con supresión de incendios, 1.6 PB de almacenamiento de video y automatización BMS Metasys.",
  },
];

export function FeaturedProjects() {
  const [active, setActive] = useState<(typeof PROJECTS)[number] | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.45, bounce: 0.12 };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      // layout va scoping explícito: sin esto, el morph de cierre hereda la
      // curva EASE del reveal y se resuelve en ~150ms en vez del spring.
      transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE, layout: layoutTransition },
    },
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }

    if (active) {
      // Compensar el ancho del scrollbar: si desaparece sin relleno, la página
      // se ensancha y el destino del morph se desplaza a mitad de animación.
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <section id="proyectos" className="scroll-mt-24 bg-[#07111F] px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Proyectos destacados
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
            Infraestructura crítica que ya opera con Nordictech
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#94A3B8]">
            Gobierno, aeropuertos, puertos, salud y comercial confían su seguridad e
            infraestructura a nuestro equipo.
          </p>
        </Reveal>

        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 h-full w-full bg-[#0B1120]/60 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active ? (
            <div className="fixed inset-0 z-50 grid place-items-center p-4">
              <motion.button
                key={`close-${active.name}-${id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-[#0B1120] shadow-md lg:hidden"
                onClick={() => setActive(null)}
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </motion.button>
              <motion.div
                layoutId={`card-${active.name}-${id}`}
                transition={{ layout: layoutTransition }}
                ref={ref}
                role="dialog"
                aria-modal="true"
                className="flex h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A1626] md:h-fit md:max-h-[90%]"
              >
                <motion.div
                  layoutId={`icon-${active.name}-${id}`}
                  transition={{ layout: layoutTransition }}
                  className="relative h-56 overflow-hidden bg-[#0B1120]"
                >
                  <Image
                    src={active.image}
                    alt={active.name}
                    fill
                    sizes="(min-width: 768px) 512px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/70 via-[#0B1120]/10 to-transparent" />
                  <div className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <active.icon className="size-4 text-white" strokeWidth={1.5} />
                  </div>
                </motion.div>

                <div className="flex flex-1 flex-col p-6">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.1 } }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3B82F6]"
                  >
                    {active.sector}
                  </motion.span>
                  <motion.h3
                    layoutId={`title-${active.name}-${id}`}
                    transition={{ layout: layoutTransition }}
                    className="mt-2 text-xl font-semibold leading-snug text-[#F5F7FA]"
                  >
                    {active.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.1 } }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    className="mt-3 text-sm leading-6 text-[#94A3B8]"
                  >
                    {active.impact}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  >
                    <Link
                      href="/#contacto"
                      onClick={() => setActive(null)}
                      className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#60A5FA]"
                    >
                      Solicitar cotización similar
                      <ArrowRight className="size-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        <RevealGroup
          stagger={0.06}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {PROJECTS.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.name}
                variants={cardVariants}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
              >
              <motion.button
                layoutId={`card-${project.name}-${id}`}
                transition={{ layout: layoutTransition }}
                onClick={() => {
                  if (!BLUR_CLIENT_PROJECT_CARDS) setActive(project);
                }}
                disabled={BLUR_CLIENT_PROJECT_CARDS}
                aria-label={
                  BLUR_CLIENT_PROJECT_CARDS
                    ? "Proyecto temporalmente oculto"
                    : `Ver proyecto: ${project.name}`
                }
                className={cn(
                  "group relative flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-lg border border-white/10 bg-[#0A1626] p-6 text-left transition-[border-color] duration-150 hover:border-[#3B82F6]/40",
                  BLUR_CLIENT_PROJECT_CARDS && "cursor-default hover:border-white/10"
                )}
              >
                <HoverGlow
                  active={hoveredIndex === index}
                  layoutId={`projects-glow-${id}`}
                  className="inset-0 rounded-lg"
                />
                <motion.div
                  layoutId={`icon-${project.name}-${id}`}
                  transition={{ layout: layoutTransition }}
                  aria-hidden={BLUR_CLIENT_PROJECT_CARDS}
                  className={cn(
                    "absolute inset-0 [mask-image:linear-gradient(to_bottom,black_22%,rgba(0,0,0,0.8)_38%,rgba(0,0,0,0.5)_52%,rgba(0,0,0,0.25)_63%,rgba(0,0,0,0.08)_72%,transparent_80%)]",
                    BLUR_CLIENT_PROJECT_CARDS && "scale-110 blur-2xl"
                  )}
                >
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <Icon className="size-4 text-white" strokeWidth={1.5} />
                  </div>
                </motion.div>

                <div
                  aria-hidden={BLUR_CLIENT_PROJECT_CARDS}
                  className={cn(
                    "relative",
                    BLUR_CLIENT_PROJECT_CARDS && "opacity-20 blur-2xl"
                  )}
                >
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#60A5FA]">
                    {project.sector}
                  </span>
                  <motion.h3
                    layoutId={`title-${project.name}-${id}`}
                    transition={{ layout: layoutTransition }}
                    className="mt-1.5 text-lg font-semibold leading-snug text-white"
                  >
                    {project.name}
                  </motion.h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#60A5FA]">
                    Ver proyecto
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>

                {BLUR_CLIENT_PROJECT_CARDS && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-20 rounded-lg bg-[#07111F]/55 backdrop-blur-2xl"
                  />
                )}
              </motion.button>
              </motion.div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
