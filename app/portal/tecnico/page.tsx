import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { TechnicianDashboard } from "@/components/portal/technician-dashboard";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";
import { PortalApiSessionError } from "@/lib/portal/api";
import { getTechnicianData } from "@/lib/portal/data";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Panel técnico — Portal Nordictech" };
export const dynamic = "force-dynamic";

export default async function TechnicianPortalPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (session.role !== PORTAL_ROLES.TECHNICIAN) redirect(getPortalHome(session.role));
  let data;
  try {
    data = await getTechnicianData();
  } catch (error) {
    if (error instanceof PortalApiSessionError) redirect("/portal/cerrar-sesion");
    throw error;
  }

  return (
    <PortalShell session={session}>
      <TechnicianDashboard clients={data.clients} tickets={data.tickets} />
    </PortalShell>
  );
}
