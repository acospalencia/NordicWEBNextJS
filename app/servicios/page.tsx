import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { ServicesGrid } from "@/components/services-grid";
import { AppNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Líneas de negocio — Nordictech El Salvador",
  description: `Las ${SERVICES.length} líneas de negocio de Nordictech: seguridad electrónica, videoseguridad, soluciones marítimas, monitoreo ambiental, redes, energía y automatización para infraestructura crítica.`,
};

export default function ServiciosPage() {
  return (
    <>
      <AppNavbar />
      <section className="bg-[#0B1120] px-6 pb-16 pt-40 text-[#F5F7FA] sm:px-10">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            Servicios
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Líneas de negocio
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#94A3B8]">
            {SERVICES.length} líneas de negocio bajo un mismo integrador. Elegí una para ver
            el alcance completo del servicio.
          </p>
        </div>
      </section>

      <section className="bg-[#07111F] px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <ServicesGrid slugs={SERVICES.map((service) => service.slug)} />

          <Link
            href="/#contacto"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] transition-colors hover:text-[#60A5FA]"
          >
            No estás seguro cuál necesitás — hablemos
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
