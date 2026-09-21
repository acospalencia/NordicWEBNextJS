import { NextResponse } from "next/server";
import { getValidatedPortalSession } from "@/lib/portal/auth";
import { PORTAL_ROLES } from "@/lib/portal/types";

export const dynamic = "force-dynamic";

function apiBaseUrl() {
  const configured =
    process.env.PEOPLE_COUNTER_API_BASE_URL ??
    "https://conteo.nordictech-corp.com";
  const url = new URL(configured);
  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new Error("PEOPLE_COUNTER_API_BASE_URL debe utilizar HTTPS.");
  }
  return configured.replace(/\/$/, "");
}

export async function GET() {
  try {
    const session = await getValidatedPortalSession();
    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para consultar los centros." },
        { status: 401 },
      );
    }
    if (session.role !== PORTAL_ROLES.ADMIN) {
      return NextResponse.json(
        { error: "Solo un administrador puede consultar todos los centros." },
        { status: 403 },
      );
    }

    const token = process.env.PEOPLE_COUNTER_API_READ_TOKEN;
    if (!token && process.env.NODE_ENV === "production") {
      throw new Error("PEOPLE_COUNTER_API_READ_TOKEN no está configurado.");
    }
    const headers = new Headers({ Accept: "application/json" });
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(
      `${apiBaseUrl()}/api/v1/people-counter/centers`,
      {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      },
    );
    const payload = await response.text();
    if (!(response.headers.get("content-type") ?? "").includes("application/json")) {
      return NextResponse.json(
        { error: "La API de conteo devolvió una respuesta no válida." },
        { status: 502 },
      );
    }

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("No fue posible consultar los centros de conteo:", error);
    return NextResponse.json(
      { error: "No fue posible contactar el servicio de conteo." },
      { status: 502 },
    );
  }
}
