"use client";

import { useMemo, useState } from "react";
import { Eye, LockKeyhole, Menu, Search, X } from "lucide-react";
import { TicketManagementCard } from "@/components/portal/ticket-ui";
import type { PortalTicket, PortalUser } from "@/lib/portal/types";

type ViewerTab = "Abierto" | "En Proceso" | "Cerrado";

export function TicketViewerDashboard({
  clients,
  tickets,
  viewerName,
}: {
  clients: PortalUser[];
  tickets: PortalTicket[];
  viewerName: string;
}) {
  const [clientId, setClientId] = useState(clients[0]?.id_usuario ?? 0);
  const [tab, setTab] = useState<ViewerTab>("Abierto");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleClients = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    if (!normalized) return clients;
    return clients.filter((client) =>
      `${client.nombre} ${client.email} ${client.codigo_empresa ?? ""}`
        .toLocaleLowerCase("es")
        .includes(normalized)
    );
  }, [clients, query]);

  const activeClient = clients.find((client) => client.id_usuario === clientId);
  const clientTickets = tickets.filter((ticket) => ticket.id_usuario === clientId);
  const counts = {
    Abierto: clientTickets.filter((ticket) => ticket.estado === "Abierto").length,
    "En Proceso": clientTickets.filter((ticket) => ticket.estado === "En Proceso").length,
    Cerrado: clientTickets.filter((ticket) =>
      ["Cerrado", "Resuelto"].includes(ticket.estado)
    ).length,
  };
  const visibleTickets = clientTickets.filter((ticket) =>
    tab === "Cerrado"
      ? ticket.estado === "Cerrado" || ticket.estado === "Resuelto"
      : ticket.estado === tab
  );

  function selectClient(nextClientId: number) {
    setClientId(nextClientId);
    setTab("Abierto");
    setSidebarOpen(false);
  }

  return (
    <section className="relative grid min-h-[calc(100dvh-5rem)] lg:grid-cols-[300px_minmax(0,1fr)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar lista de clientes"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#020617]/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(88vw,320px)] flex-col border-r border-white/10 bg-[#07111F] pt-5 transition-transform lg:sticky lg:top-20 lg:z-20 lg:h-[calc(100dvh-5rem)] lg:w-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3 px-5 pb-5">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
              Acceso autorizado
            </p>
            <h2 className="mt-1 text-base font-semibold text-white">Clientes visibles</h2>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar"
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-[#94A3B8] lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <label className="relative mx-4 mb-3 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748B]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="portal-input portal-input-icon"
            placeholder="Nombre o correo…"
          />
        </label>

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
                <span className="block truncate text-xs font-semibold uppercase tracking-[0.05em] text-white">
                  {client.nombre}
                </span>
                <span className="mt-1 block truncate text-[10px] text-[#64748B]">
                  {client.email}
                </span>
              </button>
            ))
          ) : (
            <p className="p-5 text-center text-xs text-[#64748B]">
              No hay clientes autorizados.
            </p>
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
                    Visor de tickets
                  </p>
                  <h1 className="mt-1 truncate text-2xl font-semibold uppercase tracking-tight text-white sm:text-3xl">
                    {activeClient?.nombre ?? "Consulta de tickets"}
                  </h1>
                </div>
              </div>
              <p className="mt-2 truncate text-xs text-[#64748B]">
                {activeClient?.email ?? "El administrador aún no ha asignado clientes a esta cuenta."}
              </p>
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 sm:min-w-56">
              <p className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-200">
                <LockKeyhole className="size-3.5" /> Solo lectura
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-white">{viewerName}</p>
            </div>
          </div>

          {activeClient ? (
            <div className="mt-6">
              <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-[#0A1626]">
                {(["Abierto", "En Proceso", "Cerrado"] as ViewerTab[]).map((item) => (
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
                    {item} ({counts[item]})
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                {visibleTickets.length ? (
                  visibleTickets.map((ticket) => (
                    <TicketManagementCard key={ticket.id_ticket} ticket={ticket} />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-10 text-center text-sm text-[#94A3B8]">
                    No hay tickets en esta categoría.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-[#0A1626]/50 p-12 text-center">
              <Eye className="mx-auto size-8 text-[#3B82F6]" />
              <p className="mt-4 text-sm text-[#94A3B8]">
                No tenés clientes asignados para consulta de tickets.
              </p>
            </div>
          )}
        </div>
      </main>
    </section>
  );
}
