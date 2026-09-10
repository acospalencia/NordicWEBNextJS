import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, TicketCheck } from "lucide-react";
import { PortalShell } from "@/components/portal/portal-shell";
import { getPeopleCounterCenterName } from "@/lib/people-counter/centers";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";

export const metadata: Metadata = {
  title: "Seleccionar servicio — Nordictech",
  description: "Selecciona el servicio privado de Nordictech que deseas consultar.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ServiceSelectorPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (!session.countCenterSlug) redirect(getPortalHome(session.role));

  const ticketHome = getPortalHome(session.role);
  const centerName = getPeopleCounterCenterName(session.countCenterSlug);

  return (
    <PortalShell session={session}>
      <section className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_45%)]"
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#60A5FA]">
              Servicios disponibles
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              ¿Qué deseas consultar?
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#94A3B8] sm:text-base">
              Hola, {session.name}. Selecciona el módulo al que deseas ingresar.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ServiceCard
              href="/conteo"
              icon={BarChart3}
              eyebrow="Afluencia"
              title="Conteo de personas"
              description={`Consulta entradas, salidas y reportes de ${centerName}.`}
              accent="blue"
            />
            <ServiceCard
              href={ticketHome}
              icon={TicketCheck}
              eyebrow="Soporte"
              title="Tickets de soporte"
              description="Crea solicitudes y consulta el seguimiento de los servicios técnicos."
              accent="cyan"
            />
          </div>
        </div>
      </section>
    </PortalShell>
  );
}

function ServiceCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  accent,
}: {
  href: string;
  icon: typeof BarChart3;
  eyebrow: string;
  title: string;
  description: string;
  accent: "blue" | "cyan";
}) {
  const iconClass =
    accent === "blue"
      ? "bg-[#3B82F6]/15 text-[#60A5FA] ring-[#3B82F6]/25"
      : "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20";

  return (
    <Link
      href={href}
      className="group flex min-h-64 flex-col rounded-2xl border border-white/10 bg-[#0A1626] p-7 shadow-xl shadow-black/15 transition-[transform,border-color,background-color] hover:-translate-y-1 hover:border-[#3B82F6]/45 hover:bg-[#0C1B2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
    >
      <span className={`flex size-12 items-center justify-center rounded-xl ring-1 ${iconClass}`}>
        <Icon className="size-6" />
      </span>
      <span className="mt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-[#94A3B8]">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#60A5FA]">
        Abrir servicio
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
