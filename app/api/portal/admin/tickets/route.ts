import { requirePortalActionSession } from "@/lib/portal/auth";
import { PortalApiError, PortalApiSessionError } from "@/lib/portal/api";
import { getSystemData } from "@/lib/portal/data";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requirePortalActionSession([PORTAL_ROLES.ADMIN]);
  if (!session) {
    return Response.json({ error: "Sesión administrativa no válida." }, { status: 401 });
  }

  try {
    const data = await getSystemData();
    return Response.json(
      { tickets: data.tickets, generatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    if (error instanceof PortalApiSessionError) {
      return Response.json({ error: "La sesión remota expiró." }, { status: 401 });
    }
    console.error("No fue posible actualizar los tickets administrativos:", error);
    return Response.json(
      {
        error:
          error instanceof PortalApiError
            ? error.message
            : "No fue posible actualizar los tickets.",
      },
      { status: 502 }
    );
  }
}
