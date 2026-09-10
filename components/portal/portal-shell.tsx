import Image from "next/image";
import Link from "next/link";
import { BarChart3, LogOut, Settings, TicketCheck } from "lucide-react";
import { logoutPortal } from "@/app/portal/actions";
import { Footer } from "@/components/footer";
import { PORTAL_ROLES, type PortalSession } from "@/lib/portal/types";

const ROLE_NAMES = {
  [PORTAL_ROLES.CLIENT]: "Cliente",
  [PORTAL_ROLES.TECHNICIAN]: "Técnico",
  [PORTAL_ROLES.ADMIN]: "Administrador",
};

export function PortalShell({
  session,
  children,
}: {
  session: PortalSession;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#07111F] text-[#F5F7FA]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1120]/95 px-6 backdrop-blur sm:px-10">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            <Link href="/" aria-label="Volver al inicio" className="shrink-0">
              <Image
                src="/Logo-wordmark.webp"
                alt="Nordictech"
                width={1563}
                height={248}
                className="h-auto w-40 sm:w-44"
                priority
              />
            </Link>
            <div className="hidden border-l border-white/10 pl-5 sm:block">
              <p className="text-sm font-semibold text-white">{session.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#3B82F6]">
                {ROLE_NAMES[session.role]}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2" aria-label="Navegación del portal">
            {session.countCenterSlug && (
              <Link
                href="/conteo"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-[#CBD5E1] transition-colors hover:border-[#3B82F6]/40 hover:text-white"
              >
                <BarChart3 className="size-4" />
                <span className="hidden md:inline">Conteo de personas</span>
              </Link>
            )}
            {session.role === PORTAL_ROLES.ADMIN && (
              <>
                <Link
                  href="/portal/administracion"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-[#CBD5E1] transition-colors hover:border-[#3B82F6]/40 hover:text-white"
                >
                  <TicketCheck className="size-4" />
                  <span className="hidden md:inline">Tickets de Soporte</span>
                </Link>
                <Link
                  href="/portal/administracion/sistema"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-[#CBD5E1] transition-colors hover:border-[#3B82F6]/40 hover:text-white"
                >
                  <Settings className="size-4" />
                  <span className="hidden md:inline">Sistema</span>
                </Link>
              </>
            )}
            <form action={logoutPortal}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#60A5FA]"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
