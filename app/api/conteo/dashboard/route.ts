import { NextResponse } from "next/server";
import { normalizePeopleCounterCenterSlug } from "@/lib/people-counter/centers";
import { getValidatedPortalSession } from "@/lib/portal/auth";
import { PORTAL_ROLES } from "@/lib/portal/types";

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
    const requested = new URL(request.url).searchParams;
    const requestedCenterValue = requested.get("center");
    const requestedCenter = normalizePeopleCounterCenterSlug(requestedCenterValue);
    if (requestedCenterValue && !requestedCenter) {
      return NextResponse.json(
        { error: "El centro solicitado no es válido." },
        { status: 400 },
      );
    }
    if (
      session.role !== PORTAL_ROLES.ADMIN &&
      requestedCenter &&
      requestedCenter !== session.countCenterSlug
    ) {
      return NextResponse.json(
        { error: "Tu cuenta no puede consultar ese centro." },
        { status: 403 },
      );
    }
    const center =
      session.role === PORTAL_ROLES.ADMIN
        ? requestedCenter ?? session.countCenterSlug
        : session.countCenterSlug;
    if (!center) {
      return NextResponse.json(
        { error: "Selecciona un centro de conteo." },
        { status: 400 },
      );
    }

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
