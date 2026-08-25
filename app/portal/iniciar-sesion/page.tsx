import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalAuthShell } from "@/components/portal/auth-shell";
import { LoginForm } from "@/components/portal/auth-forms";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";

export const metadata: Metadata = {
  title: "Tickets de Soporte — Nordictech",
  description: "Acceso al sistema corporativo de tickets de Nordictech.",
};

export const dynamic = "force-dynamic";

export default async function PortalLoginPage() {
  const session = await getValidatedPortalSession();
  if (session) redirect(getPortalHome(session.role));

  return (
    <PortalAuthShell
      eyebrow="Tickets de Soporte"
      title="Ingreso al sistema de tickets"
      description="Gestiona tus solicitudes de soporte técnico de forma rápida y centralizada."
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
