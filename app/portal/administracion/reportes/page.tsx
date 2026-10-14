import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { TicketReportsDashboard } from "@/components/portal/ticket-reports-dashboard";
import { PortalApiSessionError } from "@/lib/portal/api";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";
import { getAdminReportData } from "@/lib/portal/data";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Reportes de tickets — Portal Nordictech",
};
export const dynamic = "force-dynamic";

export default async function PortalTicketReportsPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (session.role !== PORTAL_ROLES.ADMIN) redirect(getPortalHome(session.role));

  let reportData;
  try {
    reportData = await getAdminReportData();
  } catch (error) {
    if (error instanceof PortalApiSessionError) redirect("/portal/cerrar-sesion");
    throw error;
  }

  return (
    <PortalShell session={session}>
      <TicketReportsDashboard
        clients={reportData.clients}
        tickets={reportData.tickets}
      />
    </PortalShell>
  );
}
