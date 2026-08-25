import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServicesGrid } from "@/components/services-grid";
import { Reveal } from "@/components/ui/reveal";
import { SERVICES } from "@/lib/services";

export function BusinessLines() {
  return (
    <section id="servicios" className="scroll-mt-24 bg-[#050D18] px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Servicios
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
            Ingeniería e integración tecnológica para infraestructura crítica
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#94A3B8]">
            Diseñamos, implementamos y mantenemos soluciones integrales de seguridad,
            navegación, monitoreo ambiental, comunicaciones, automatización y energía con
            enfoque en continuidad operativa.
          </p>
        </Reveal>

        <div className="mt-12">
          <ServicesGrid slugs={SERVICES.map((service) => service.slug)} />
        </div>

        <Reveal delay={0.15}>
          <Link
            href="/servicios"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
          >
            Conocer el alcance de cada servicio
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
