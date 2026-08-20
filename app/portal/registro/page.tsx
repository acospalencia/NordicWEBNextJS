import type { Metadata } from "next";
import Link from "next/link";
import { PortalAuthShell } from "@/components/portal/auth-shell";
import { RegisterForm } from "@/components/portal/auth-forms";

export const metadata: Metadata = { title: "Crear cuenta — Portal Nordictech" };

export default function PortalRegisterPage() {
  return (
    <PortalAuthShell
      eyebrow="Solicitud de acceso"
      title="Crear cuenta corporativa"
      description="La cuenta quedará pendiente hasta que el equipo de Nordictech apruebe el acceso."
      footer={
        <p className="text-center text-sm text-[#94A3B8]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/portal/iniciar-sesion" className="font-semibold text-[#3B82F6] hover:text-[#60A5FA]">
            Iniciar sesión
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </PortalAuthShell>
  );
}
