import Link from "next/link";
import { AppNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function PortalAuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar />
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#07111F] px-6 pb-20 pt-36 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.16),transparent_42%)]"
        />
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0A1626]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">
            {eyebrow}
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5F7FA]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{description}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 border-t border-white/10 pt-5">{footer}</div>}
          <Link
            href="/"
            className="mt-5 block text-center text-xs font-semibold text-[#94A3B8] transition-colors hover:text-white"
          >
            Volver al sitio principal
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
