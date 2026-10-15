"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BellRing, Volume2, VolumeX } from "lucide-react";
import {
  ADMIN_TICKETS_REFRESH_EVENT,
  ADMIN_TICKETS_UPDATED_EVENT,
} from "@/lib/portal/events";
import type { PortalTicket } from "@/lib/portal/types";

type TicketAlert = {
  ticket: PortalTicket;
  clientName: string;
};

type SoundProfile = {
  notes: Array<{ frequency: number; duration: number }>;
  gap: number;
  amplitude: number;
  harmonics: number;
};

const ALERT_QUEUE_STORAGE_KEY = "nordictech-admin-ticket-alert-queue";
const SOUND_PROFILES: Record<PortalTicket["prioridad"], SoundProfile> = {
  Baja: {
    notes: [{ frequency: 523, duration: 0.3 }],
    gap: 0,
    amplitude: 0.3,
    harmonics: 1,
  },
  Media: {
    notes: [
      { frequency: 659, duration: 0.22 },
      { frequency: 880, duration: 0.28 },
    ],
    gap: 0.08,
    amplitude: 0.42,
    harmonics: 1,
  },
  Alta: {
    notes: [
      { frequency: 784, duration: 0.2 },
      { frequency: 1046, duration: 0.2 },
      { frequency: 1318, duration: 0.32 },
    ],
    gap: 0.06,
    amplitude: 0.56,
    harmonics: 2,
  },
  Crítica: {
    notes: [
      { frequency: 1046, duration: 0.18 },
      { frequency: 740, duration: 0.18 },
      { frequency: 1174, duration: 0.18 },
      { frequency: 880, duration: 0.18 },
      { frequency: 1397, duration: 0.38 },
    ],
    gap: 0.045,
    amplitude: 0.78,
    harmonics: 3,
  },
};

let sharedAlertAudio: HTMLAudioElement | null = null;
let sharedAlertAudioUnlocked = false;
const soundUrls = new Map<PortalTicket["prioridad"], string>();

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function createSoundUrl(priority: PortalTicket["prioridad"]) {
  const cached = soundUrls.get(priority);
  if (cached) return cached;
  const profile = SOUND_PROFILES[priority] ?? SOUND_PROFILES.Media;
  const sampleRate = 44_100;
  const totalDuration = profile.notes.reduce(
    (total, note, index) => total + note.duration + (index ? profile.gap : 0),
    0
  );
  const sampleCount = Math.ceil(totalDuration * sampleRate);
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, sampleCount * 2, true);

  let noteStart = 0;
  profile.notes.forEach((note, noteIndex) => {
    if (noteIndex) noteStart += profile.gap;
    const startSample = Math.floor(noteStart * sampleRate);
    const noteSamples = Math.floor(note.duration * sampleRate);
    for (let index = 0; index < noteSamples; index += 1) {
      const progress = index / noteSamples;
      const attack = Math.min(1, progress / 0.08);
      const release = Math.min(1, (1 - progress) / 0.18);
      const envelope = Math.max(0, Math.min(attack, release));
      const time = index / sampleRate;
      let wave = 0;
      for (let harmonic = 1; harmonic <= profile.harmonics; harmonic += 1) {
        wave += Math.sin(2 * Math.PI * note.frequency * harmonic * time) / harmonic;
      }
      const sample = Math.max(
        -1,
        Math.min(1, wave * profile.amplitude * envelope)
      );
      view.setInt16(44 + (startSample + index) * 2, sample * 0x7fff, true);
    }
    noteStart += note.duration;
  });

  const url = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
  soundUrls.set(priority, url);
  return url;
}

function getAlertAudio() {
  if (!sharedAlertAudio) {
    sharedAlertAudio = new Audio();
    sharedAlertAudio.preload = "auto";
    sharedAlertAudio.volume = 1;
  }
  return sharedAlertAudio;
}

async function playAlertSound(priority: PortalTicket["prioridad"]) {
  const audio = getAlertAudio();
  audio.pause();
  audio.src = createSoundUrl(priority);
  audio.currentTime = 0;
  await audio.play();
}

function ticketAlertStyle(priority: PortalTicket["prioridad"]) {
  if (priority === "Crítica") {
    return {
      container: "border-rose-400/50 bg-[#211019] hover:border-rose-300/80",
      icon: "bg-rose-400/15 text-rose-300",
      badge: "border-rose-400/30 bg-rose-400/10 text-rose-200",
      action: "text-rose-300",
    };
  }
  if (priority === "Alta") {
    return {
      container: "border-amber-400/45 bg-[#1D190F] hover:border-amber-300/75",
      icon: "bg-amber-400/15 text-amber-300",
      badge: "border-amber-400/30 bg-amber-400/10 text-amber-200",
      action: "text-amber-300",
    };
  }
  if (priority === "Baja") {
    return {
      container: "border-emerald-400/40 bg-[#0B1C1B] hover:border-emerald-300/70",
      icon: "bg-emerald-400/15 text-emerald-300",
      badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
      action: "text-emerald-300",
    };
  }
  return {
    container: "border-[#3B82F6]/40 bg-[#0A1626] hover:border-[#60A5FA]",
    icon: "bg-[#3B82F6]/15 text-[#60A5FA]",
    badge: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#93C5FD]",
    action: "text-[#60A5FA]",
  };
}

export function AdminTicketAlerts({ adminId }: { adminId: number }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState<TicketAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundError, setSoundError] = useState<string | null>(null);
  const initialized = useRef(false);
  const notifiedIds = useRef(new Set<number>());
  const queuedIds = useRef<number[]>([]);
  const soundTimers = useRef<number[]>([]);
  const storageKey = `${ALERT_QUEUE_STORAGE_KEY}:${adminId}`;

  const saveQueue = useCallback(
    (nextAlerts: TicketAlert[]) => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(nextAlerts.map((alert) => alert.ticket.id_ticket))
      );
    },
    [storageKey]
  );

  const activateSound = useCallback(async () => {
    setSoundError(null);
    try {
      await playAlertSound("Media");
      sharedAlertAudioUnlocked = true;
      setSoundEnabled(true);
    } catch {
      sharedAlertAudioUnlocked = false;
      setSoundEnabled(false);
      setSoundError(
        "Edge bloqueó el audio. Permití sonido para este sitio y volvé a intentarlo."
      );
    }
  }, []);

  const refreshTickets = useCallback(
    async (notify = true) => {
      const response = await fetch("/api/portal/admin/tickets", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/portal/iniciar-sesion");
        return;
      }
      if (!response.ok) return;
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !("tickets" in payload)) return;
      const value = (payload as { tickets?: unknown }).tickets;
      if (!Array.isArray(value)) return;
      const tickets = value.filter(
        (ticket): ticket is PortalTicket =>
          !!ticket &&
          typeof ticket === "object" &&
          Number.isInteger(Number((ticket as PortalTicket).id_ticket))
      );
      const activeTickets = tickets.filter((ticket) => ticket.activo === 1);
      const ticketsById = new Map(
        activeTickets.map((ticket) => [ticket.id_ticket, ticket])
      );

      if (!initialized.current) {
        activeTickets.forEach((ticket) => notifiedIds.current.add(ticket.id_ticket));
        const restored = queuedIds.current.flatMap<TicketAlert>((ticketId) => {
          const ticket = ticketsById.get(ticketId);
          return ticket
            ? [{ ticket, clientName: ticket.cliente_nombre ?? "Cliente sin nombre" }]
            : [];
        });
        initialized.current = true;
        setAlerts(restored);
        saveQueue(restored);
      } else {
        const fresh = notify
          ? activeTickets.filter(
              (ticket) => !notifiedIds.current.has(ticket.id_ticket)
            )
          : [];
        activeTickets.forEach((ticket) => notifiedIds.current.add(ticket.id_ticket));
        setAlerts((current) => {
          const refreshed = current.flatMap<TicketAlert>((alert) => {
            const ticket = ticketsById.get(alert.ticket.id_ticket);
            return ticket ? [{ ...alert, ticket }] : [];
          });
          const existingIds = new Set(
            refreshed.map((alert) => alert.ticket.id_ticket)
          );
          const next = [
            ...refreshed,
            ...fresh
              .filter((ticket) => !existingIds.has(ticket.id_ticket))
              .map((ticket) => ({
                ticket,
                clientName: ticket.cliente_nombre ?? "Cliente sin nombre",
              })),
          ];
          saveQueue(next);
          return next;
        });

        if (fresh.length && sharedAlertAudioUnlocked) {
          fresh.forEach((ticket, index) => {
            soundTimers.current.push(
              window.setTimeout(() => {
                void playAlertSound(ticket.prioridad).catch(() => {
                  sharedAlertAudioUnlocked = false;
                  setSoundEnabled(false);
                  setSoundError("El navegador volvió a bloquear el sonido.");
                });
              }, index * 1400)
            );
          });
        }
      }

      window.dispatchEvent(
        new CustomEvent(ADMIN_TICKETS_UPDATED_EVENT, { detail: { tickets } })
      );
    },
    [router, saveQueue]
  );

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(
        window.localStorage.getItem(storageKey) ?? "[]"
      );
      queuedIds.current = Array.isArray(stored)
        ? stored
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0)
        : [];
    } catch {
      queuedIds.current = [];
      window.localStorage.removeItem(storageKey);
    }
    const restoreSoundState = window.setTimeout(() => {
      setSoundEnabled(sharedAlertAudioUnlocked);
    }, 0);
    void refreshTickets(true);
    const timer = window.setInterval(() => void refreshTickets(true), 20_000);
    const requestRefresh = () => void refreshTickets(false);
    const activeSoundTimers = soundTimers.current;
    window.addEventListener(ADMIN_TICKETS_REFRESH_EVENT, requestRefresh);
    return () => {
      window.clearTimeout(restoreSoundState);
      window.clearInterval(timer);
      activeSoundTimers.forEach((soundTimer) => window.clearTimeout(soundTimer));
      window.removeEventListener(ADMIN_TICKETS_REFRESH_EVENT, requestRefresh);
    };
  }, [refreshTickets, storageKey]);

  function openAlert(alert: TicketAlert) {
    const remaining = alerts.filter(
      (item) => item.ticket.id_ticket !== alert.ticket.id_ticket
    );
    setAlerts(remaining);
    saveQueue(remaining);
    const params = new URLSearchParams({
      ticket: String(alert.ticket.id_ticket),
    });
    if (alert.ticket.id_usuario > 0) {
      params.set("client", String(alert.ticket.id_usuario));
    }
    router.push(`/portal/administracion?${params.toString()}`);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex max-h-[calc(100dvh-2.5rem)] w-[min(94vw,420px)] flex-col gap-3 overflow-y-auto overscroll-contain pr-1">
      <div className="sticky top-0 z-10 rounded-xl border border-white/10 bg-[#07111F]/95 p-3 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-white">
            <BellRing className="size-4 text-[#60A5FA]" />
            {alerts.length ? "Alertas pendientes" : "Alertas de tickets"}
          </span>
          <span className="rounded-full bg-[#3B82F6]/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#93C5FD]">
            {alerts.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => void activateSound()}
          className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors ${
            soundEnabled
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15"
              : "border-amber-400/35 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
          }`}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          {soundEnabled ? "Probar sonido" : "Activar sonido"}
        </button>
        {soundError && (
          <p className="mt-2 text-[10px] leading-4 text-rose-300">{soundError}</p>
        )}
      </div>

      <div aria-live="polite" aria-label={`${alerts.length} notificaciones de tickets pendientes`} className="space-y-3">
        {alerts.map((alert) => {
          const style = ticketAlertStyle(alert.ticket.prioridad);
          return (
            <button
              key={alert.ticket.id_ticket}
              type="button"
              onClick={() => openAlert(alert)}
              aria-label={`Abrir ticket ${alert.ticket.id_ticket}, prioridad ${alert.ticket.prioridad}`}
              className={`w-full rounded-xl border p-5 text-left shadow-2xl shadow-black/50 transition-colors sm:p-6 ${style.container}`}
            >
              <span className="flex items-start gap-4">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
                  <BellRing className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.11em] ${style.badge}`}>
                    Prioridad {alert.ticket.prioridad}
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-white">
                    Nuevo ticket #TK-{alert.ticket.id_ticket}
                  </span>
                  <span className="mt-1.5 block truncate text-xs text-[#94A3B8]">
                    {alert.clientName} · {alert.ticket.titulo}
                  </span>
                  <span className={`mt-3 block text-[11px] font-semibold uppercase tracking-[0.1em] ${style.action}`}>
                    Abrir ticket
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
