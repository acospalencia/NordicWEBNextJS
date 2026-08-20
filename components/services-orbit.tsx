"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SERVICES } from "@/lib/services";

const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

export function ServicesOrbitCarousel({ slugs }: { slugs: string[] }) {
  const services = React.useMemo(
    () => slugs.map((slug) => SERVICES.find((s) => s.slug === slug)!).filter(Boolean),
    [slugs]
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  const isMobile = useIsMobile();

  const containerRadius = isMobile ? 160 : 260;
  const badgeSize = isMobile ? 60 : 80;
  const containerSize = containerRadius * 2 + 100;
  // En mobile, el anillo se recorre hacia abajo para que la insignia
  // superior no choque con el icono flotante de la tarjeta central.
  const ringOffset = isMobile ? -36 : 0;

  const getRotation = React.useCallback(
    (index: number) => (index - activeIndex) * (360 / services.length),
    [activeIndex, services.length]
  );

  const next = React.useCallback(
    () => setActiveIndex((i) => (i + 1) % services.length),
    [services.length]
  );
  const prev = React.useCallback(
    () => setActiveIndex((i) => (i - 1 + services.length) % services.length),
    [services.length]
  );

  const handleBadgeClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  React.useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isHovering, next]);

  const active = services[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <div
      className="relative flex flex-col items-center py-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="z-10 w-56 rounded-xl border border-white/10 bg-[#0A1626] p-3 text-center shadow-xl sm:p-4 md:w-64"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mx-auto -mt-6 flex size-12 items-center justify-center rounded-full border-4 border-[#0A1626] bg-[#3B82F6]/15 shadow-md sm:-mt-10 sm:size-16 md:-mt-12 md:size-20"
            >
              <ActiveIcon className="size-5 text-[#3B82F6] sm:size-7 md:size-8" strokeWidth={1.75} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-[#F5F7FA] sm:mt-3 sm:text-base">
                {active.name}
              </h3>
              <p className="mt-2 hidden text-xs leading-5 text-[#94A3B8] sm:line-clamp-3 sm:block">
                {active.summary}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-3 flex items-center justify-center gap-2 sm:mt-4"
            >
              <button
                onClick={prev}
                aria-label="Anterior"
                className="rounded-full bg-white/10 p-1.5 text-[#94A3B8] transition-colors hover:bg-white/15"
              >
                <ChevronLeft className="size-4" />
              </button>
              <Link
                href={`/servicios/${active.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#60A5FA]"
              >
                Ver alcance
                <ArrowRight className="size-3.5" />
              </Link>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="rounded-full bg-white/10 p-1.5 text-[#94A3B8] transition-colors hover:bg-white/15"
              >
                <ChevronRight className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {services.map((service, i) => {
          const Icon = service.icon;
          const rotation = getRotation(i);
          const isActive = i === activeIndex;

          return (
            <motion.div
              key={service.slug}
              animate={{
                transform: `translateY(${ringOffset}px) rotate(${rotation}deg) translateY(-${containerRadius}px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: isActive ? 0 : Math.abs(i - activeIndex) * 0.05,
              }}
              style={{
                width: badgeSize,
                height: badgeSize,
                position: "absolute",
                top: `calc(50% - ${badgeSize / 2}px)`,
                left: `calc(50% - ${badgeSize / 2}px)`,
                zIndex: isActive ? 20 : 10,
              }}
            >
              <motion.div
                animate={{ rotate: -rotation }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className="size-full"
              >
                <button
                  onClick={() => handleBadgeClick(i)}
                  aria-label={service.name}
                  className={`flex size-full items-center justify-center rounded-full border-2 bg-[#0A1626] shadow-sm transition-all duration-300 hover:border-[#3B82F6]/60 ${
                    isActive ? "border-[#3B82F6] shadow-lg" : "border-white/15"
                  }`}
                >
                  <Icon
                    className={isMobile ? "size-6" : "size-8"}
                    strokeWidth={1.75}
                    style={{ color: isActive ? "#3B82F6" : "#94A3B8" }}
                  />
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {services.map((service, index) => (
          <button
            key={service.slug}
            onClick={() => setActiveIndex(index)}
            aria-label={`Ir a ${service.name}`}
            className={`size-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-[#3B82F6]" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
