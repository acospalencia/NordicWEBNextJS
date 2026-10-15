"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BellRing,
  CirclePlus,
  Loader2,
  Mail,
  Menu,
  Search,
  UserRoundCheck,
  X,
} from "lucide-react";
import {
  assignTechnician,
  createTicketAsAdmin,
  getAdminTicketsForClient,
  updateTicketAsAdmin,
} from "@/app/portal/actions";
import {
  ActionNotice,
  TicketActionButton,
  TicketActionMenu,
  TicketManagementCard,
} from "@/components/portal/ticket-ui";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  type PortalActionState,
  type PortalTicket,
  type PortalUser,
} from "@/lib/portal/types";

type AdminTab = "Abierto" | "En Proceso" | "Cerrado";
type AdminStatus = "En Proceso" | "Resuelto" | "Cerrado" | "Reabrir";
type AdminModal =
  | { kind: "assign"; ticket: PortalTicket }
  | { kind: "status"; ticket: PortalTicket; status: AdminStatus }
  | null;

type TicketToast = {
  ticket: PortalTicket;
  clientName: string;
};

type ClientCounts = { open: number; progress: number; closed: number };

const ALERT_QUEUE_STORAGE_KEY = "nordictech-admin-ticket-alert-queue";
let sharedTicketAudioContext: AudioContext | null = null;

function getTicketAudioContext() {
  if (sharedTicketAudioContext?.state !== "closed") {
    return sharedTicketAudioContext;
  }
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  sharedTicketAudioContext = new AudioContextClass();
  return sharedTicketAudioContext;
}

function emptyCounts(): ClientCounts {
  return { open: 0, progress: 0, closed: 0 };
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

async function playTicketTone(
  context: AudioContext,
  priority: PortalTicket["prioridad"]
) {
  if (context.state === "suspended") {
    await context.resume();
  }
  if (context.state !== "running") return;
  const profile =
    priority === "Crítica"
      ? {
          frequencies: [1046, 784, 1174, 880, 1397],
          volume: 0.26,
          spacing: 0.11,
          duration: 0.2,
          wave: "square" as OscillatorType,
        }
      : priority === "Alta"
        ? {
            frequencies: [784, 1046, 1318],
            volume: 0.17,
            spacing: 0.13,
            duration: 0.2,
            wave: "sawtooth" as OscillatorType,
          }
        : priority === "Baja"
          ? {
              frequencies: [523],
              volume: 0.08,
              spacing: 0.1,
              duration: 0.24,
              wave: "sine" as OscillatorType,
            }
          : {
              frequencies: [659, 880],
              volume: 0.12,
              spacing: 0.15,
              duration: 0.22,
              wave: "triangle" as OscillatorType,
            };
  const start = context.currentTime + 0.01;
  profile.frequencies.forEach((frequency, index) => {
    const noteStart = start + index * profile.spacing;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = profile.wave;
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(profile.volume, noteStart + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + profile.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + profile.duration + 0.02);
  });
}

function useDebouncedValue(value: string, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);
  return debounced;
}

export function AdminTicketDashboard({
  adminId,
  clients,
  technicians,
  initialTickets,
  initialTicketIndex,
}: {
  adminId: number;
  clients: PortalUser[];
  technicians: PortalUser[];
  initialTickets: PortalTicket[];
  initialTicketIndex: PortalTicket[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id_usuario ?? 0);
  const [tickets, setTickets] = useState(initialTickets);
  const [ticketIndex, setTicketIndex] = useState(initialTicketIndex);
  const [tab, setTab] = useState<AdminTab>("Abierto");
  const [clientQuery, setClientQuery] = useState("");
  const [ticketQuery, setTicketQuery] = useState("");
  const debouncedTicketQuery = useDebouncedValue(ticketQuery);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<AdminModal>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState<{ status: "success" | "error"; message: string } | null>(null);
  const [toasts, setToasts] = useState<TicketToast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const notifiedTicketIds = useRef(
    new Set(initialTicketIndex.filter((ticket) => ticket.activo === 1).map((ticket) => ticket.id_ticket))
  );
  const soundReady = useRef(false);
  const soundTimers = useRef<number[]>([]);
  const alertQueueHydrated = useRef(false);
  const alertQueueStorageKey = `${ALERT_QUEUE_STORAGE_KEY}:${adminId}`;

  const activeClient = clients.find((client) => client.id_usuario === clientId);
  const clientsById = useMemo(
    () => new Map(clients.map((client) => [client.id_usuario, client])),
    [clients]
  );
  const visibleClients = useMemo(() => {
    const search = clientQuery.trim().toLowerCase();
    if (!search) return clients;
    return clients.filter((client) =>
      `${client.nombre} ${client.email} ${client.codigo_empresa ?? ""}`.toLowerCase().includes(search)
    );
  }, [clientQuery, clients]);

  const clientCounts = useMemo(() => {
    const totals = new Map<number, ClientCounts>();
    ticketIndex.forEach((ticket) => {
      if (ticket.activo !== 1 || ticket.id_usuario <= 0) return;
      const current = totals.get(ticket.id_usuario) ?? emptyCounts();
      if (ticket.estado === "Abierto") current.open += 1;
      else if (ticket.estado === "En Proceso") current.progress += 1;
      else if (ticket.estado === "Cerrado" || ticket.estado === "Resuelto") current.closed += 1;
      totals.set(ticket.id_usuario, current);
    });
    return totals;
  }, [ticketIndex]);

  const selectedCounts = clientCounts.get(clientId) ?? emptyCounts();
  const counts = {
    Abierto: selectedCounts.open,
    "En Proceso": selectedCounts.progress,
    Cerrado: selectedCounts.closed,
  };

  const visibleTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const inTab =
        tab === "Cerrado"
          ? ticket.estado === "Cerrado" || ticket.estado === "Resuelto"
          : ticket.estado === tab;
      return inTab;
    });
  }, [tab, tickets]);

  const ticketSearchResults = useMemo(() => {
    const query = debouncedTicketQuery.trim().toLocaleLowerCase("es");
    if (!query) return [];
    return ticketIndex
      .filter((ticket) => {
        if (ticket.activo !== 1) return false;
        const client = clientsById.get(ticket.id_usuario);
        return `#tk-${ticket.id_ticket} tk-${ticket.id_ticket} ${ticket.id_ticket} ${ticket.titulo} ${ticket.cliente_nombre ?? client?.nombre ?? ""} ${client?.codigo_empresa ?? ""}`
          .toLocaleLowerCase("es")
          .includes(query);
      })
      .slice(0, 50);
  }, [clientsById, debouncedTicketQuery, ticketIndex]);

  const loadClientTickets = useCallback(async (nextClientId: number) => {
    const result = await getAdminTicketsForClient(nextClientId);
    if (result.status === "success") {
      setTickets(result.tickets);
      return;
    }
    setTickets([]);
    setNotice({ status: "error", message: result.message ?? "No fue posible cargar los tickets." });
  }, []);

  const enableTicketSound = useCallback(async (playPreview = false) => {
    const context = getTicketAudioContext();
    if (!context) {
      soundReady.current = false;
      setSoundEnabled(false);
      return;
    }
    try {
      if (context.state === "suspended") await context.resume();
      const enabled = context.state === "running";
      soundReady.current = enabled;
      setSoundEnabled(enabled);
      if (enabled && playPreview) await playTicketTone(context, "Media");
    } catch {
      soundReady.current = false;
      setSoundEnabled(false);
    }
  }, []);

  const refreshTicketIndex = useCallback(
    async (notify = true) => {
      const response = await fetch("/api/portal/admin/tickets", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/portal/iniciar-sesion");
        return;
      }
      if (!response.ok) return;
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !("tickets" in payload)) return;
      const nextTickets = (payload as { tickets?: unknown }).tickets;
      if (!Array.isArray(nextTickets)) return;

      const normalized = nextTickets.filter(
        (ticket): ticket is PortalTicket =>
          !!ticket &&
          typeof ticket === "object" &&
          Number.isInteger(Number((ticket as PortalTicket).id_ticket))
      );
      const freshTickets = notify
        ? normalized.filter(
            (ticket) =>
              ticket.activo === 1 && !notifiedTicketIds.current.has(ticket.id_ticket)
          )
        : [];

      normalized.forEach((ticket) => notifiedTicketIds.current.add(ticket.id_ticket));
      setTicketIndex(normalized);

      if (freshTickets.length) {
        const nextToasts = freshTickets.map((ticket) => ({
          ticket,
          clientName: ticket.cliente_nombre ?? "Cliente sin nombre",
        }));
        setToasts((current) => {
          const queuedIds = new Set(current.map((toast) => toast.ticket.id_ticket));
          return [
            ...current,
            ...nextToasts.filter((toast) => !queuedIds.has(toast.ticket.id_ticket)),
          ];
        });
        freshTickets.forEach((ticket, index) => {
          const context = sharedTicketAudioContext;
          if (soundReady.current && context) {
            soundTimers.current.push(
              window.setTimeout(
                () => {
                  void playTicketTone(context, ticket.prioridad).catch(() => {
                    soundReady.current = false;
                    setSoundEnabled(false);
                  });
                },
                index * 750
              )
            );
          }
        });
        if (freshTickets.some((ticket) => ticket.id_usuario === clientId)) {
          await loadClientTickets(clientId);
        }
      }
    },
    [clientId, loadClientTickets, router]
  );

  useEffect(() => {
    const enableSound = () => {
      void enableTicketSound(false);
    };
    const restoreEnabledState = window.setTimeout(() => {
      if (sharedTicketAudioContext?.state === "running") {
        soundReady.current = true;
        setSoundEnabled(true);
      }
    }, 0);
    window.addEventListener("pointerdown", enableSound, { once: true });
    window.addEventListener("keydown", enableSound, { once: true });
    return () => {
      window.clearTimeout(restoreEnabledState);
      window.removeEventListener("pointerdown", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, [enableTicketSound]);

  useEffect(() => {
    const restoreQueue = window.setTimeout(() => {
      try {
        const stored = JSON.parse(
          window.localStorage.getItem(alertQueueStorageKey) ?? "[]"
        ) as unknown;
        const queuedIds = Array.isArray(stored)
          ? stored
              .map((id) => Number(id))
              .filter((id) => Number.isInteger(id) && id > 0)
          : [];
        const ticketsById = new Map(
          initialTicketIndex.map((ticket) => [ticket.id_ticket, ticket])
        );
        const restored = queuedIds.flatMap<TicketToast>((ticketId) => {
          const ticket = ticketsById.get(ticketId);
          if (!ticket || ticket.activo !== 1) return [];
          const client = clients.find(
            (item) => item.id_usuario === ticket.id_usuario
          );
          return [{
            ticket,
            clientName: ticket.cliente_nombre ?? client?.nombre ?? "Cliente sin nombre",
          }];
        });
        setToasts(restored);
      } catch {
        window.localStorage.removeItem(alertQueueStorageKey);
      } finally {
        alertQueueHydrated.current = true;
      }
    }, 0);
    return () => window.clearTimeout(restoreQueue);
  }, [alertQueueStorageKey, clients, initialTicketIndex]);

  useEffect(() => {
    if (!alertQueueHydrated.current) return;
    window.localStorage.setItem(
      alertQueueStorageKey,
      JSON.stringify(toasts.map((toast) => toast.ticket.id_ticket))
    );
  }, [alertQueueStorageKey, toasts]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshTicketIndex(true);
    }, 20_000);
    return () => window.clearInterval(timer);
  }, [refreshTicketIndex]);

  useEffect(
    () => () => {
      soundTimers.current.forEach((timer) => window.clearTimeout(timer));
    },
    []
  );

  function selectClient(nextClientId: number) {
    if (nextClientId === clientId) {
      setSidebarOpen(false);
      return;
    }
    setClientId(nextClientId);
    setTickets([]);
    setTab("Abierto");
    setTicketQuery("");
    setNotice(null);
    setSidebarOpen(false);
    startTransition(async () => {
      await loadClientTickets(nextClientId);
    });
  }

  function runAction(
    action: (formData: FormData) => Promise<PortalActionState>,
    formData: FormData
  ) {
    startTransition(async () => {
      const result = await action(formData);
      setNotice({
        status: result.status === "success" ? "success" : "error",
        message: result.message ?? "Sin respuesta.",
      });
      if (result.status === "success" && clientId > 0) {
        await loadClientTickets(clientId);
        await refreshTicketIndex(false);
        setModal(null);
      }
    });
  }

  function handleCreateTicket(formData: FormData) {
    const targetClientId = Number(formData.get("id_usuario_cliente"));
    startTransition(async () => {
      const result = await createTicketAsAdmin(formData);
      setNotice({
        status: result.status === "success" ? "success" : "error",
        message: result.message ?? "Sin respuesta.",
      });
      if (result.status === "success" && Number.isInteger(targetClientId) && targetClientId > 0) {
        setClientId(targetClientId);
        setTab("Abierto");
        await loadClientTickets(targetClientId);
        await refreshTicketIndex(false);
        setCreateOpen(false);
      }
    });
  }

  function navigateToTicket(toast: TicketToast) {
    const currentTicket =
      ticketIndex.find(
        (ticket) => ticket.id_ticket === toast.ticket.id_ticket
      ) ?? toast.ticket;
    const ticketClient =
      clients.find((client) => client.id_usuario === currentTicket.id_usuario) ??
      clients.find(
        (client) =>
          client.nombre.trim().toLocaleLowerCase("es") ===
          toast.clientName.trim().toLocaleLowerCase("es")
      );
    if (!ticketClient) return false;
    setClientId(ticketClient.id_usuario);
    setTab(
      currentTicket.estado === "Abierto"
        ? "Abierto"
        : currentTicket.estado === "En Proceso"
          ? "En Proceso"
          : "Cerrado"
    );
    setTicketQuery("");
    startTransition(async () => {
      await loadClientTickets(ticketClient.id_usuario);
      window.setTimeout(() => {
        document
          .getElementById(`ticket-${currentTicket.id_ticket}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    });
    return true;
  }

  function openTicketFromToast(toast: TicketToast) {
    if (!navigateToTicket(toast)) return;
    setToasts((current) =>
      current.filter((item) => item.ticket.id_ticket !== toast.ticket.id_ticket)
    );
  }

  function openIndexedTicket(ticket: PortalTicket) {
    navigateToTicket({
      ticket,
      clientName:
        ticket.cliente_nombre ?? clientsById.get(ticket.id_usuario)?.nombre ?? "Cliente sin nombre",
    });
  }

  return (
    <section className="relative mx-auto min-h-[calc(100dvh-5rem)] max-w-[1600px] lg:grid lg:grid-cols-[310px_minmax(0,1fr)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar lista de clientes"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 top-20 z-40 bg-[#020617]/75 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 mt-20 flex w-[min(88vw,310px)] flex-col border-r border-white/10 bg-[#081321] shadow-2xl transition-transform lg:sticky lg:top-20 lg:z-10 lg:mt-0 lg:h-[calc(100dvh-5rem)] lg:w-auto lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
                Directorio
              </p>
              <h2 className="mt-1 text-base font-semibold text-white">Clientes</h2>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar panel"
              className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-[#94A3B8] lg:hidden"
            >
              <X className="size-4" />
            </button>
          </div>
          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748B]" />
            <input
              value={clientQuery}
              onChange={(event) => setClientQuery(event.target.value)}
              className="portal-input portal-input-icon"
              placeholder="Nombre, correo o empresa…"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {visibleClients.length ? (
            visibleClients.map((client) => (
              <button
                key={client.id_usuario}
                type="button"
                onClick={() => selectClient(client.id_usuario)}
                className={`mb-1.5 w-full rounded-lg border px-3.5 py-3 text-left transition-colors ${
                  client.id_usuario === clientId
                    ? "border-[#3B82F6]/45 bg-[#3B82F6]/12 shadow-[inset_3px_0_0_#3B82F6]"
                    : "border-transparent hover:border-white/10 hover:bg-white/[0.035]"
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.05em] text-white">
                    {client.nombre}
                  </span>
                  {client.codigo_empresa && (
                    <span className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[8px] text-[#94A3B8]">
                      {client.codigo_empresa}
                    </span>
                  )}
                </span>
                <span className="mt-1 block truncate text-[10px] text-[#64748B]">{client.email}</span>
                <ClientTicketBadges counts={clientCounts.get(client.id_usuario) ?? emptyCounts()} />
              </button>
            ))
          ) : (
            <p className="p-5 text-center text-xs text-[#64748B]">No se encontraron clientes.</p>
          )}
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#CBD5E1] lg:hidden"
                  aria-label="Abrir lista de clientes"
                >
                  <Menu className="size-5" />
                </button>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
                    Consola de soporte
                  </p>
                  <h1 className="mt-1 truncate text-2xl font-semibold uppercase tracking-tight text-white sm:text-3xl">
                    {activeClient?.nombre ?? "Seleccioná un cliente"}
                  </h1>
                </div>
              </div>
              <p className="mt-2 truncate text-xs text-[#64748B]">
                {activeClient
                  ? `ID ${activeClient.id_usuario} · ${activeClient.email}${activeClient.codigo_empresa ? ` · Ref. ${activeClient.codigo_empresa}` : ""}`
                  : "Elegí un cliente del panel lateral para auditar sus tickets."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => void enableTicketSound(true)}
                className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-semibold transition-colors ${
                  soundEnabled
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15"
                    : "border-amber-400/35 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                }`}
                aria-pressed={soundEnabled}
              >
                <BellRing className="size-4" />
                {soundEnabled ? "Probar sonido" : "Activar sonido"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotice(null);
                  setCreateOpen(true);
                }}
                disabled={!clients.some((client) => client.activo === 1)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#60A5FA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CirclePlus className="size-4" />
                Abrir ticket
              </button>
              <div className="rounded-lg border border-white/10 bg-[#0A1626] px-4 py-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#64748B]">Flujo seleccionado</p>
                <p className="mt-1 text-xs font-semibold text-[#60A5FA]">Gestión de incidentes</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ActionNotice notice={notice} />
          </div>

          {activeClient ? (
            <div aria-busy={isPending}>
              <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-[#0A1626]">
                {(["Abierto", "En Proceso", "Cerrado"] as AdminTab[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={`relative px-2 py-3.5 text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors sm:text-xs ${
                      tab === item
                        ? "bg-[#3B82F6] text-white"
                        : "text-[#94A3B8] hover:bg-white/[0.035] hover:text-white"
                    }`}
                  >
                    {item} ({counts[item]})
                  </button>
                ))}
              </div>

              <label className="relative mt-4 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  value={ticketQuery}
                  onChange={(event) => setTicketQuery(event.target.value)}
                  className="portal-input portal-input-icon portal-input-with-clear"
                  placeholder="Buscar por número, identificador, cliente o asunto…"
                  aria-label="Buscar tickets"
                />
                {ticketQuery && (
                  <button
                    type="button"
                    onClick={() => setTicketQuery("")}
                    aria-label="Limpiar búsqueda de tickets"
                    className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#64748B] hover:bg-white/5 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </label>

              {debouncedTicketQuery ? (
                <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#0A1626]">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                      Resultados en todos los clientes ({ticketSearchResults.length})
                    </p>
                  </div>
                  {ticketSearchResults.length ? (
                    <div className="divide-y divide-white/5">
                      {ticketSearchResults.map((ticket) => {
                        const client = clientsById.get(ticket.id_usuario);
                        return (
                          <button
                            key={ticket.id_ticket}
                            type="button"
                            onClick={() => openIndexedTicket(ticket)}
                            className="flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between"
                          >
                            <span className="min-w-0">
                              <span className="font-mono text-[10px] font-semibold text-[#60A5FA]">#TK-{ticket.id_ticket}</span>
                              <span className="mt-1 block truncate text-xs font-semibold text-white">{ticket.titulo}</span>
                              <span className="mt-1 block truncate text-[10px] text-[#64748B]">
                                {ticket.cliente_nombre ?? client?.nombre ?? "Cliente sin nombre"}
                                {client?.codigo_empresa ? ` · ${client.codigo_empresa}` : ""}
                              </span>
                            </span>
                            <span className="w-fit shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase text-[#94A3B8]">
                              {ticket.estado}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="px-5 py-10 text-center text-sm text-[#94A3B8]">No se encontraron tickets con esta búsqueda.</p>
                  )}
                </div>
              ) : isPending && !tickets.length ? (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-12 text-sm text-[#94A3B8]">
                  <Loader2 className="size-4 animate-spin text-[#60A5FA]" /> Cargando tickets…
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {visibleTickets.length ? (
                    visibleTickets.map((ticket) => (
                      <TicketManagementCard
                        key={ticket.id_ticket}
                        ticket={ticket}
                        actions={<AdminTicketActions ticket={ticket} onAction={setModal} />}
                      />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-10 text-center text-sm text-[#94A3B8]">
                      No hay tickets en esta categoría.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-12 text-center text-sm text-[#94A3B8]">
              Seleccioná un cliente del panel lateral para cargar su flujo de soporte.
            </div>
          )}
        </div>
      </main>

      {!!toasts.length && <div
        className="fixed bottom-5 right-5 z-[90] flex max-h-[calc(100dvh-2.5rem)] w-[min(94vw,420px)] flex-col gap-3 overflow-y-auto overscroll-contain pr-1"
        aria-live="polite"
        aria-label={`${toasts.length} notificaciones de tickets pendientes`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#07111F]/95 px-4 py-3 shadow-xl backdrop-blur">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-white">
            <BellRing className="size-4 text-[#60A5FA]" />
            Alertas pendientes
          </span>
          <span className="rounded-full bg-[#3B82F6]/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#93C5FD]">
            {toasts.length}
          </span>
        </div>
        {toasts.map((toast) => {
          const style = ticketAlertStyle(toast.ticket.prioridad);
          return (
            <button
              key={toast.ticket.id_ticket}
              type="button"
              onClick={() => openTicketFromToast(toast)}
              aria-label={`Abrir ticket ${toast.ticket.id_ticket}, prioridad ${toast.ticket.prioridad}`}
              className={`rounded-xl border p-5 text-left shadow-2xl shadow-black/50 transition-colors sm:p-6 ${style.container}`}
            >
              <span className="flex items-start gap-4">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
                  <BellRing className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.11em] ${style.badge}`}>
                    Prioridad {toast.ticket.prioridad}
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-white">
                    Nuevo ticket #TK-{toast.ticket.id_ticket}
                  </span>
                  <span className="mt-1.5 block truncate text-xs text-[#94A3B8]">
                    {toast.clientName} · {toast.ticket.titulo}
                  </span>
                  <span className={`mt-3 block text-[11px] font-semibold uppercase tracking-[0.1em] ${style.action}`}>
                    Abrir ticket
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>}

      {modal && (
        <AdminActionModal
          modal={modal}
          technicians={technicians}
          pending={isPending}
          onClose={() => setModal(null)}
          onAssign={(formData) => runAction(assignTechnician, formData)}
          onStatus={(formData) => runAction(updateTicketAsAdmin, formData)}
        />
      )}

      {createOpen && (
        <AdminCreateTicketModal
          clients={clients}
          defaultClientId={clientId}
          notice={notice}
          pending={isPending}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </section>
  );
}

function ClientTicketBadges({ counts }: { counts: ClientCounts }) {
  return (
    <span className="mt-2 flex flex-wrap gap-1.5" aria-label="Conteo de tickets del cliente">
      <span title="Tickets abiertos" className="rounded-full border border-rose-400/20 bg-rose-400/10 px-2 py-0.5 text-[8px] font-semibold text-rose-300">
        A {counts.open}
      </span>
      <span title="Tickets en proceso" className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[8px] font-semibold text-amber-300">
        P {counts.progress}
      </span>
      <span title="Tickets cerrados" className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[8px] font-semibold text-emerald-300">
        C {counts.closed}
      </span>
    </span>
  );
}

function AdminCreateTicketModal({
  clients,
  defaultClientId,
  notice,
  pending,
  onClose,
  onSubmit,
}: {
  clients: PortalUser[];
  defaultClientId: number;
  notice: { status: "success" | "error"; message: string } | null;
  pending: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  const [category, setCategory] = useState("");
  const activeClients = clients.filter(
    (client) => client.id_rol === 1 && client.activo === 1
  );
  const initialClientId = activeClients.some((client) => client.id_usuario === defaultClientId)
    ? defaultClientId
    : activeClients[0]?.id_usuario ?? 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/85 backdrop-blur-sm"
      />
      <div className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0A1626] p-5 shadow-2xl shadow-black/60 sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#3B82F6]">Administración · Nuevo incidente</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Abrir ticket para un cliente</h2>
            <p className="mt-2 max-w-lg text-xs leading-5 text-[#94A3B8]">
              Registrá la solicitud y seleccioná la cuenta que recibirá el seguimiento y la notificación.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#94A3B8] hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5">
          <ActionNotice notice={notice} />
        </div>

        <form action={onSubmit} className="space-y-4">
          <ModalField label="Cliente asignado">
            <select
              name="id_usuario_cliente"
              defaultValue={initialClientId || ""}
              required
              className="portal-input"
            >
              {!activeClients.length && <option value="">No hay clientes activos disponibles</option>}
              {activeClients.map((client) => (
                <option key={client.id_usuario} value={client.id_usuario}>
                  {client.nombre} · {client.email}
                </option>
              ))}
            </select>
          </ModalField>

          <ModalField label="Título del incidente">
            <input
              name="titulo"
              required
              minLength={4}
              maxLength={160}
              className="portal-input"
              placeholder="Ej. Pérdida de conexión en cámara perimetral"
            />
          </ModalField>

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField label="Prioridad solicitada">
              <select name="prioridad" defaultValue="Media" className="portal-input">
                {TICKET_PRIORITIES.map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </ModalField>
            <ModalField label="Categoría">
              <select
                name="categoria"
                required
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="portal-input"
              >
                <option value="" disabled>Seleccionar categoría</option>
                {TICKET_CATEGORIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </ModalField>
          </div>

          {category === "Otro" && (
            <ModalField label="Especificar categoría">
              <input
                name="otra_categoria"
                required
                maxLength={120}
                className="portal-input"
                placeholder="Ej. Redes, intercomunicación o sistema especial"
              />
            </ModalField>
          )}

          <ModalField label="Descripción técnica">
            <textarea
              name="descripcion"
              required
              minLength={10}
              rows={5}
              className="portal-input resize-none"
              placeholder="Detallá los síntomas, equipos afectados y cualquier prueba realizada…"
            />
          </ModalField>

          <div className="flex items-start gap-3 rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/10 px-4 py-3 text-xs leading-5 text-[#BFDBFE]">
            <Mail className="mt-0.5 size-4 shrink-0" />
            Al crear el ticket, el cliente recibirá un correo en la dirección registrada en su cuenta.
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-[#CBD5E1] hover:text-white"
            >
              Cancelar
            </button>
            <button
              disabled={pending || !activeClients.length}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#60A5FA] disabled:opacity-50"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : <CirclePlus className="size-4" />}
              Abrir ticket y notificar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminTicketActions({
  ticket,
  onAction,
}: {
  ticket: PortalTicket;
  onAction: (modal: Exclude<AdminModal, null>) => void;
}) {
  const finished = ticket.estado === "Cerrado" || ticket.estado === "Resuelto";
  return (
    <TicketActionMenu>
      {!finished && (
        <>
          <TicketActionButton
            tone="amber"
            onClick={() => onAction({ kind: "status", ticket, status: "En Proceso" })}
          >
            {ticket.estado === "Abierto" ? "Trabajar ticket" : "Agregar nota de avance"}
          </TicketActionButton>
          <TicketActionButton tone="violet" onClick={() => onAction({ kind: "assign", ticket })}>
            Asignar técnico
          </TicketActionButton>
          <TicketActionButton
            tone="green"
            onClick={() => onAction({ kind: "status", ticket, status: "Resuelto" })}
          >
            Resolver ticket
          </TicketActionButton>
          {ticket.estado === "En Proceso" && (
            <TicketActionButton
              tone="red"
              onClick={() => onAction({ kind: "status", ticket, status: "Cerrado" })}
            >
              Cerrar ticket
            </TicketActionButton>
          )}
        </>
      )}
      {finished && (
        <TicketActionButton onClick={() => onAction({ kind: "status", ticket, status: "Reabrir" })}>
          Reabrir en proceso
        </TicketActionButton>
      )}
    </TicketActionMenu>
  );
}

function AdminActionModal({
  modal,
  technicians,
  pending,
  onClose,
  onAssign,
  onStatus,
}: {
  modal: Exclude<AdminModal, null>;
  technicians: PortalUser[];
  pending: boolean;
  onClose: () => void;
  onAssign: (formData: FormData) => void;
  onStatus: (formData: FormData) => void;
}) {
  const statusCopy =
    modal.kind === "status"
      ? {
          "En Proceso": {
            title: modal.ticket.estado === "Abierto" ? "Trabajar incidente" : "Agregar nota de avance",
            description: "Registrá la actividad para mantener informados al cliente y al equipo.",
            label: "Nota de trabajo",
          },
          Resuelto: {
            title: "Resolver incidente",
            description: "Documentá el diagnóstico final y la solución aplicada.",
            label: "Reporte de resolución",
          },
          Cerrado: {
            title: "Cerrar ticket",
            description: "Indicá el motivo de la finalización definitiva del caso.",
            label: "Motivo de cierre",
          },
          Reabrir: {
            title: "Reabrir ticket",
            description: "El caso volverá al flujo de atención en proceso.",
            label: "Motivo de reapertura",
          },
        }[modal.status]
      : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute inset-0 bg-[#020617]/85 backdrop-blur-sm" />
      <div className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0A1626] p-5 shadow-2xl shadow-black/60 sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#3B82F6]">Ticket #TK-{modal.ticket.id_ticket}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {modal.kind === "assign" ? "Asignar técnico" : statusCopy?.title}
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#94A3B8]">
              {modal.kind === "assign"
                ? "Seleccioná al especialista y registrá las indicaciones de la asignación."
                : statusCopy?.description}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#94A3B8] hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        {modal.kind === "assign" ? (
          <form action={onAssign} className="mt-6 space-y-4">
            <input type="hidden" name="id_ticket" value={modal.ticket.id_ticket} />
            <ModalField label="Técnico asignado">
              <select name="id_tecnico" defaultValue={modal.ticket.id_tecnico ?? ""} required className="portal-input">
                <option value="" disabled>Seleccionar técnico</option>
                {technicians.map((technician) => (
                  <option key={technician.id_usuario} value={technician.id_usuario}>{technician.nombre}</option>
                ))}
              </select>
            </ModalField>
            <ModalField label="Instrucciones internas para el técnico">
              <textarea name="notas_tecnico" required rows={3} className="portal-input resize-none" placeholder="Pruebas, equipos o verificaciones requeridas…" />
            </ModalField>
            <ModalField label="Comentario visible para el cliente">
              <textarea name="comentario_cliente" required rows={3} className="portal-input resize-none" placeholder="Información sobre el inicio de la atención…" />
            </ModalField>
            <ModalActions pending={pending} onClose={onClose} disabled={!technicians.length} label="Confirmar asignación" />
          </form>
        ) : (
          <form action={onStatus} className="mt-6 space-y-4">
            <input type="hidden" name="id_ticket" value={modal.ticket.id_ticket} />
            <input type="hidden" name="estado" value={modal.status} />
            <ModalField label={statusCopy?.label ?? "Comentario"}>
              <textarea name="comentario" required rows={5} className="portal-input resize-none" placeholder="Detallá la actividad realizada…" autoFocus />
            </ModalField>
            <ModalActions pending={pending} onClose={onClose} label="Confirmar actualización" />
          </form>
        )}
      </div>
    </div>
  );
}

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function ModalActions({
  pending,
  onClose,
  label,
  disabled = false,
}: {
  pending: boolean;
  onClose: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
      <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-[#CBD5E1] hover:text-white">
        Cancelar
      </button>
      <button disabled={pending || disabled} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#60A5FA] disabled:opacity-50">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <UserRoundCheck className="size-4" />}
        {label}
      </button>
    </div>
  );
}
