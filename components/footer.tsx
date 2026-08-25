import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const NAV_LINKS = [
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Servicios", href: "/#servicios" },
  { name: "Portal de clientes", href: "/portal/iniciar-sesion" },
  { name: "Contacto", href: "/#contacto" },
];

const CONTACT = [
  { icon: Phone, label: "(503) 2525-0797", href: "tel:+50325250797" },
  { icon: Mail, label: "info@nordictech-corp.com", href: "mailto:info@nordictech-corp.com" },
  { icon: MapPin, label: "San Salvador, El Salvador" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0B1120] px-8 pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.35) 25%, #3B82F6 50%, rgba(59,130,246,0.35) 75%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 100%)",
        }}
      />
      <Image
        src="/Globe.webp"
        alt=""
        aria-hidden
        width={1678}
        height={944}
        className="pointer-events-none absolute -bottom-8 -right-16 w-[70%] max-w-none opacity-60 sm:w-[46%] [mask-image:radial-gradient(ellipse_at_bottom_right,black_30%,transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-10 pb-10 md:grid-cols-[1.4fr_auto_1fr]">
        <div>
          <Image
            src="/Logo.webp"
            alt="Nordictech"
            width={220}
            height={83}
            className="h-16 w-auto"
          />
          <p className="mt-4 max-w-sm text-xl font-semibold leading-snug tracking-tight text-[#F5F7FA]">
            Tecnología que conecta, protege y hace crecer.
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#94A3B8]">
            Soluciones integrales en ingeniería e infraestructura tecnológica.
          </p>
        </div>

        <nav
          aria-label="Navegación del pie de página"
          className="md:border-l md:border-white/10 md:pl-10"
        >
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#94A3B8] transition-colors hover:text-[#F5F7FA]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="space-y-4">
          {CONTACT.map((item) => {
            const Icon = item.icon;
            const content = (
              <span className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/15">
                  <Icon className="size-3.5 text-[#60A5FA]" strokeWidth={1.75} />
                </span>
                <span className="text-sm text-[#94A3B8]">{item.label}</span>
              </span>
            );
            return (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="transition-colors [&_span:last-child]:hover:text-[#F5F7FA]"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="relative py-5 text-center text-sm text-[#5B6479]">
        © {year} Nordictech El Salvador S.A. de C.V. Todos los derechos reservados.
      </p>
    </footer>
  );
}
