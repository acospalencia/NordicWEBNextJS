"use client";

import { motion, useReducedMotion } from "motion/react";

export function HoverGlow({
  active,
  layoutId,
  className = "",
}: {
  active: boolean;
  layoutId: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (!active) return null;

  return (
    <motion.span
      layoutId={layoutId}
      className={`pointer-events-none absolute z-0 bg-[#3B82F6]/[0.08] ring-1 ring-inset ring-[#3B82F6]/25 ${className}`}
      transition={{
        layout: reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 34, mass: 0.85 },
      }}
    />
  );
}
