import { NextResponse } from "next/server";
import { getValidatedPortalSession } from "@/lib/portal/auth";

export const dynamic = "force-dynamic";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

export async function GET(request: Request) {
  try {
    const session = await getValidatedPortalSession();
    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para consultar los conteos." },
        { status: 401 },
      );
    }
    if (!session.countCenterSlug) {
      return NextResponse.json(
        { error: "Tu cuenta no tiene un centro de conteo asignado." },
        { status: 403 },
      );
    }

    const requested = new URL(request.url).searchParams;
    const from = requested.get("from") ?? "";
    const to = requested.get("to") ?? "";
    const startHour = requested.get("startHour") ?? "0";
    const endHour = requested.get("endHour") ?? "23";
    if (!DATE_PATTERN.test(from) || !DATE_PATTERN.test(to) || from > to) {
      return NextResponse.json(
        { error: "El rango de fechas no es válido." },
        { status: 400 },
      );
    }

    const center = session.countCenterSlug;
    const endpoint = new URL(
      `${apiBaseUrl()}/api/v1/people-counter/centers/${encodeURIComponent(center)}/dashboard`,
    );
    endpoint.searchParams.set("from", from);
    endpoint.searchParams.set("to", to);
    endpoint.searchParams.set("startHour", startHour);
    endpoint.searchParams.set("endHour", endHour);

    const headers = new Headers({ Accept: "application/json" });
    const token = process.env.PEOPLE_COUNTER_API_READ_TOKEN;
    if (!token && process.env.NODE_ENV === "production") {
      throw new Error("PEOPLE_COUNTER_API_READ_TOKEN no está configurado.");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(endpoint, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const payload = await response.text();
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
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
    console.error("No fue posible consultar la API de conteo:", error);
    return NextResponse.json(
      { error: "No fue posible contactar el servicio de conteo." },
      { status: 502 },
    );
  }
}
