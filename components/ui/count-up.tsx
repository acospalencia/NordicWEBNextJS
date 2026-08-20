"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export function CountUp({
  to,
  prefix = "",
  duration = 1.4,
  className,
}: {
  to: number;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;

    if (reduceMotion) {
      node.textContent = `${prefix}${to}`;
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        node.textContent = `${prefix}${Math.round(value)}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}0
    </span>
  );
}
