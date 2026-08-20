"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function LayoutTextFlip({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
  className,
  wordClassName,
}: {
  text?: string;
  words?: string[];
  duration?: number;
  className?: string;
  wordClassName?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <>
      <motion.span layoutId="subtext" className={cn("tracking-tight drop-shadow-lg", className)}>
        {text}
      </motion.span>

      <motion.span
        layout
        className={cn(
          "relative ml-3 w-fit overflow-hidden rounded-md border border-transparent bg-white px-4 py-2 font-sans tracking-tight text-black shadow-sm ring ring-black/10 shadow-black/10 drop-shadow-lg",
          className,
          wordClassName
        )}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)" }}
            animate={{ y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } }}
            className="inline-block whitespace-nowrap"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
