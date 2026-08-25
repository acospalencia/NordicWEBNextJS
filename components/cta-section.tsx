import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function CtaSection() {
  return (
    <section className="bg-[#050D18] px-6 py-24 sm:px-10">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
          ¿Listo para proteger tu infraestructura?
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#94A3B8]">
          Comentanos qué necesitás proteger o automatizar y te enviamos una propuesta técnica
          hecha a medida.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/#contacto"
            className="inline-flex items-center justify-center gap-2 rounded bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#60A5FA] active:scale-[0.97]"
          >
            Solicitar cotización
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/#servicios"
            className="inline-flex items-center justify-center gap-2 rounded border border-white/15 px-6 py-3 text-sm font-semibold text-[#F5F7FA] transition-[border-color,transform] duration-150 hover:border-white/30 active:scale-[0.97]"
          >
            Ver servicios
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
