import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PeopleCounterDashboard } from "@/components/people-counter/dashboard";
import { getPeopleCounterCenterName } from "@/lib/people-counter/centers";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const metadata: Metadata = {
  title: "Conteo de personas | Nordictech",
  description: "Panel de afluencia y reportes de conteo de personas.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ConteoPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  const canSelectCenter = session.role === PORTAL_ROLES.ADMIN;
  if (!session.countCenterSlug && !canSelectCenter) {
    redirect(getPortalHome(session.role));
  }

  return (
    <PeopleCounterDashboard
      initialCenterSlug={session.countCenterSlug ?? ""}
      initialCenterName={
        session.countCenterSlug
          ? getPeopleCounterCenterName(session.countCenterSlug)
          : "Selecciona un centro"
      }
      canSelectCenter={canSelectCenter}
      ticketsHref={getPortalHome(session.role)}
    />
  );
}
