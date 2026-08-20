"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Clock3, MoreHorizontal, UserRound } from "lucide-react";
import type { PortalTicket } from "@/lib/portal/types";

export function ticketStatusClass(status: string) {
  if (status === "Abierto") return "border-amber-500/25 bg-amber-500/10 text-amber-300";
  if (status === "En Proceso") return "border-sky-500/25 bg-sky-500/10 text-sky-300";
  if (status === "Resuelto") return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
  return "border-slate-500/25 bg-slate-500/10 text-slate-300";
}

export function priorityClass(priority: string) {
  if (priority === "Crítica") return "text-red-300";
  if (priority === "Alta") return "text-orange-300";
  if (priority === "Baja") return "text-emerald-300";
  return "text-[#94A3B8]";
}

export function formatPortalDate(value: string | null) {
  if (!value) return "Sin registro";
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function TicketSummary({ ticket }: { ticket: PortalTicket }) {
  const category =
    ticket.categoria === "Otro" && ticket.otra_categoria
      ? `Otro: ${ticket.otra_categoria}`
      : ticket.categoria;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#60A5FA]">
          #TK-{ticket.id_ticket}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${ticketStatusClass(ticket.estado)}`}>
          {ticket.estado}
        </span>
        <span className={`text-[11px] font-semibold ${priorityClass(ticket.prioridad)}`}>
          Prioridad {ticket.prioridad}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-white">{ticket.titulo}</h3>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#94A3B8]">
        <span>{category || "Sin categoría"}</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-3.5" /> {formatPortalDate(ticket.fecha_creacion)}
        </span>
        {ticket.nombre_tecnico && (
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-3.5" /> {ticket.nombre_tecnico}
          </span>
        )}
      </div>
    </>
  );
}

export function TicketDetails({ ticket }: { ticket: PortalTicket }) {
  return (
    <div className="mt-5 space-y-4 border-t border-white/10 pt-5 text-sm leading-6 text-[#CBD5E1]">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
          Descripción
        </p>
        <p className="mt-1 whitespace-pre-wrap">{ticket.descripcion}</p>
      </div>
      {ticket.notas_asignacion && (
        <LogBlock label="Indicaciones de asignación" text={ticket.notas_asignacion} tone="blue" />
      )}
      {ticket.observacion_proceso && (
        <LogBlock label="Bitácora y avances" text={ticket.observacion_proceso} tone="amber" />
      )}
      {ticket.observacion_cierre && (
        <LogBlock label="Resolución o cierre" text={ticket.observacion_cierre} tone="green" />
      )}
    </div>
  );
}

export function TicketManagementCard({
  ticket,
  actions,
}: {
  ticket: PortalTicket;
  actions?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const category =
    ticket.categoria === "Otro" && ticket.otra_categoria
      ? `Otro: ${ticket.otra_categoria}`
      : ticket.categoria || "Sin categoría";
  const isClosed = ticket.estado === "Cerrado" || ticket.estado === "Resuelto";

  return (
    <article className="relative rounded-xl border border-white/10 bg-[#0A1626] shadow-[0_16px_45px_rgba(2,8,23,0.16)] transition-colors hover:border-white/20">
      <div className="flex items-start gap-3 p-4 sm:items-center sm:p-5">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${ticketStatusClass(ticket.estado)}`}>
              {ticket.estado}
            </span>
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold uppercase tracking-[0.04em] text-white">
              {ticket.titulo}
            </h3>
            {ticket.nombre_tecnico && (
              <span className="hidden rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-violet-200 xl:inline-flex">
                Técnico: {ticket.nombre_tecnico}
              </span>
            )}
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden font-mono text-[10px] text-[#64748B] sm:inline">#TK-{ticket.id_ticket}</span>
          {actions}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? "Ocultar detalle" : "Mostrar detalle"}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-[#94A3B8] transition-colors hover:border-[#3B82F6]/40 hover:text-white"
          >
            <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/5 px-4 py-3 text-[10px] sm:px-5">
        <span className="rounded-md border border-[#3B82F6]/25 bg-[#3B82F6]/10 px-2 py-1 font-semibold uppercase tracking-[0.1em] text-[#60A5FA]">
          Seguimiento
        </span>
        <TrackingDatum label="Apertura" value={formatPortalDate(ticket.fecha_creacion)} />
        <TrackingDatum label="Última actividad" value={formatPortalDate(ticket.fecha_actualizacion)} tone="amber" />
        <TrackingDatum
          label="Resolución"
          value={isClosed ? formatPortalDate(ticket.fecha_actualizacion) : "Pendiente"}
          tone={isClosed ? "green" : "muted"}
        />
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-[#07111F]/75 px-4 pb-5 sm:px-5">
          {ticket.nombre_tecnico && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-2.5 text-xs text-violet-200 xl:hidden">
              <UserRound className="size-4 shrink-0" />
              Técnico responsable: <strong className="text-white">{ticket.nombre_tecnico}</strong>
            </div>
          )}
          <TicketDetails ticket={ticket} />
          <div className="mt-5 flex flex-col justify-between gap-2 border-t border-white/5 pt-4 text-[10px] text-[#64748B] sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <span>Categoría: <strong className="text-[#60A5FA]">{category}</strong></span>
              <span>Prioridad: <strong className={priorityClass(ticket.prioridad)}>{ticket.prioridad}</strong></span>
            </div>
            <span className="font-mono sm:hidden">#TK-{ticket.id_ticket}</span>
          </div>
        </div>
      )}
    </article>
  );
}

export function TicketActionMenu({ children }: { children: ReactNode }) {
  return (
    <details className="group/menu relative">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-white/10 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8] transition-colors marker:hidden hover:border-[#3B82F6]/40 hover:text-white">
        <span className="hidden sm:inline">Opciones</span>
        <MoreHorizontal className="size-4" />
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-white/10 bg-[#0B1728] p-1.5 shadow-2xl shadow-black/40">
        {children}
      </div>
    </details>
  );
}

export function TicketActionButton({
  children,
  onClick,
  tone = "blue",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "blue" | "amber" | "green" | "red" | "violet";
}) {
  const toneClass = {
    blue: "text-[#93C5FD] hover:bg-[#3B82F6]/10",
    amber: "text-amber-300 hover:bg-amber-400/10",
    green: "text-emerald-300 hover:bg-emerald-400/10",
    red: "text-rose-300 hover:bg-rose-400/10",
    violet: "text-violet-300 hover:bg-violet-400/10",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-md px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors ${toneClass}`}
    >
      {children}
    </button>
  );
}

function TrackingDatum({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "amber" | "green" | "muted";
}) {
  const valueClass = {
    default: "text-[#CBD5E1]",
    amber: "text-amber-300",
    green: "text-emerald-300",
    muted: "text-[#64748B]",
  }[tone];
  return (
    <span className="rounded-md border border-white/8 bg-[#07111F] px-2 py-1 text-[#64748B]">
      {label}: <strong className={`font-mono font-medium ${valueClass}`}>{value}</strong>
    </span>
  );
}

function LogBlock({ label, text, tone }: { label: string; text: string; tone: "blue" | "amber" | "green" }) {
  const toneClass = {
    blue: "border-[#3B82F6]/25 bg-[#3B82F6]/10",
    amber: "border-amber-500/25 bg-amber-500/10",
    green: "border-emerald-500/25 bg-emerald-500/10",
  }[tone];
  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#CBD5E1]">{text}</p>
    </div>
  );
}

export function ActionNotice({ notice }: { notice: { status: "success" | "error"; message: string } | null }) {
  if (!notice) return null;
  return (
    <p
      role="status"
      className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
        notice.status === "success"
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/25 bg-red-500/10 text-red-300"
      }`}
    >
      {notice.message}
    </p>
  );
}
