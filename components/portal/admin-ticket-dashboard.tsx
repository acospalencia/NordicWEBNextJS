"use client";

import { useMemo, useState, useTransition } from "react";
import { CirclePlus, Loader2, Mail, Menu, Search, UserRoundCheck, X } from "lucide-react";
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

export function AdminTicketDashboard({
  clients,
  technicians,
  initialTickets,
}: {
  clients: PortalUser[];
  technicians: PortalUser[];
  initialTickets: PortalTicket[];
}) {
  const [clientId, setClientId] = useState(clients[0]?.id_usuario ?? 0);
  const [tickets, setTickets] = useState(initialTickets);
  const [tab, setTab] = useState<AdminTab>("Abierto");
  const [clientQuery, setClientQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<AdminModal>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState<{ status: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeClient = clients.find((client) => client.id_usuario === clientId);
  const visibleClients = useMemo(() => {
    const search = clientQuery.trim().toLowerCase();
    if (!search) return clients;
    return clients.filter((client) =>
      `${client.nombre} ${client.email} ${client.codigo_empresa ?? ""}`.toLowerCase().includes(search)
    );
  }, [clientQuery, clients]);

  const counts = {
    Abierto: tickets.filter((ticket) => ticket.estado === "Abierto").length,
    "En Proceso": tickets.filter((ticket) => ticket.estado === "En Proceso").length,
    Cerrado: tickets.filter((ticket) => ["Cerrado", "Resuelto"].includes(ticket.estado)).length,
  };

  const visibleTickets = tickets.filter((ticket) =>
    tab === "Cerrado"
      ? ticket.estado === "Cerrado" || ticket.estado === "Resuelto"
      : ticket.estado === tab
  );

  async function loadClientTickets(nextClientId: number) {
    const result = await getAdminTicketsForClient(nextClientId);
    if (result.status === "success") {
      setTickets(result.tickets);
      return;
    }
    setTickets([]);
    setNotice({ status: "error", message: result.message ?? "No fue posible cargar los tickets." });
  }

  function selectClient(nextClientId: number) {
    if (nextClientId === clientId) {
      setSidebarOpen(false);
      return;
    }
    setClientId(nextClientId);
    setTickets([]);
    setTab("Abierto");
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
        setCreateOpen(false);
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
              className="portal-input pl-10"
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

              {isPending && !tickets.length ? (
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
