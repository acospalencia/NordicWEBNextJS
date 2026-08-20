"use client";

import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function Reveal({ delay = 0, children, ...props }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE, delay: reduceMotion ? 0 : delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = HTMLMotionProps<"div"> & {
  stagger?: number;
};

export function RevealGroup({ stagger = 0.08, children, ...props }: RevealGroupProps) {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : stagger } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion();

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE } },
  };

  return (
    <motion.div variants={item} {...props}>
      {children}
    </motion.div>
  );
}
