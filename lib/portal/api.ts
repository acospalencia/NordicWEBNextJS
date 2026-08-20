import "server-only";

import { cookies } from "next/headers";

const BRIDGE_COOKIE = "nordictech_portal_upstream_session";
const BRIDGE_MAX_AGE_SECONDS = 60 * 60;

export type PortalApiEnvelope = {
  status: string;
  message?: string;
  [key: string]: unknown;
};

export class PortalApiError extends Error {}
export class PortalApiSessionError extends PortalApiError {}

function getApiBaseUrl() {
  const configured = process.env.PORTAL_API_BASE_URL;
  if (!configured) {
    throw new PortalApiError("PORTAL_API_BASE_URL no está configurada.");
  }

  const url = new URL(configured);
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new PortalApiError("PORTAL_API_BASE_URL debe ser una URL HTTP o HTTPS.");
  }
  return configured.replace(/\/$/, "");
}

function getUpstreamCookieName() {
  const name = process.env.PORTAL_API_SESSION_COOKIE_NAME ?? "PHPSESSID";
  if (!/^[A-Za-z0-9_-]+$/.test(name)) {
    throw new PortalApiError("PORTAL_API_SESSION_COOKIE_NAME no es válido.");
  }
  return name;
}

function readCookieValue(setCookie: string, name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = setCookie.match(new RegExp(`(?:^|,\\s*)${escapedName}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function clearPortalApiSession() {
  const cookieStore = await cookies();
  cookieStore.delete(BRIDGE_COOKIE);
}

async function savePortalApiSession(setCookieHeader: string) {
  const sessionId = readCookieValue(setCookieHeader, getUpstreamCookieName());
  if (!sessionId) return;
  const cookieStore = await cookies();
  cookieStore.set(BRIDGE_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: BRIDGE_MAX_AGE_SECONDS,
  });
}

export async function portalApiRequest<T extends PortalApiEnvelope>(
  endpoint: string,
  options: {
    method?: "GET" | "POST";
    form?: Record<string, string | number | null | undefined>;
    json?: Record<string, unknown>;
    searchParams?: Record<string, string | number>;
    captureSession?: boolean;
  } = {}
): Promise<T> {
  if (!/^[a-z0-9_-]+\.php$/i.test(endpoint)) {
    throw new PortalApiError("El endpoint solicitado no es válido.");
  }

  const url = new URL(`${getApiBaseUrl()}/${endpoint}`);
  Object.entries(options.searchParams ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const headers = new Headers({ Accept: "application/json" });
  const sessionId = (await cookies()).get(BRIDGE_COOKIE)?.value;
  if (sessionId) headers.set("Cookie", `${getUpstreamCookieName()}=${sessionId}`);

  let body: string | undefined;
  if (options.json) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  } else if (options.form) {
    headers.set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    const params = new URLSearchParams();
    Object.entries(options.form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) params.set(key, String(value));
    });
    body = params.toString();
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? (body ? "POST" : "GET"),
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    console.error(`No se pudo contactar ${endpoint}:`, error);
    throw new PortalApiError("No fue posible contactar el servicio de Bluehost.");
  }

  const setCookie = response.headers.get("set-cookie");
  if (options.captureSession && setCookie) await savePortalApiSession(setCookie);

  const responseText = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  const server = response.headers.get("server") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    const cloudflareChallenge =
      response.status === 403 &&
      (/cloudflare/i.test(server) || /challenges\.cloudflare\.com|just a moment/i.test(responseText));

    if (cloudflareChallenge) {
      throw new PortalApiError(
        "Cloudflare bloqueó la conexión entre la web y los endpoints de Bluehost. " +
          "Debes permitir las solicitudes del servidor para la ruta /assets/php/."
      );
    }

    throw new PortalApiError(
      `El endpoint de Bluehost devolvió una respuesta no JSON (estado ${response.status}).`
    );
  }

  let data: T;
  try {
    data = JSON.parse(responseText) as T;
  } catch {
    throw new PortalApiError("El endpoint de Bluehost devolvió una respuesta inválida.");
  }

  if (!response.ok) {
    throw new PortalApiError(data.message ?? `El endpoint respondió con estado ${response.status}.`);
  }
  return data;
}

export function assertPortalApiSuccess(response: PortalApiEnvelope) {
  if (response.status === "success") return;
  const message = response.message ?? "El servicio no pudo completar la solicitud.";
  if (
    response.status === "session_expired" ||
    /sesión|acceso denegado|autenticación/i.test(message)
  ) {
    throw new PortalApiSessionError(message);
  }
  throw new PortalApiError(message);
}
