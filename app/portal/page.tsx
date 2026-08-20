import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/portal/client-dashboard";
import { PortalShell } from "@/components/portal/portal-shell";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";
import { PortalApiSessionError } from "@/lib/portal/api";
import { getClientTickets } from "@/lib/portal/data";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Portal de clientes — Nordictech" };
export const dynamic = "force-dynamic";

export default async function ClientPortalPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (session.role !== PORTAL_ROLES.CLIENT) redirect(getPortalHome(session.role));

  let data;
  try {
    data = await getClientTickets();
  } catch (error) {
    if (error instanceof PortalApiSessionError) redirect("/portal/cerrar-sesion");
    throw error;
  }
  const displaySession = { ...session, name: data.name };
  return (
    <PortalShell session={displaySession}>
      <ClientDashboard tickets={data.tickets} clientName={data.name} />
    </PortalShell>
  );
}
