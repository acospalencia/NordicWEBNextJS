import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PeopleCounterDashboard } from "@/components/people-counter/dashboard";
import { getPeopleCounterCenterName } from "@/lib/people-counter/centers";
import { getPortalHome, getValidatedPortalSession } from "@/lib/portal/auth";

export const metadata: Metadata = {
  title: "Conteo de personas | Nordictech",
  description: "Panel de afluencia y reportes de conteo de personas.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ConteoPage() {
  const session = await getValidatedPortalSession();
  if (!session) redirect("/portal/iniciar-sesion");
  if (!session.countCenterSlug) redirect(getPortalHome(session.role));

  return (
    <PeopleCounterDashboard
      centerName={getPeopleCounterCenterName(session.countCenterSlug)}
      ticketsHref={getPortalHome(session.role)}
    />
  );
}
