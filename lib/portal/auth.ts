import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { PortalRole, PortalSession } from "@/lib/portal/types";

const SESSION_COOKIE = "nordictech_portal_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60;

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
      !session.name ||
      ![1, 2, 3].includes(session.role) ||
      !Number.isFinite(session.lastActivity)
    ) {
      return null;
    }
    if (Date.now() - session.lastActivity >= SESSION_MAX_AGE_SECONDS * 1000) return null;
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
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function renewPortalSession(session: PortalSession) {
  await setPortalSession({ userId: session.userId, name: session.name, role: session.role });
}

export async function clearPortalSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requirePortalActionSession(roles?: PortalRole[]) {
  const session = await getValidatedPortalSession();
  if (!session || (roles && !roles.includes(session.role))) return null;
  await renewPortalSession(session);
  return session;
}

export function getPortalHome(role: PortalRole) {
  if (role === 3) return "/portal/administracion";
  if (role === 2) return "/portal/tecnico";
  return "/portal";
}
