import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServicesOrbitCarousel } from "@/components/services-orbit";
import { Reveal } from "@/components/ui/reveal";

const FEATURED_SLUGS = [
  "seguridad-videovigilancia",
  "deteccion-supresion-incendios",
  "control-acceso-biometria",
  "automatizacion-bms",
  "cableado-fibra-optica",
  "redes-gpon",
];

export function BusinessLines() {
  return (
    <section id="servicios" className="scroll-mt-24 bg-[#050D18] px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Líneas de negocio
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
            Soluciones integrales para infraestructura crítica
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#94A3B8]">
            Trece líneas de negocio bajo un mismo integrador — diseño, implementación y
            mantenimiento de extremo a extremo.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <ServicesOrbitCarousel slugs={FEATURED_SLUGS} />
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/servicios"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
          >
            Ver las 13 líneas de negocio
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
