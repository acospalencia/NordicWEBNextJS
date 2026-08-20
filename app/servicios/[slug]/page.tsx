import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, BadgeCheck } from "lucide-react";
import { SERVICES, getServiceBySlug } from "@/lib/services";
import { AppNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: `${service.name} — Nordictech El Salvador`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = service.icon;

  return (
    <>
      <AppNavbar />
      <section className="bg-[#0B1120] px-6 pb-16 pt-40 text-[#F5F7FA] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
          >
            <ArrowLeft className="size-3.5" />
            Servicios
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-[#3B82F6]/10">
              <Icon className="size-6 text-[#3B82F6]" strokeWidth={1.75} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{service.name}</h1>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#94A3B8]">{service.summary}</p>

          <Link
            href="/#contacto"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#60A5FA] active:scale-[0.97]"
          >
            Solicitar este servicio
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-[#07111F] px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          {service.highlight && (
            <div className="mb-10 flex items-start gap-4 rounded-lg border border-[#3B82F6]/25 bg-[#3B82F6]/10 p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#3B82F6]/15">
                <BadgeCheck className="size-5 text-[#3B82F6]" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#F5F7FA]">{service.highlight.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[#94A3B8]">{service.highlight.description}</p>
              </div>
            </div>
          )}

          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
            Alcance del servicio
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.scope.map((item) => {
              const key = typeof item === "string" ? item : item.title;
              return (
                <li key={key} className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#0A1626] p-4">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#3B82F6]" strokeWidth={2} />
                  {typeof item === "string" ? (
                    <span className="text-sm leading-6 text-[#E2E8F0]">{item}</span>
                  ) : (
                    <div>
                      <span className="text-sm font-semibold leading-6 text-[#E2E8F0]">{item.title}</span>
                      <p className="mt-1 text-sm leading-6 text-[#94A3B8]">{item.description}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            href="/servicios"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
          >
            <ArrowLeft className="size-4" />
            Ver las 13 líneas de negocio
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
