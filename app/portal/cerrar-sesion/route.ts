import { NextRequest, NextResponse } from "next/server";
import { clearPortalSession } from "@/lib/portal/auth";
import { clearPortalApiSession } from "@/lib/portal/api";

export async function GET(request: NextRequest) {
  await Promise.all([clearPortalSession(), clearPortalApiSession()]);
  return NextResponse.redirect(new URL("/portal/iniciar-sesion", request.url));
}
