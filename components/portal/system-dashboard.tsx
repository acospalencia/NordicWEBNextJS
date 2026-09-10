"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Search, ShieldCheck, Ticket, UserCog, UserPlus } from "lucide-react";
import {
  editPortalTicket,
  savePortalUser,
  togglePortalTicket,
  togglePortalUser,
} from "@/app/portal/actions";
import { ActionNotice, formatPortalDate, ticketStatusClass } from "@/components/portal/ticket-ui";
import { PEOPLE_COUNTER_CENTERS } from "@/lib/people-counter/centers";
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type PortalEmailQueueItem,
  type PortalTicket,
  type PortalUser,
} from "@/lib/portal/types";

type SystemTab = "usuarios" | "tickets" | "correos";
type ActionResult = Promise<{ status: string; message?: string }>;

export function SystemDashboard({
  users,
  tickets,
  emails,
  metrics,
}: {
  users: PortalUser[];
  tickets: PortalTicket[];
  emails: PortalEmailQueueItem[];
  metrics: {
    usuarios_activos: number;
    usuarios_inactivos: number;
    tickets_activos: number;
    tickets_cerrados: number;
    correos_pendientes: number;
  };
}) {
  const [tab, setTab] = useState<SystemTab>("usuarios");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<{ status: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const technicians = users.filter((user) => user.id_rol === 2 && user.activo === 1);

  const visibleUsers = useMemo(
    () => users.filter((user) => `${user.nombre} ${user.email}`.toLowerCase().includes(query.toLowerCase())),
    [query, users]
  );
  const visibleTickets = useMemo(
    () => tickets.filter((ticket) => `${ticket.id_ticket} ${ticket.titulo} ${ticket.cliente_nombre ?? ""} ${ticket.nombre_tecnico ?? ""}`.toLowerCase().includes(query.toLowerCase())),
    [query, tickets]
  );

  function runAction(action: (formData: FormData) => ActionResult, formData: FormData) {
    startTransition(async () => {
      const result = await action(formData);
      setNotice({ status: result.status === "success" ? "success" : "error", message: result.message ?? "Sin respuesta." });
      if (result.status === "success") router.refresh();
    });
  }

  return (
    <section className="px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">Administración general</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard del sistema</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#94A3B8]">
            Gestioná usuarios, roles, disponibilidad de tickets y la cola operativa de correos.
          </p>
        </div>

        <ActionNotice notice={notice} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Usuarios activos" value={metrics.usuarios_activos} />
          <Metric label="Usuarios inactivos" value={metrics.usuarios_inactivos} />
          <Metric label="Tickets activos" value={metrics.tickets_activos} />
          <Metric label="Tickets cerrados" value={metrics.tickets_cerrados} />
          <Metric label="Correos pendientes" value={metrics.correos_pendientes} />
        </div>

        <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-[#0A1626]">
          {([
            ["usuarios", "Usuarios", UserCog],
            ["tickets", "Tickets", Ticket],
            ["correos", "Correos", Mail],
          ] as const).map(([key, label, Icon]) => (
            <button key={key} type="button" onClick={() => { setTab(key); setQuery(""); }} className={`inline-flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold ${tab === key ? "bg-[#3B82F6] text-white" : "text-[#94A3B8] hover:text-white"}`}>
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>

        {tab !== "correos" && (
          <label className="relative mt-5 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748B]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="portal-input pl-10" placeholder={tab === "usuarios" ? "Buscar usuario o correo…" : "Buscar ticket, cliente o técnico…"} />
          </label>
        )}

        {tab === "usuarios" && (
          <div className="mt-5 space-y-4">
            <details className="rounded-xl border border-[#3B82F6]/25 bg-[#3B82F6]/5 p-5">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[#60A5FA] marker:hidden">
                <UserPlus className="size-4" /> Crear nuevo usuario
              </summary>
              <UserForm isPending={isPending} onAction={(formData) => runAction(savePortalUser, formData)} />
            </details>
            {visibleUsers.map((user) => (
              <details key={user.id_usuario} className={`rounded-xl border p-5 ${user.activo ? "border-white/10 bg-[#0A1626]" : "border-white/5 bg-[#0A1626]/45 opacity-75"}`}>
                <summary className="cursor-pointer list-none marker:hidden">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{user.nombre}</h3>
                      <p className="mt-1 text-xs text-[#94A3B8]">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase">
                      <span className="rounded-full border border-[#3B82F6]/25 bg-[#3B82F6]/10 px-2.5 py-1 text-[#60A5FA]">{roleName(user.id_rol)}</span>
                      <span className={`rounded-full border px-2.5 py-1 ${user.verificado ? "border-emerald-500/25 text-emerald-300" : "border-amber-500/25 text-amber-300"}`}>{user.verificado ? "Verificado" : "Pendiente"}</span>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[#94A3B8]">{user.activo ? "Activo" : "Inactivo"}</span>
                      {user.conteo_center_slug && <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-cyan-200">Conteo: {PEOPLE_COUNTER_CENTERS.find((center) => center.slug === user.conteo_center_slug)?.name ?? user.conteo_center_slug}</span>}
                    </div>
                  </div>
                </summary>
                <UserForm user={user} isPending={isPending} onAction={(formData) => runAction(savePortalUser, formData)} />
                <form action={(formData) => runAction(togglePortalUser, formData)} className="mt-4 border-t border-white/10 pt-4">
                  <input type="hidden" name="id_usuario" value={user.id_usuario} />
                  <input type="hidden" name="activo" value={user.activo ? "0" : "1"} />
                  <button disabled={isPending} className={`text-xs font-semibold ${user.activo ? "text-red-300 hover:text-red-200" : "text-emerald-300 hover:text-emerald-200"}`}>{user.activo ? "Desactivar cuenta" : "Reactivar cuenta"}</button>
                </form>
              </details>
            ))}
          </div>
        )}

        {tab === "tickets" && (
          <div className="mt-5 space-y-4">
            {visibleTickets.map((ticket) => (
              <details key={ticket.id_ticket} className={`rounded-xl border p-5 ${ticket.activo ? "border-white/10 bg-[#0A1626]" : "border-white/5 bg-[#0A1626]/45 opacity-75"}`}>
                <summary className="cursor-pointer list-none marker:hidden">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-white">#TK-{ticket.id_ticket} · {ticket.titulo}</h3>
                      <p className="mt-1 text-xs text-[#94A3B8]">Cliente: {ticket.cliente_nombre ?? "Sin cliente"} · Técnico: {ticket.nombre_tecnico ?? "Sin asignar"}</p>
                    </div>
                    <span className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${ticketStatusClass(ticket.estado)}`}>{ticket.estado}</span>
                  </div>
                </summary>
                <form action={(formData) => runAction(editPortalTicket, formData)} className="mt-5 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
                  <input type="hidden" name="id_ticket" value={ticket.id_ticket} />
                  <SystemField label="Estado"><select name="estado" defaultValue={ticket.estado} className="portal-input">{TICKET_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></SystemField>
                  <SystemField label="Prioridad"><select name="prioridad" defaultValue={ticket.prioridad} className="portal-input">{TICKET_PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select></SystemField>
                  <SystemField label="Categoría"><input name="categoria" defaultValue={ticket.categoria} required className="portal-input" /></SystemField>
                  <SystemField label="Técnico"><select name="id_tecnico" defaultValue={ticket.id_tecnico ?? 0} className="portal-input"><option value="0">Sin asignar</option>{technicians.map((item) => <option key={item.id_usuario} value={item.id_usuario}>{item.nombre}</option>)}</select></SystemField>
                  <button disabled={isPending} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-xs font-semibold text-white hover:bg-[#60A5FA] disabled:opacity-50">{isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Guardar</button>
                </form>
                <form action={(formData) => runAction(togglePortalTicket, formData)} className="mt-4">
                  <input type="hidden" name="id_ticket" value={ticket.id_ticket} />
                  <input type="hidden" name="activo" value={ticket.activo ? "0" : "1"} />
                  <button disabled={isPending} className={`text-xs font-semibold ${ticket.activo ? "text-red-300" : "text-emerald-300"}`}>{ticket.activo ? "Desactivar ticket" : "Reactivar ticket"}</button>
                </form>
              </details>
            ))}
          </div>
        )}

        {tab === "correos" && (
          <div className="mt-5 space-y-3">
            {emails.length ? emails.map((email) => (
              <article key={email.id_correo} className="rounded-xl border border-white/10 bg-[#0A1626] p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{email.asunto}</h3>
                    <p className="mt-1 text-xs text-[#94A3B8]">{email.destinatario}</p>
                  </div>
                  <div className="text-xs text-[#94A3B8] sm:text-right">
                    <p>{email.estado} · {email.intentos} intentos</p>
                    <p className="mt-1">{formatPortalDate(email.fecha_registro)}</p>
                  </div>
                </div>
              </article>
            )) : <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-[#94A3B8]">No hay correos registrados.</div>}
          </div>
        )}
      </div>
    </section>
  );
}

function UserForm({ user, isPending, onAction }: { user?: PortalUser; isPending: boolean; onAction: (formData: FormData) => void }) {
  return (
    <form action={onAction} className="mt-5 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2 xl:grid-cols-7 xl:items-end">
      <input type="hidden" name="id_usuario" value={user?.id_usuario ?? ""} />
      <SystemField label="Nombre"><input name="nombre" defaultValue={user?.nombre} required className="portal-input" /></SystemField>
      <SystemField label="Correo"><input name="email" type="email" defaultValue={user?.email} required className="portal-input" /></SystemField>
      <SystemField label="Rol"><select name="id_rol" defaultValue={user?.id_rol ?? 1} className="portal-input"><option value="1">Cliente</option><option value="2">Técnico</option><option value="3">Administrador</option></select></SystemField>
      <SystemField label="Centro de conteo"><select name="conteo_center_slug" defaultValue={user?.conteo_center_slug ?? ""} className="portal-input"><option value="">Sin acceso</option>{PEOPLE_COUNTER_CENTERS.map((center) => <option key={center.slug} value={center.slug}>{center.name}</option>)}</select></SystemField>
      <SystemField label="Aprobación"><select name="verificado" defaultValue={user?.verificado ?? 1} className="portal-input"><option value="1">Verificado</option><option value="0">Pendiente</option></select></SystemField>
      <SystemField label={user ? "Nueva contraseña" : "Contraseña"}><input name="password" type="password" minLength={8} required={!user} className="portal-input" placeholder={user ? "Opcional" : "Mínimo 8 caracteres"} /></SystemField>
      <button disabled={isPending} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-xs font-semibold text-white hover:bg-[#60A5FA] disabled:opacity-50">{isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />} Guardar</button>
    </form>
  );
}

function SystemField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</span><span className="mt-2 block">{children}</span></label>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="rounded-xl border border-white/10 bg-[#0A1626] p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p><p className="mt-2 text-2xl font-semibold text-[#60A5FA]">{value}</p></article>;
}

function roleName(role: number) {
  if (role === 3) return "Administrador";
  if (role === 2) return "Técnico";
  return "Cliente";
}
