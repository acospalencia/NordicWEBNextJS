"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, RevealGroup } from "@/components/ui/reveal";
import { HoverGlow } from "@/components/ui/hover-glow";

type LogoEntry = {
  name: string;
  src: string;
  width: number;
  height: number;
  imgClassName?: string;
  /** Logos oscuros ilegibles sobre navy: se renderizan en blanco monocromo */
  invert?: boolean;
};

const LOGOS: LogoEntry[] = [
  {
    name: "Cisco",
    src: "/Logos/trimmed/Cisco_idDRq-IGim_0.png",
    width: 820,
    height: 433,
    imgClassName: "max-h-8 sm:max-h-9",
  },
  {
    name: "Dell",
    src: "/Logos/trimmed/Dell_Logo.png",
    width: 1523,
    height: 490,
    imgClassName: "max-h-7 sm:max-h-8",
  },
  {
    name: "Furukawa",
    src: "/Logos/trimmed/Furukawa.png",
    width: 989,
    height: 235,
    imgClassName: "max-h-8 sm:max-h-9",
  },
  {
    name: "Genetec",
    src: "/Logos/fixed/Genetec_idw006X0Nw_0.png",
    width: 815,
    height: 154,
    imgClassName: "max-h-7 sm:max-h-8",
    invert: true,
  },
  {
    name: "Grandstream",
    src: "/Logos/grandstream.svg",
    width: 638,
    height: 356,
    imgClassName: "max-h-14 w-full sm:max-h-16",
    invert: true,
  },
  {
    name: "Johnson Controls",
    src: "/Logos/trimmed/jhonson control.png",
    width: 288,
    height: 128,
    imgClassName: "max-h-9 sm:max-h-10",
    invert: true,
  },
  {
    name: "Motorola",
    src: "/Logos/trimmed/Motorola_ideLVQnRXz_0.png",
    width: 820,
    height: 171,
    imgClassName: "max-h-7 sm:max-h-8",
    invert: true,
  },
  {
    name: "Microsoft",
    src: "/Logos/Microsoft.webp",
    width: 800,
    height: 171,
    imgClassName: "max-h-7 sm:max-h-8",
  },
  {
    name: "Norcom",
    src: "/Logos/trimmed/norcom-seeklogo.png",
    width: 2000,
    height: 396,
    imgClassName: "max-h-8 sm:max-h-9",
  },
  {
    name: "Pelco",
    src: "/Logos/trimmed/Pelco_idU-_oCA6S_0.png",
    width: 820,
    height: 157,
    imgClassName: "max-h-7 sm:max-h-8",
    invert: true,
  },
  {
    name: "Reacton",
    src: "/Logos/fixed/Reacton_Automatic_Fire_Suppression_idpSUUz2zT_0.png",
    width: 820,
    height: 209,
    imgClassName: "max-h-8 sm:max-h-9",
    invert: true,
  },
  {
    name: "Simplex",
    src: "/Logos/simplex-seeklogo.png",
    width: 2000,
    height: 419,
    imgClassName: "max-h-9 sm:max-h-10",
    invert: true,
  },
  {
    name: "Velasea",
    src: "/Logos/trimmed/Velasea__Logo.png",
    width: 1200,
    height: 280,
    imgClassName: "max-h-9 rounded-sm sm:max-h-10",
    invert: true,
  },
  {
    name: "YORK",
    src: "/Logos/YORK_idpzx3QAWV_0.png",
    width: 820,
    height: 277,
    imgClassName: "max-h-8 sm:max-h-9",
  },
];

export function LogoCloud() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const id = useId();
  const reduceMotion = useReducedMotion();

  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0 : 0.4, ease: EASE } },
  };

  return (
    <RevealGroup
      stagger={0.06}
      className="grid grid-cols-2 border-t border-white/[0.06] sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {LOGOS.map((logo, index) => (
        <div
          key={logo.name}
          className="relative flex h-24 items-center justify-center border-b border-white/[0.06] px-6 sm:h-28 [&:not(:nth-child(2n))]:border-r sm:[&:not(:nth-child(2n))]:border-r-0 sm:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(3n))]:border-r-0 md:[&:not(:nth-child(4n))]:border-r xl:[&:not(:nth-child(4n))]:border-r-0 xl:[&:not(:nth-child(7n))]:border-r"
          onMouseEnter={() => setHoveredIndex(index)}
        >
          <HoverGlow active={hoveredIndex === index} layoutId={`logo-glow-${id}`} className="inset-0" />
          <motion.div variants={iconVariants} className="relative z-10 flex items-center justify-center">
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className={cn(
                "w-auto object-contain",
                logo.imgClassName,
                logo.invert && "brightness-0 invert opacity-85"
              )}
            />
          </motion.div>
        </div>
      ))}
    </RevealGroup>
  );
}
