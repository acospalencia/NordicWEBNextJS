import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  Target,
  Scale,
  ShieldCheck,
  Users,
  UsersRound,
  Leaf,
  BadgeCheck,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { AppNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Nosotros — Nordictech El Salvador",
  description:
    "Nordictech El Salvador: empresa de ingeniería y soluciones tecnológicas para seguridad, automatización y energía en edificios inteligentes e infraestructura crítica.",
};

const VALUES = [
  { icon: Lightbulb, name: "Innovación continua" },
  { icon: Target, name: "Excelencia técnica" },
  { icon: Scale, name: "Integridad y ética profesional" },
  { icon: ShieldCheck, name: "Compromiso con la seguridad" },
  { icon: Users, name: "Orientación al cliente" },
  { icon: UsersRound, name: "Trabajo en equipo" },
  { icon: Leaf, name: "Innovación sostenible" },
  { icon: BadgeCheck, name: "Confiabilidad" },
  { icon: Sparkles, name: "Pasión por la tecnología" },
  { icon: HeartHandshake, name: "Responsabilidad social" },
];

export default function NosotrosPage() {
  return (
    <>
      <AppNavbar />
      <section className="bg-[#0B1120] px-6 pb-16 pt-40 text-[#F5F7FA] sm:px-10">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Nosotros
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Ingeniería e integración tecnológica desde El Salvador
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#94A3B8]">
            Nordictech El Salvador S.A. de C.V. es una empresa de ingeniería y soluciones
            tecnológicas dedicada al diseño, implementación y mantenimiento de sistemas
            integrados de seguridad, automatización y energía para edificios inteligentes,
            infraestructura crítica y entornos industriales. Integramos tecnología,
            eficiencia y seguridad para crear espacios sostenibles y conectados,
            garantizando desempeño y confiabilidad en cada proyecto.
          </p>
        </div>
      </section>

      <section className="bg-[#07111F] px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <RevealGroup
            stagger={0.1}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2"
          >
            <RevealItem className="bg-[#0A1626] p-8">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
                Misión
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#94A3B8]">
                Proveer infraestructura tecnológica, sistemas integrados y servicios
                especializados que aseguren continuidad operativa, eficiencia energética,
                protección avanzada y escalabilidad en cada proyecto.
              </p>
            </RevealItem>
            <RevealItem className="bg-[#0A1626] p-8">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
                Visión
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#94A3B8]">
                Liderar la transformación digital de infraestructuras y edificaciones
                mediante soluciones inteligentes, seguras y sostenibles que impulsen el
                desarrollo de las organizaciones en la región.
              </p>
            </RevealItem>
          </RevealGroup>

          <Reveal>
            <h2 className="mt-14 text-sm font-semibold uppercase tracking-[0.2em] text-[#E2E8F0]">
              Valores corporativos
            </h2>
          </Reveal>
          <RevealGroup
            stagger={0.04}
            className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5"
          >
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <RevealItem key={value.name} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-[#3B82F6]" strokeWidth={1.75} />
                  <span className="text-sm leading-6 text-[#94A3B8]">{value.name}</span>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal>
            <Link
              href="/#contacto"
              className="mt-14 inline-flex items-center gap-2 rounded bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#60A5FA] active:scale-[0.97]"
            >
              Hablemos de tu proyecto
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
