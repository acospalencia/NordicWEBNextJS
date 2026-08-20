"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { HoverGlow } from "@/components/ui/hover-glow";

export function ServicesGrid({ slugs }: { slugs: string[] }) {
  const services = useMemo(
    () => slugs.map((slug) => SERVICES.find((s) => s.slug === slug)!).filter(Boolean),
    [slugs]
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const id = useId();

  return (
    <RevealGroup
      stagger={0.05}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <RevealItem
            key={service.slug}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <HoverGlow
              active={hoveredIndex === index}
              layoutId={`services-glow-${id}`}
              className="-inset-2 rounded-xl"
            />
            <Link
              href={`/servicios/${service.slug}`}
              className="group relative z-10 block rounded-lg border border-white/10 bg-[#0A1626] p-6 transition-[border-color,transform] duration-150 hover:border-[#3B82F6]/40 active:scale-[0.98]"
            >
              <div className="flex size-10 items-center justify-center rounded-md bg-[#3B82F6]/15">
                <Icon className="size-5 text-[#3B82F6]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#F5F7FA]">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{service.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#3B82F6]">
                Ver alcance
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
