"use client";

import { AnimatePresence, motion, type Easing, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { EncryptedText } from "@/components/ui/encrypted-text";

const COLUMNS = 8;
const STAGGER = 0.07;
const PANEL_DURATION = 0.8;
const HOLD_BEFORE_REVEAL = 1.4;
const ROW_OFFSET = 0.12;
const EASE: Easing = [0.76, 0, 0.24, 1];

export const PRELOADER_DURATION_MS =
  (HOLD_BEFORE_REVEAL + ROW_OFFSET + (COLUMNS - 1) * STAGGER + PANEL_DURATION) * 1000;

let preloaderPlayed = false;

export function hasPreloaderPlayed() {
  return preloaderPlayed;
}

function markPreloaderPlayed() {
  preloaderPlayed = true;
}

const topVariants: Variants = {
  initial: { scaleY: 1 },
  animate: (i: number) => ({
    scaleY: 0,
    transition: { duration: PANEL_DURATION, ease: EASE, delay: HOLD_BEFORE_REVEAL + i * STAGGER },
  }),
};

const bottomVariants: Variants = {
  initial: { scaleY: 1 },
  animate: (i: number) => ({
    scaleY: 0,
    transition: {
      duration: PANEL_DURATION,
      ease: EASE,
      delay: HOLD_BEFORE_REVEAL + ROW_OFFSET + i * STAGGER,
    },
  }),
};

const textVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 1, 0],
    transition: { duration: HOLD_BEFORE_REVEAL, times: [0, 0.3, 0.75, 1], ease: "easeInOut" },
  },
};

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      markPreloaderPlayed();
      return;
    }

    document.body.style.overflow = "hidden";
    const timeout = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      markPreloaderPlayed();
    }, PRELOADER_DURATION_MS);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[100] flex select-none flex-col">
          <div className="flex h-1/2 w-full">
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={`top-${i}`}
                custom={i}
                variants={topVariants}
                initial="initial"
                animate="animate"
                className="h-full w-full origin-top bg-black"
              />
            ))}
          </div>
          <div className="flex h-1/2 w-full">
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={`bottom-${i}`}
                custom={i}
                variants={bottomVariants}
                initial="initial"
                animate="animate"
                className="h-full w-full origin-bottom bg-black"
              />
            ))}
          </div>
          <motion.div
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-white"
          >
            <EncryptedText
              text="NORDICTECH"
              className="font-sans text-2xl font-semibold uppercase tracking-[0.3em] sm:text-3xl"
              encryptedClassName="text-white/40"
              revealedClassName="text-white"
              revealDelayMs={45}
            />
            <EncryptedText
              text="EL SALVADOR S.A DE C.V"
              className="font-sans text-xs uppercase tracking-[0.35em]"
              encryptedClassName="text-white/25"
              revealedClassName="text-white/60"
              revealDelayMs={20}
              startDelayMs={10 * 45}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
