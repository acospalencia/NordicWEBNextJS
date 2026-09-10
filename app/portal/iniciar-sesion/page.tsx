import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalAuthShell } from "@/components/portal/auth-shell";
import { LoginForm } from "@/components/portal/auth-forms";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";

export const metadata: Metadata = {
  title: "Iniciar sesión — Nordictech",
  description: "Acceso a los servicios privados de Nordictech.",
};

export const dynamic = "force-dynamic";

export default async function PortalLoginPage() {
  const session = await getValidatedPortalSession();
  if (session) {
    redirect(
      session.countCenterSlug
        ? "/portal/seleccionar-servicio"
        : getPortalHome(session.role),
    );
  }

  return (
    <PortalAuthShell
      eyebrow="Portal Nordictech"
      title="Iniciar sesión"
      description="Accede con tu cuenta. Si tienes más de un servicio disponible, podrás elegir cuál deseas consultar."
      footer={
        <div className="flex flex-col items-center gap-3 text-sm text-[#94A3B8] sm:flex-row sm:justify-between">
          <Link href="/portal/recuperar" className="transition-colors hover:text-white">
            Olvidé mi contraseña
          </Link>
          <Link href="/portal/registro" className="font-semibold text-[#3B82F6] hover:text-[#60A5FA]">
            Crear cuenta
          </Link>
        </div>
      }
    >
      <LoginForm />
    </PortalAuthShell>
  );
}
