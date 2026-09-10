"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Preloader } from "@/components/preloader";

const STANDALONE_ROUTES = new Set([
  "/politica-de-privacidad-asistencia-nordictech",
]);

export function SiteChrome() {
  const pathname = usePathname();

  if (STANDALONE_ROUTES.has(pathname) || pathname.startsWith("/conteo")) {
    return null;
  }

  return (
    <>
      <Preloader />
      <FloatingWhatsApp />
    </>
  );
}
