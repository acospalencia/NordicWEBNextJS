"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ContactForm } from "@/components/contact-form";
import { Reveal, EASE } from "@/components/ui/reveal";

const CHANNELS = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "Final 50 Avenida Sur, Res. Flor Blanca #626, San Salvador, El Salvador",
  },
  {
    icon: Phone,
    label: "PBX",
    value: "(503) 2525-0797",
    href: "tel:+50325250797",
  },
  {
    icon: Mail,
    label: "Correo",
    value: "info@nordictech-corp.com",
    href: "mailto:info@nordictech-corp.com",
  },
];

export function Contact() {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE } },
  };

  return (
    <section id="contacto" className="scroll-mt-24 bg-[#07111F] px-6 py-20 sm:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
              Contacto
            </span>
            <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-[#F5F7FA] sm:text-4xl">
              Hablemos de tu proyecto
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[#94A3B8]">
              Estamos listos para ayudarte a diseñar e implementar soluciones tecnológicas a
              la medida.
            </p>
          </Reveal>

          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 space-y-7"
          >
            {CHANNELS.map((channel) => {
              const Icon = channel.icon;
              const content = (
                <>
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#0A1626] ring-1 ring-inset ring-white/10">
                    <Icon className="size-4.5 text-[#3B82F6]" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm leading-6 text-[#CBD5E1] transition-colors group-hover:text-[#F5F7FA] sm:text-base">
                    {channel.value}
                  </p>
                </>
              );

              return (
                <motion.li key={channel.label} variants={item} className="flex items-center gap-4">
                  {channel.href ? (
                    <a href={channel.href} className="group flex items-center gap-4">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
