import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { TicketViewerDashboard } from "@/components/portal/ticket-viewer-dashboard";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";
import { PortalApiSessionError } from "@/lib/portal/api";
import { getTicketViewerData } from "@/lib/portal/data";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Consulta de tickets — Portal Nordictech",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function TicketViewerPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (session.role !== PORTAL_ROLES.TICKET_VIEWER) {
    redirect(getPortalHome(session.role));
  }

  let data;
  try {
    data = await getTicketViewerData();
  } catch (error) {
    if (error instanceof PortalApiSessionError) {
      redirect("/portal/cerrar-sesion");
    }
    throw error;
  }

  return (
    <PortalShell session={{ ...session, name: data.name }}>
      <TicketViewerDashboard
        clients={data.clients}
        tickets={data.tickets}
        viewerName={data.name}
      />
    </PortalShell>
  );
}
