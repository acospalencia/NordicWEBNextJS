import type { Metadata } from "next";
import Link from "next/link";
import { PortalAuthShell } from "@/components/portal/auth-shell";
import { RecoveryForms } from "@/components/portal/auth-forms";

export const metadata: Metadata = { title: "Recuperar contraseña — Portal Nordictech" };

export default function PortalRecoveryPage() {
  return (
    <PortalAuthShell
      eyebrow="Seguridad de acceso"
      title="Recuperar contraseña"
      description="Solicitá un código y usalo para definir una contraseña nueva."
      footer={
        <p className="text-center text-sm">
          <Link href="/portal/iniciar-sesion" className="font-semibold text-[#3B82F6] hover:text-[#60A5FA]">
            Volver al inicio de sesión
          </Link>
        </p>
      }
    >
      <RecoveryForms />
    </PortalAuthShell>
  );
}
