"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const NAV_ITEMS = [
  { name: "Nosotros", link: "/#nosotros" },
  { name: "Servicios", link: "/#servicios" },
  { name: "Tickets de Soporte", link: "/portal/iniciar-sesion", featured: true },
  { name: "Contacto", link: "/#contacto" },
];

export function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ResizableNavbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={NAV_ITEMS} />
        <NavbarButton href="/#contacto" variant="primary">
          Solicitar cotización
        </NavbarButton>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-heading text-lg font-medium tracking-tight transition-[color,background-color,border-color,box-shadow] hover:text-[#F5F7FA] ${
                item.featured
                  ? "rounded-full border border-[#3B82F6]/50 bg-[#3B82F6]/15 px-4 py-2 text-[#F5F7FA] shadow-[0_0_18px_rgba(59,130,246,0.16)] hover:border-[#60A5FA]/70 hover:bg-[#3B82F6]/25"
                  : "text-[#CBD5E1]"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <NavbarButton
            href="/#contacto"
            variant="primary"
            className="w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Solicitar cotización
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
