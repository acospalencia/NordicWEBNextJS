import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminTicketDashboard } from "@/components/portal/admin-ticket-dashboard";
import { PortalShell } from "@/components/portal/portal-shell";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";
import { PortalApiSessionError } from "@/lib/portal/api";
import { getAdminClientTickets, getAdminDirectory } from "@/lib/portal/data";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Gestión de tickets — Portal Nordictech" };
export const dynamic = "force-dynamic";

export default async function AdminTicketPortalPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (session.role !== PORTAL_ROLES.ADMIN) redirect(getPortalHome(session.role));
  let data;
  let initialTickets;
  try {
    data = await getAdminDirectory();
    initialTickets = data.clients[0]
      ? await getAdminClientTickets(data.clients[0].id_usuario)
      : [];
  } catch (error) {
    if (error instanceof PortalApiSessionError) redirect("/portal/cerrar-sesion");
    throw error;
  }

  return (
    <PortalShell session={session}>
      <AdminTicketDashboard
        clients={data.clients}
        technicians={data.technicians}
        initialTickets={initialTickets}
      />
    </PortalShell>
  );
}
