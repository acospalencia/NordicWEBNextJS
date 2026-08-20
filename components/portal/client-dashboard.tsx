"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CirclePlus, Loader2, TicketX, X } from "lucide-react";
import { closeTicketAsClient, createPortalTicket } from "@/app/portal/actions";
import {
  ActionNotice,
  TicketActionButton,
  TicketActionMenu,
  TicketManagementCard,
} from "@/components/portal/ticket-ui";
import { TICKET_CATEGORIES, TICKET_PRIORITIES, type PortalTicket } from "@/lib/portal/types";

type ClientTab = "Abierto" | "En Proceso" | "Cerrado";

export function ClientDashboard({ tickets, clientName }: { tickets: PortalTicket[]; clientName: string }) {
  const [tab, setTab] = useState<ClientTab>("Abierto");
  const [notice, setNotice] = useState<{ status: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("");
  const [closingTicket, setClosingTicket] = useState<PortalTicket | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const visibleTickets = useMemo(
    () =>
      tickets.filter((ticket) =>
        tab === "Cerrado"
          ? ticket.estado === "Cerrado" || ticket.estado === "Resuelto"
          : ticket.estado === tab
      ),
    [tab, tickets]
  );

  const counts = {
    Abierto: tickets.filter((ticket) => ticket.estado === "Abierto").length,
    "En Proceso": tickets.filter((ticket) => ticket.estado === "En Proceso").length,
    Cerrado: tickets.filter((ticket) => ["Cerrado", "Resuelto"].includes(ticket.estado)).length,
  };

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createPortalTicket(formData);
      setNotice({ status: result.status === "success" ? "success" : "error", message: result.message ?? "Sin respuesta." });
      if (result.status === "success") {
        formRef.current?.reset();
        setCategory("");
        setTab("Abierto");
        router.refresh();
      }
    });
  }

  function handleClose(formData: FormData) {
    startTransition(async () => {
      const result = await closeTicketAsClient(formData);
      setNotice({
        status: result.status === "success" ? "success" : "error",
        message: result.message ?? "Sin respuesta.",
      });
      if (result.status === "success") {
        setClosingTicket(null);
        setTab("Cerrado");
        router.refresh();
      }
    });
  }

  return (
    <section className="px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">Consola de cliente</span>
            <h1 className="mt-2 text-3xl font-semibold uppercase tracking-tight sm:text-4xl">Gestión de incidentes</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#94A3B8]">
              Creá solicitudes técnicas y consultá su asignación, avances y resolución.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0A1626] px-4 py-3 sm:min-w-52">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#64748B]">Identidad activa</p>
            <p className="mt-1 truncate text-xs font-semibold text-[#60A5FA]">{clientName}</p>
          </div>
        </div>

        <ActionNotice notice={notice} />

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <form ref={formRef} action={handleCreate} className="h-fit rounded-xl border border-white/10 bg-[#0A1626] p-5 sm:p-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#3B82F6]/15 text-[#60A5FA]">
                <CirclePlus className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold text-white">Nuevo ticket</h2>
                <p className="text-xs text-[#94A3B8]">Describí el incidente con detalle.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <PortalField label="Título">
                <input name="titulo" required maxLength={160} className="portal-input" placeholder="Ej. Cámara sin conexión" />
              </PortalField>
              <div className="grid grid-cols-2 gap-3">
                <PortalField label="Prioridad">
                  <select name="prioridad" defaultValue="Media" className="portal-input">
                    {TICKET_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
                  </select>
                </PortalField>
                <PortalField label="Categoría">
                  <select name="categoria" required className="portal-input" value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="" disabled>Seleccionar</option>
                    {TICKET_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </PortalField>
              </div>
              {category === "Otro" && (
                <PortalField label="Especificar categoría">
                  <input name="otra_categoria" required maxLength={120} className="portal-input" />
                </PortalField>
              )}
              <PortalField label="Descripción técnica">
                <textarea name="descripcion" required minLength={10} rows={6} className="portal-input resize-none" />
              </PortalField>
              <button disabled={isPending} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#60A5FA] disabled:opacity-60">
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <CirclePlus className="size-4" />}
                Crear ticket
              </button>
            </div>
          </form>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-[#0A1626]">
              {(["Abierto", "En Proceso", "Cerrado"] as ClientTab[]).map((item) => (
                <button key={item} type="button" onClick={() => setTab(item)} className={`px-3 py-3 text-xs font-semibold transition-colors ${tab === item ? "bg-[#3B82F6] text-white" : "text-[#94A3B8] hover:text-white"}`}>
                  {item} ({counts[item]})
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {visibleTickets.length ? visibleTickets.map((ticket) => (
                <TicketManagementCard
                  key={ticket.id_ticket}
                  ticket={ticket}
                  actions={
                    ticket.estado === "Abierto" ? (
                      <TicketActionMenu>
                        <TicketActionButton tone="red" onClick={() => setClosingTicket(ticket)}>
                          Cancelar / cerrar ticket
                        </TicketActionButton>
                      </TicketActionMenu>
                    ) : undefined
                  }
                />
              )) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-10 text-center text-sm text-[#94A3B8]">
                  No hay tickets en esta categoría.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {closingTicket && (
        <ClientCloseModal
          ticket={closingTicket}
          pending={isPending}
          onClose={() => setClosingTicket(null)}
          onSubmit={handleClose}
        />
      )}
    </section>
  );
}

function ClientCloseModal({
  ticket,
  pending,
  onClose,
  onSubmit,
}: {
  ticket: PortalTicket;
  pending: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar confirmación"
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/85 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0A1626] p-5 text-center shadow-2xl shadow-black/60 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg border border-white/10 text-[#94A3B8] hover:text-white"
        >
          <X className="size-4" />
        </button>
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
          <TicketX className="size-6" />
        </span>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#3B82F6]">
          Ticket #TK-{ticket.id_ticket}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">¿Confirmar cierre del ticket?</h2>
        <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
          El ticket <strong className="text-[#CBD5E1]">{ticket.titulo}</strong> se marcará como cerrado de forma definitiva. Esta acción no se puede deshacer desde el portal de cliente.
        </p>
        <form action={onSubmit} className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-center">
          <input type="hidden" name="id_ticket" value={ticket.id_ticket} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-xs font-semibold text-[#CBD5E1] hover:text-white"
          >
            Mantener abierto
          </button>
          <button
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-400 disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <TicketX className="size-4" />}
            Sí, cerrar ticket
          </button>
        </form>
      </div>
    </div>
  );
}

function PortalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
