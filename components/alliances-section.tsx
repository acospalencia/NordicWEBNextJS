import Image from "next/image";
import { LogoCloud } from "@/components/logo-cloud";
import { Reveal } from "@/components/ui/reveal";

export function AlliancesSection() {
  return (
    <section
      id="alianzas"
      className="relative scroll-mt-24 overflow-hidden bg-[#050D18] px-6 py-20 sm:px-10"
    >
      <Image
        src="/Globe.webp"
        alt=""
        aria-hidden
        width={1678}
        height={944}
        className="pointer-events-none absolute -top-6 right-0 w-[78%] max-w-none opacity-80 sm:w-[52%] [mask-image:radial-gradient(ellipse_at_top_right,black_35%,transparent_72%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Nuestros aliados
          </span>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
            Alianzas que fortalecen cada solución
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#94A3B8]">
            Trabajamos con fabricantes líderes en seguridad, redes, navegación y
            señalización marítima, medición ambiental, protección contra incendios y
            climatización para garantizar soluciones robustas y soportadas.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <LogoCloud />
        </Reveal>
      </div>
    </section>
  );
}
