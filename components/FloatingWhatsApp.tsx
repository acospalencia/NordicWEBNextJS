"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon } from "@/components/WhatsAppLink";

const WHATSAPP_HREF = "https://wa.me/50377370032";
const defaultMessage = "Hola, quisiera más información sobre sus servicios.";

/**
 * Two touches borrowed from react-floating-whatsapp's README (unmaintained
 * since 2022, not installed — pattern adapted by hand): a typing indicator
 * before the greeting lands (its `messageDelay`), and a one-time attention
 * peek while closed (its `notification`, but fired once per visit rather
 * than looping — a B2B site shouldn't nag).
 */
const greetingTypingDelay = 900;
const peekAfter = 8000;
const peekVisibleFor = 6000;

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [greetingReady, setGreetingReady] = useState(false);
  const [peekVisible, setPeekVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setGreetingReady(false);
      const id = setTimeout(() => setGreetingReady(true), greetingTypingDelay);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const showId = setTimeout(() => {
      if (!hasOpenedRef.current) setPeekVisible(true);
    }, peekAfter);
    const hideId = setTimeout(() => setPeekVisible(false), peekAfter + peekVisibleFor);
    return () => {
      clearTimeout(showId);
      clearTimeout(hideId);
    };
  }, []);

  function toggle() {
    hasOpenedRef.current = true;
    setPeekVisible(false);
    setOpen((o) => !o);
  }

  function send() {
    const text = message.trim() || defaultMessage;
    window.open(`${WHATSAPP_HREF}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setOpen(false);
    setMessage("");
  }

  return (
    <div ref={rootRef} className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22, mass: 0.7 }}
            style={{ transformOrigin: "bottom right" }}
            role="dialog"
            aria-label="Iniciar conversación por WhatsApp"
            className="relative w-[320px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0A1626] shadow-2xl shadow-black/40"
          >
            <span aria-hidden className="border-beam pointer-events-none z-10" />

            <div className="flex items-center gap-3 bg-[#0B1120] px-5 py-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/15">
                <Image src="/Logo.webp" alt="" width={22} height={22} className="size-[22px] object-contain" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F5F7FA]">Iniciá una conversación</p>
                <p className="text-xs text-[#94A3B8]">Línea de atención — respuesta en horario hábil</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl rounded-tl-sm bg-[#0B1120] px-4 py-3 text-sm text-[#94A3B8]">
                {greetingReady ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    ¡Hola! 👋 ¿Necesitás una cotización o tenés alguna consulta? Escribinos
                    y seguimos la conversación por WhatsApp.
                  </motion.span>
                ) : (
                  <span className="flex items-center gap-1 py-0.5" aria-label="Escribiendo">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-[#94A3B8]"
                        animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Escribí un mensaje…"
                className="w-full resize-none rounded-lg border border-white/10 bg-[#0B1120] px-3 py-2 text-sm text-[#F5F7FA] placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none"
              />

              <button
                type="button"
                onClick={send}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#60A5FA]"
              >
                <WhatsAppIcon className="size-4" />
                Enviar por WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {peekVisible && !open && (
            <motion.button
              type="button"
              onClick={toggle}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0A1626] px-4 py-2.5 text-left text-sm whitespace-nowrap text-[#F5F7FA] shadow-xl shadow-black/40"
            >
              ¿Necesitás ayuda? Escribinos
            </motion.button>
          )}
        </AnimatePresence>

        {!open && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-75 motion-reduce:animate-none"
          />
        )}

        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={open ? "Cerrar chat de WhatsApp" : "Chatear por WhatsApp"}
          aria-expanded={open}
          className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30"
        >
          {open ? (
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <WhatsAppIcon className="size-7" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default FloatingWhatsApp;
