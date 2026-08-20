"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu, Search, Wrench, X } from "lucide-react";
import { updateTicketAsTechnician } from "@/app/portal/actions";
import {
  ActionNotice,
  TicketActionButton,
  TicketActionMenu,
  TicketManagementCard,
} from "@/components/portal/ticket-ui";
import type { PortalTicket, PortalUser } from "@/lib/portal/types";

type TechnicianTab = "En Proceso" | "Cerrado";
type TechnicianAction = "avance" | "resolver" | "cerrar";
type TechnicianModal = { ticket: PortalTicket; action: TechnicianAction } | null;

export function TechnicianDashboard({
  clients,
  tickets,
}: {
  clients: PortalUser[];
  tickets: PortalTicket[];
}) {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [tab, setTab] = useState<TechnicianTab>("En Proceso");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<TechnicianModal>(null);
  const [notice, setNotice] = useState<{ status: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const visibleClients = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return clients;
    return clients.filter((client) =>
      `${client.nombre} ${client.email}`.toLowerCase().includes(search)
    );
  }, [clients, query]);

  const activeClient = clients.find((client) => client.id_usuario === selectedClient);
  const clientTickets = tickets.filter((ticket) => ticket.id_usuario === selectedClient);
  const counts = {
    "En Proceso": clientTickets.filter((ticket) => ticket.estado === "En Proceso").length,
    Cerrado: clientTickets.filter((ticket) => ["Cerrado", "Resuelto"].includes(ticket.estado)).length,
  };
  const visibleTickets = clientTickets.filter((ticket) =>
    tab === "Cerrado"
      ? ticket.estado === "Cerrado" || ticket.estado === "Resuelto"
      : ticket.estado === "En Proceso"
  );

  function selectClient(clientId: number) {
    setSelectedClient(clientId);
    setTab("En Proceso");
    setNotice(null);
    setSidebarOpen(false);
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateTicketAsTechnician(formData);
      setNotice({
        status: result.status === "success" ? "success" : "error",
        message: result.message ?? "Sin respuesta.",
      });
      if (result.status === "success") {
        setModal(null);
        router.refresh();
      }
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
                Asignaciones
              </p>
              <h2 className="mt-1 text-base font-semibold text-white">Mis clientes</h2>
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
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="portal-input pl-10"
              placeholder="Nombre o correo…"
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
                  client.id_usuario === selectedClient
                    ? "border-[#3B82F6]/45 bg-[#3B82F6]/12 shadow-[inset_3px_0_0_#3B82F6]"
                    : "border-transparent hover:border-white/10 hover:bg-white/[0.035]"
                }`}
              >
                <span className="block truncate text-xs font-semibold uppercase tracking-[0.05em] text-white">
                  {client.nombre}
                </span>
                <span className="mt-1 block truncate text-[10px] text-[#64748B]">{client.email}</span>
              </button>
            ))
          ) : (
            <p className="p-5 text-center text-xs text-[#64748B]">No tenés clientes asignados.</p>
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
                    Módulo técnico
                  </p>
                  <h1 className="mt-1 truncate text-2xl font-semibold uppercase tracking-tight text-white sm:text-3xl">
                    {activeClient?.nombre ?? "Seleccioná un cliente"}
                  </h1>
                </div>
              </div>
              <p className="mt-2 truncate text-xs text-[#64748B]">
                {activeClient?.email ?? "Elegí un cliente asignado para gestionar sus tickets."}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0A1626] px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#64748B]">Área de trabajo</p>
              <p className="mt-1 text-xs font-semibold text-[#60A5FA]">Atención y bitácora técnica</p>
            </div>
          </div>

          <div className="mt-6">
            <ActionNotice notice={notice} />
          </div>

          {activeClient ? (
            <div>
              <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-[#0A1626]">
                {(["En Proceso", "Cerrado"] as TechnicianTab[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={`px-3 py-3.5 text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors sm:text-xs ${
                      tab === item
                        ? "bg-[#3B82F6] text-white"
                        : "text-[#94A3B8] hover:bg-white/[0.035] hover:text-white"
                    }`}
                  >
                    {item === "Cerrado" ? "Concluidos" : item} ({counts[item]})
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {visibleTickets.length ? (
                  visibleTickets.map((ticket) => (
                    <TicketManagementCard
                      key={ticket.id_ticket}
                      ticket={ticket}
                      actions={
                        tab === "En Proceso" ? (
                          <TicketActionMenu>
                            <TicketActionButton tone="amber" onClick={() => setModal({ ticket, action: "avance" })}>
                              Registrar avance
                            </TicketActionButton>
                            <TicketActionButton tone="green" onClick={() => setModal({ ticket, action: "resolver" })}>
                              Resolver ticket
                            </TicketActionButton>
                            <TicketActionButton tone="red" onClick={() => setModal({ ticket, action: "cerrar" })}>
                              Cerrar ticket
                            </TicketActionButton>
                          </TicketActionMenu>
                        ) : undefined
                      }
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-10 text-center text-sm text-[#94A3B8]">
                    No hay tickets en esta categoría.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-12 text-center text-sm text-[#94A3B8]">
              Seleccioná un cliente del panel lateral para cargar tus asignaciones activas.
            </div>
          )}
        </div>
      </main>

      {modal && (
        <TechnicianActionModal
          modal={modal}
          pending={isPending}
          onClose={() => setModal(null)}
          onSubmit={handleUpdate}
        />
      )}
    </section>
  );
}

function TechnicianActionModal({
  modal,
  pending,
  onClose,
  onSubmit,
}: {
  modal: Exclude<TechnicianModal, null>;
  pending: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  const copy = {
    avance: {
      title: "Registrar avance en bitácora",
      description: "Documentá la actualización técnica realizada en el ticket.",
      label: "Detalle de la actividad",
    },
    resolver: {
      title: "Resolver ticket",
      description: "Escribí el diagnóstico final y la solución aplicada.",
      label: "Reporte de resolución",
    },
    cerrar: {
      title: "Cerrar ticket definitivamente",
      description: "Explicá las razones del cierre del caso.",
      label: "Motivo de cierre",
    },
  }[modal.action];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute inset-0 bg-[#020617]/85 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A1626] p-5 shadow-2xl shadow-black/60 sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#3B82F6]">Ticket #TK-{modal.ticket.id_ticket}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{copy.title}</h2>
            <p className="mt-2 text-xs leading-5 text-[#94A3B8]">{copy.description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#94A3B8] hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form action={onSubmit} className="mt-6">
          <input type="hidden" name="id_ticket" value={modal.ticket.id_ticket} />
          <input type="hidden" name="accion" value={modal.action} />
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{copy.label}</span>
            <textarea name="comentario" required rows={5} className="portal-input mt-2 resize-none" placeholder="Describí el trabajo realizado…" autoFocus />
          </label>
          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-[#CBD5E1] hover:text-white">
              Cancelar
            </button>
            <button disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#60A5FA] disabled:opacity-50">
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Wrench className="size-4" />}
              Guardar avance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
