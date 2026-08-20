import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { SystemDashboard } from "@/components/portal/system-dashboard";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";
import { PortalApiSessionError } from "@/lib/portal/api";
import { getSystemData } from "@/lib/portal/data";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const metadata: Metadata = { title: "Administración del sistema — Portal Nordictech" };
export const dynamic = "force-dynamic";

export default async function PortalSystemPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (session.role !== PORTAL_ROLES.ADMIN) redirect(getPortalHome(session.role));
  let data;
  try {
    data = await getSystemData();
  } catch (error) {
    if (error instanceof PortalApiSessionError) redirect("/portal/cerrar-sesion");
    throw error;
  }

  return (
    <PortalShell session={session}>
      <SystemDashboard users={data.users} tickets={data.tickets} emails={data.emails} metrics={data.metrics} />
    </PortalShell>
  );
}
