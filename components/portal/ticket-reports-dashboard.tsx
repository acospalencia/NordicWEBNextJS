"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileDown,
  FileSpreadsheet,
  Loader2,
  TicketPlus,
} from "lucide-react";
import {
  exportTicketReportExcel,
  printTicketReportPdf,
} from "@/lib/portal/export-ticket-report";
import { buildTicketReport } from "@/lib/portal/reporting";
import type { PortalTicket, PortalUser } from "@/lib/portal/types";

type PeriodMode = "week" | "month" | "custom";

function portalToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/El_Salvador",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/El_Salvador",
  }).format(date);
}

export function TicketReportsDashboard({
  clients,
  tickets,
}: {
  clients: PortalUser[];
  tickets: PortalTicket[];
}) {
  const today = useMemo(() => portalToday(), []);
  const [periodMode, setPeriodMode] = useState<PeriodMode>("week");
  const [from, setFrom] = useState(() => shiftDate(portalToday(), -6));
  const [to, setTo] = useState(() => portalToday());
  const [clientId, setClientId] = useState(0);
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<string[]>([]);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const activeClients = useMemo(
    () => clients.filter((client) => client.activo === 1),
    [clients]
  );
  const identifiers = useMemo(
    () =>
      Array.from(
        new Set(
          activeClients
            .map((client) => client.codigo_empresa?.trim())
            .filter((identifier): identifier is string => !!identifier)
        )
      ).sort((left, right) => left.localeCompare(right, "es")),
    [activeClients]
  );
  const report = useMemo(
    () =>
      buildTicketReport(tickets, activeClients, {
        from,
        to,
        clientId: clientId || null,
        identifiers: selectedIdentifiers,
      }),
    [activeClients, clientId, from, selectedIdentifiers, tickets, to]
  );

  function selectPeriod(mode: PeriodMode) {
    setPeriodMode(mode);
    if (mode === "week") {
      setFrom(shiftDate(today, -6));
      setTo(today);
    } else if (mode === "month") {
      setFrom(shiftDate(today, -29));
      setTo(today);
    }
  }

  function toggleIdentifier(identifier: string) {
    setSelectedIdentifiers((current) =>
      current.includes(identifier)
        ? current.filter((item) => item !== identifier)
        : [...current, identifier]
    );
  }

  async function exportExcel() {
    setExporting("excel");
    setExportError(null);
    try {
      await exportTicketReportExcel(report);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "No fue posible generar el Excel.");
    } finally {
      setExporting(null);
    }
  }

  function exportPdf() {
    setExporting("pdf");
    setExportError(null);
    try {
      printTicketReportPdf(report);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "No fue posible preparar el PDF.");
    } finally {
      setExporting(null);
    }
  }

  const invalidRange = from > to;

  return (
    <section className="px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
              Analítica operativa
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Reportes de tickets
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#94A3B8]">
              Consultá aperturas, cierres y atención técnica usando el historial real registrado en el sistema.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void exportExcel()}
              disabled={!!exporting || invalidRange}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-4 py-2.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/15 disabled:opacity-50"
            >
              {exporting === "excel" ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
              Exportar Excel
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={!!exporting || invalidRange}
              className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-2.5 text-xs font-semibold text-[#93C5FD] transition-colors hover:bg-[#3B82F6]/15 disabled:opacity-50"
            >
              {exporting === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="mt-7 rounded-xl border border-white/10 bg-[#0A1626] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_minmax(220px,0.6fr)] lg:items-end">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">Periodo</p>
              <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/10">
                {([[
                  "week",
                  "Última semana",
                ], ["month", "Último mes"], ["custom", "Personalizado"]] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectPeriod(value)}
                    className={`px-3 py-3 text-[10px] font-semibold uppercase transition-colors ${periodMode === value ? "bg-[#3B82F6] text-white" : "bg-[#07111F] text-[#94A3B8] hover:text-white"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">Desde</span>
                <input type="date" value={from} max={to} onChange={(event) => { setFrom(event.target.value); setPeriodMode("custom"); }} className="portal-input mt-2" />
              </label>
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">Hasta</span>
                <input type="date" value={to} min={from} max={today} onChange={(event) => { setTo(event.target.value); setPeriodMode("custom"); }} className="portal-input mt-2" />
              </label>
            </div>
            <label>
              <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">Cliente</span>
              <select value={clientId} onChange={(event) => setClientId(Number(event.target.value))} className="portal-input mt-2">
                <option value="0">Todos los clientes</option>
                {activeClients.map((client) => <option key={client.id_usuario} value={client.id_usuario}>{client.nombre}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#94A3B8]">Identificadores de cliente</p>
              {!!selectedIdentifiers.length && <button type="button" onClick={() => setSelectedIdentifiers([])} className="text-[10px] font-semibold text-[#60A5FA] hover:text-[#93C5FD]">Limpiar filtro</button>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {identifiers.length ? identifiers.map((identifier) => (
                <button
                  key={identifier}
                  type="button"
                  onClick={() => toggleIdentifier(identifier)}
                  aria-pressed={selectedIdentifiers.includes(identifier)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold transition-colors ${selectedIdentifiers.includes(identifier) ? "border-violet-400/50 bg-violet-400/15 text-violet-100" : "border-white/10 bg-[#07111F] text-[#94A3B8] hover:border-white/20 hover:text-white"}`}
                >
                  {identifier}
                </button>
              )) : <p className="text-xs text-[#64748B]">Aún no hay identificadores registrados en los clientes activos.</p>}
            </div>
          </div>
        </div>

        {invalidRange && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-200">La fecha inicial debe ser anterior o igual a la fecha final.</p>}
        {exportError && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-200">{exportError}</p>}
        {!!report.missingCloseHistory && (
          <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-200">
            {report.missingCloseHistory} ticket{report.missingCloseHistory === 1 ? " cerrado no tiene" : "s cerrados no tienen"} una fecha histórica de cierre verificable y no se contabiliza como cierre del periodo.
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <ReportMetric label="Abiertos en el periodo" value={invalidRange ? 0 : report.totals.opened} icon={TicketPlus} tone="blue" />
          <ReportMetric label="Cerrados en el periodo" value={invalidRange ? 0 : report.totals.closed} icon={CheckCircle2} tone="green" />
          <ReportMetric label="Atendidos por técnicos" value={invalidRange ? 0 : report.totals.worked} icon={Clock3} tone="amber" />
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0A1626]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Detalle de actividad</h2>
              <p className="mt-1 text-[10px] text-[#64748B]">{invalidRange ? 0 : report.rows.length} tickets con actividad en el periodo</p>
            </div>
            <CalendarDays className="size-5 text-[#3B82F6]" />
          </div>
          {!invalidRange && report.rows.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left text-xs">
                <thead className="bg-[#07111F] text-[9px] uppercase tracking-[0.12em] text-[#64748B]">
                  <tr><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Técnico</th><th className="px-4 py-3">Apertura</th><th className="px-4 py-3">Última actividad</th><th className="px-4 py-3">Eventos del periodo</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {report.rows.map((row) => (
                    <tr key={row.ticket.id_ticket} className="hover:bg-white/[0.025]">
                      <td className="px-4 py-4"><span className="font-mono text-[10px] text-[#60A5FA]">#TK-{row.ticket.id_ticket}</span><p className="mt-1 max-w-64 truncate font-semibold text-white">{row.ticket.titulo}</p><span className="mt-1 block text-[10px] text-[#64748B]">{row.ticket.estado}</span></td>
                      <td className="px-4 py-4 text-[#CBD5E1]">{row.client.nombre}<span className="mt-1 block font-mono text-[9px] text-violet-300">{row.identifier ?? "Sin identificador"}</span></td>
                      <td className="px-4 py-4 text-[#94A3B8]">{row.ticket.nombre_tecnico ?? "Sin asignar"}</td>
                      <td className="px-4 py-4 text-[#94A3B8]">{formatDate(row.openedAt)}</td>
                      <td className="px-4 py-4 text-[#94A3B8]">{formatDate(row.lastWorkedAt ?? row.closedAt)}</td>
                      <td className="px-4 py-4"><div className="flex flex-wrap gap-1.5">{row.opened && <EventBadge label="Abierto" tone="blue" />}{row.closed && <EventBadge label="Cerrado" tone="green" />}{row.worked && <EventBadge label="Atendido" tone="amber" />}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-14 text-center text-sm text-[#64748B]">
              {invalidRange ? "Corregí el rango de fechas para generar el reporte." : "No hay actividad registrada para los filtros seleccionados."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReportMetric({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof TicketPlus; tone: "blue" | "green" | "amber" }) {
  const styles = { blue: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-[#60A5FA]", green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300", amber: "border-amber-400/25 bg-amber-400/10 text-amber-300" }[tone];
  return <article className="rounded-xl border border-white/10 bg-[#0A1626] p-5"><div className={`flex size-10 items-center justify-center rounded-lg border ${styles}`}><Icon className="size-5" /></div><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p><p className="mt-1 text-3xl font-semibold text-white">{value}</p></article>;
}

function EventBadge({ label, tone }: { label: string; tone: "blue" | "green" | "amber" }) {
  const styles = { blue: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-[#93C5FD]", green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200", amber: "border-amber-400/25 bg-amber-400/10 text-amber-200" }[tone];
  return <span className={`rounded-full border px-2 py-1 text-[9px] font-semibold uppercase ${styles}`}>{label}</span>;
}
