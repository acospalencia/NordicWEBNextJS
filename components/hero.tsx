"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { PRELOADER_DURATION_MS, hasPreloaderPlayed } from "@/components/preloader";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [skipDelay] = useState(hasPreloaderPlayed);
  const startDelay = reduceMotion || skipDelay ? 0 : PRELOADER_DURATION_MS / 1000 - 0.3;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: startDelay },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.3, ease: EASE } },
  };

  return (
    <section id="hero" className="relative flex min-h-dvh flex-col overflow-hidden bg-[#0B1120] text-[#F5F7FA]">
      <Image
        src="/Hero_Red.webp"
        alt="Centro de monitoreo de seguridad Nordictech"
        fill
        priority
        className="object-cover object-[78%_38%] sm:object-center"
        sizes="100vw"
      />

      {/* Mobile: texto cubre casi todo el ancho, así que el degradado
          direccional de desktop dejaría la foto casi tapada o mal
          recortada. Se usa un velo uniforme en su lugar. */}
      <div
        className="absolute inset-0 sm:hidden"
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background: "rgba(11,17,32,0.65)",
        }}
      />

      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maskImage: "linear-gradient(90deg, black 0%, black 40%, transparent 68%)",
          WebkitMaskImage: "linear-gradient(90deg, black 0%, black 40%, transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, #0B1120 0%, rgba(11,17,32,0.85) 30%, rgba(11,17,32,0.35) 55%, rgba(11,17,32,0.1) 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(0deg, #0B1120 0%, transparent 25%)" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-28 pb-[120px] sm:px-10 sm:pt-32 sm:pb-[160px] lg:pt-24 lg:pb-[180px] lg:pl-14"
      >
        <motion.span
          variants={item}
          className="inline-flex w-fit items-center border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6] backdrop-blur-sm"
        >
          Integración de infraestructura crítica
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
        >
          Infraestructura robusta{" "}
          <span className="text-[#94A3B8]">e ingeniería global.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-base leading-7 text-[#94A3B8] sm:text-lg"
        >
          Diseñamos, implementamos y damos mantenimiento a sistemas integrados de
          seguridad, automatización y energía para edificios inteligentes e
          infraestructura crítica en El Salvador y la región.
        </motion.p>

        <motion.div variants={item} className="mt-5">
          <LayoutTextFlip
            text="Soluciones que"
            words={["conectan", "protegen", "evolucionan"]}
            className="text-base font-medium text-[#F5F7FA]/70 sm:text-lg"
            wordClassName="bg-white/10 text-white ring-[#3B82F6]/60 backdrop-blur-md"
          />
        </motion.div>

        <motion.div variants={item} className="mt-[3.25rem] flex flex-col gap-4 sm:flex-row">
          <a
            href="#contacto"
            className="inline-flex items-center justify-center gap-2 rounded bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#60A5FA] active:scale-[0.97]"
          >
            Solicitar cotización
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#servicios"
            className="inline-flex items-center justify-center gap-2 rounded border border-white/15 px-6 py-3 text-sm font-semibold text-[#F5F7FA] transition-[border-color,transform] duration-150 hover:border-white/30 active:scale-[0.97]"
          >
            Ver servicios
          </a>
        </motion.div>
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-[100px] w-full sm:h-[140px] lg:h-[160px]"
        >
          <defs>
            <filter id="hero-curve-glow" x="-20%" y="-300%" width="140%" height="700%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <path d="M0,118 C420,132 940,62 1440,14 L1440,160 L0,160 Z" fill="#07111F" />
          <path
            d="M0,118 C420,132 940,62 1440,14"
            fill="none"
            stroke="#1677FF"
            strokeOpacity="0.35"
            strokeWidth="6"
            filter="url(#hero-curve-glow)"
          />
          <path
            d="M0,118 C420,132 940,62 1440,14"
            fill="none"
            stroke="#1685FF"
            strokeOpacity="0.75"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </section>
  );
}
