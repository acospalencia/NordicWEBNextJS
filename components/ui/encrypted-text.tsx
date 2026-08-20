"use client";

import { useEffect, useState } from "react";

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

type EncryptedTextProps = {
  text: string;
  className?: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
  charset?: string;
  scrambleIntervalMs?: number;
  startDelayMs?: number;
};

function randomChar(charset: string) {
  return charset[Math.floor(Math.random() * charset.length)];
}

export function EncryptedText({
  text,
  className,
  encryptedClassName = "text-neutral-500",
  revealedClassName = "text-white",
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  scrambleIntervalMs = 35,
  startDelayMs = 0,
}: EncryptedTextProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [display, setDisplay] = useState(() => text.split(""));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealedCount(text.length);
      setDisplay(text.split(""));
      return;
    }

    setRevealedCount(0);
    let interval: ReturnType<typeof setInterval>;

    const tick = (startedAt: number) => {
      const elapsed = Date.now() - startedAt;
      const count = Math.min(text.length, Math.floor(elapsed / revealDelayMs));
      setRevealedCount(count);
      setDisplay(
        text.split("").map((char, i) => (i < count || char === " " ? char : randomChar(charset)))
      );
      if (count >= text.length) {
        clearInterval(interval);
      }
    };

    const timeout = setTimeout(() => {
      const startedAt = Date.now();
      interval = setInterval(() => tick(startedAt), scrambleIntervalMs);
      tick(startedAt);
    }, startDelayMs);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, revealDelayMs, charset, scrambleIntervalMs, startDelayMs]);

  return (
    <span className={className}>
      {display.map((char, i) => (
        <span key={i} className={i < revealedCount ? revealedClassName : encryptedClassName}>
          {char}
        </span>
      ))}
    </span>
  );
}
