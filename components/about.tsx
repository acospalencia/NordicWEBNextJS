import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Building2, Users, MapPin } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

const STATS = [
  { icon: ShieldCheck, value: 12, label: "Años de experiencia" },
  { icon: Building2, value: 150, label: "Implementaciones realizadas" },
  { icon: Users, value: 50, label: "Clientes satisfechos" },
  { icon: MapPin, value: "Cobertura", label: "Regional" },
] as const;

export function About() {
  return (
    <section
      id="nosotros"
      className="relative scroll-mt-24 overflow-hidden bg-[#07111F] px-6 py-24 sm:px-10"
    >
      <Image
        src="/map.webp"
        alt=""
        aria-hidden
        width={1797}
        height={905}
        className="pointer-events-none absolute -top-10 right-0 w-full max-w-none opacity-70 lg:w-[62%] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Nosotros
          </span>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
            Ingeniería e integración tecnológica desde El Salvador
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#94A3B8]">
            Nordictech El Salvador S.A. de C.V. es una empresa de ingeniería y soluciones
            tecnológicas dedicada al diseño, implementación y mantenimiento de sistemas
            integrados de seguridad, automatización y energía para edificios inteligentes,
            infraestructura crítica y entornos industriales.
          </p>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#94A3B8]">
            Garantizamos eficiencia, seguridad y desempeño en cada implementación.
          </p>

          <Link
            href="/nosotros"
            className="mt-8 inline-flex items-center gap-2 rounded border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#F5F7FA] transition-[border-color,transform] duration-150 hover:border-white/30 active:scale-[0.97]"
          >
            Conocer más sobre nosotros
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <div className="relative rounded-xl">
          <span aria-hidden className="border-beam pointer-events-none z-10" />
          <RevealGroup
            stagger={0.08}
            className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-[#0A1626]/90 backdrop-blur-sm sm:grid-cols-4"
          >
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <RevealItem
                  key={stat.label}
                  className="relative flex flex-col items-center gap-3 px-4 py-8 text-center"
                >
                  {index < STATS.length - 1 && (
                    <span
                      aria-hidden
                      className={`absolute inset-y-7 right-0 w-px bg-white/10 ${
                        index === 1 ? "hidden sm:block" : ""
                      }`}
                    />
                  )}
                  {index < 2 && (
                    <span
                      aria-hidden
                      className="absolute inset-x-7 bottom-0 h-px bg-white/10 sm:hidden"
                    />
                  )}
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#3B82F6]/10 ring-1 ring-inset ring-[#3B82F6]/25">
                    <Icon className="size-5 text-[#60A5FA]" strokeWidth={1.75} />
                  </div>
                  {typeof stat.value === "number" ? (
                    <CountUp
                      to={stat.value}
                      prefix="+"
                      className="text-2xl font-semibold tracking-tight text-[#3B82F6]"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-[#F5F7FA]">{stat.value}</p>
                  )}
                  <p className="text-xs leading-5 text-[#94A3B8]">{stat.label}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
