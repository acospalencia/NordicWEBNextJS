import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { normalizePeopleCounterCenterSlug } from "@/lib/people-counter/centers";
import { renewPortalApiSessionCookie } from "@/lib/portal/api";
import {
  portalSessionMaxAgeSeconds,
  type PortalRole,
  type PortalSession,
} from "@/lib/portal/types";

const SESSION_COOKIE = "nordictech_portal_session";

function getSessionSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("PORTAL_SESSION_SECRET debe tener al menos 32 caracteres.");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function encodeSession(session: PortalSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value: string): PortalSession | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as PortalSession;
    if (
      !Number.isInteger(session.userId) ||
      session.userId <= 0 ||
      !session.name ||
      ![1, 2, 3, 4].includes(session.role) ||
      (session.countCenterSlug !== null &&
        normalizePeopleCounterCenterSlug(session.countCenterSlug) !== session.countCenterSlug) ||
      !Number.isFinite(session.lastActivity)
    ) {
      return null;
    }
    if (Date.now() - session.lastActivity >= portalSessionMaxAgeSeconds(session.role) * 1000) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function getPortalSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  return value ? decodeSession(value) : null;
}

export async function getValidatedPortalSession() {
  return getPortalSession();
}

export async function setPortalSession(session: Omit<PortalSession, "lastActivity">) {
  const cookieStore = await cookies();
  const value = encodeSession({ ...session, lastActivity: Date.now() });
  cookieStore.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: portalSessionMaxAgeSeconds(session.role),
  });
}

export async function renewPortalSession(session: PortalSession) {
  await setPortalSession({
    userId: session.userId,
    name: session.name,
    role: session.role,
    countCenterSlug: session.countCenterSlug,
  });
}

export async function clearPortalSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requirePortalActionSession(roles?: PortalRole[]) {
  const session = await getValidatedPortalSession();
  if (!session || (roles && !roles.includes(session.role))) return null;
  await Promise.all([renewPortalSession(session), renewPortalApiSessionCookie(session.role)]);
  return session;
}

export function getPortalHome(role: PortalRole) {
  if (role === 3) return "/portal/administracion";
  if (role === 2) return "/portal/tecnico";
  if (role === 4) return "/conteo";
  return "/portal";
}
