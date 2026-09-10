"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Clock3,
  FileSpreadsheet,
  LogOut,
  RefreshCw,
  TicketCheck,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calendarDates, dashboardForDay } from "@/lib/people-counter/report";
import {
  isDashboardPayload,
  type DashboardPayload,
} from "@/lib/people-counter/types";

type PeriodDays = 1 | 7 | 30;

const PERIODS: Array<{ days: PeriodDays; label: string }> = [
  { days: 1, label: "1 día" },
  { days: 7, label: "7 días" },
  { days: 30, label: "30 días" },
];
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function todayInElSalvador() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/El_Salvador",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function subtractDays(value: string, days: number) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string, compact = false) {
  return new Intl.DateTimeFormat("es-SV", {
    timeZone: "UTC",
    day: "2-digit",
    month: compact ? "short" : "long",
    year: compact ? undefined : "numeric",
  })
    .format(new Date(`${value}T12:00:00Z`))
    .replace(".", "");
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-SV", {
    timeZone: "America/El_Salvador",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function number(value: number) {
  return new Intl.NumberFormat("es-SV").format(value);
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  primary = false,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: typeof Users;
  primary?: boolean;
}) {
  return (
    <article
      className={
        primary
          ? "rounded-2xl bg-gradient-to-br from-[#0d3b52] to-[#17637d] p-5 text-white shadow-[0_16px_42px_rgba(13,59,82,.18)]"
          : "rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.05)]"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={primary ? "text-sm text-white/70" : "text-sm text-slate-500"}>{label}</p>
          <p className={primary ? "mt-2 text-4xl font-semibold tracking-tight text-white" : "mt-2 text-4xl font-semibold tracking-tight text-slate-950"}>
            {typeof value === "number" ? number(value) : value}
          </p>
        </div>
        <span className={primary ? "rounded-xl bg-white/10 p-2.5 text-amber-300" : "rounded-xl bg-slate-50 p-2.5 text-[#1f6f8b]"}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className={primary ? "mt-5 text-xs text-white/65" : "mt-5 text-xs text-slate-500"}>{detail}</p>
    </article>
  );
}

export function PeopleCounterDashboard({
  centerName,
  ticketsHref,
}: {
  centerName: string;
  ticketsHref: string;
}) {
  const router = useRouter();
  const [today] = useState(todayInElSalvador);
  const [selectedDate, setSelectedDate] = useState(today);
  const [periodDays, setPeriodDays] = useState<PeriodDays>(1);
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(23);
  const [activeReportDate, setActiveReportDate] = useState(today);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const refresh = useCallback(
    async (quiet = false) => {
      const currentRequest = ++requestId.current;
      if (!quiet) setLoading(true);
      const params = new URLSearchParams({
        from: subtractDays(selectedDate, periodDays - 1),
        to: selectedDate,
        startHour: String(startHour),
        endHour: String(endHour),
      });
      try {
        const response = await fetch(`/api/conteo/dashboard?${params}`, {
          cache: "no-store",
        });
        const payload: unknown = await response.json();
        if (response.status === 401) {
          router.replace("/portal/iniciar-sesion");
          return;
        }
        if (!response.ok) {
          const message =
            payload && typeof payload === "object" && "error" in payload
              ? String(payload.error)
              : "No fue posible consultar los conteos.";
          throw new Error(message);
        }
        if (!isDashboardPayload(payload)) {
          throw new Error("La API devolvió datos incompletos.");
        }
        if (currentRequest === requestId.current) {
          setDashboard(payload);
          setActiveReportDate(payload.report.toDate);
          setError(null);
        }
      } catch (caught) {
        if (currentRequest === requestId.current) {
          setError(caught instanceof Error ? caught.message : "No fue posible actualizar.");
        }
      } finally {
        if (!quiet && currentRequest === requestId.current) setLoading(false);
      }
    },
    [endHour, periodDays, router, selectedDate, startHour],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  useEffect(() => {
    if (selectedDate !== today || periodDays !== 1) return;
    const timer = window.setInterval(() => void refresh(true), 60_000);
    return () => window.clearInterval(timer);
  }, [periodDays, refresh, selectedDate, today]);

  const reportDates = useMemo(
    () =>
      dashboard
        ? calendarDates(dashboard.report.fromDate, dashboard.report.toDate)
        : [],
    [dashboard],
  );
  const visibleDate = reportDates.includes(activeReportDate)
    ? activeReportDate
    : dashboard?.report.toDate ?? selectedDate;
  const visible = useMemo(
    () => (dashboard ? dashboardForDay(dashboard, visibleDate) : null),
    [dashboard, visibleDate],
  );
  const daily = useMemo(
    () =>
      dashboard
        ? reportDates.map((date) => ({
            date,
            totals: dashboardForDay(dashboard, date).totals,
          }))
        : [],
    [dashboard, reportDates],
  );
  const peak = useMemo(
    () =>
      visible?.traffic.reduce(
        (best, point) =>
          point.entradas + point.salidas > best.entradas + best.salidas
            ? point
            : best,
        { hour: "—", entradas: 0, salidas: 0 },
      ) ?? { hour: "—", entradas: 0, salidas: 0 },
    [visible],
  );

  const exportExcel = async () => {
    if (!dashboard || exporting) return;
    setExporting(true);
    try {
      const { exportPeopleCounterExcel } = await import(
        "@/lib/people-counter/export-excel"
      );
      await exportPeopleCounterExcel(dashboard);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible crear el Excel.");
    } finally {
      setExporting(false);
    }
  };

  const hoursLabel = `${String(startHour).padStart(2, "0")}:00–${String(endHour).padStart(2, "0")}:59`;

  return (
    <main className="min-h-screen bg-[#f3f7f8] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-12">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              src="/Logo-wordmark.webp"
              alt="Nordictech"
              width={1563}
              height={248}
              priority
              className="h-auto w-[160px] object-contain brightness-[.28] saturate-[1.2] sm:w-[190px]"
            />
            <span className="hidden h-8 w-px bg-slate-200 sm:block" />
            <p className="truncate text-sm font-semibold text-slate-700 sm:text-base">Conteo de personas</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
              <span className="size-2 rounded-full bg-emerald-500" /> Datos centralizados
            </span>
            <a href={ticketsHref} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950">
              <TicketCheck className="size-4" /> <span className="hidden sm:inline">Tickets</span>
            </a>
            <a href="/portal/cerrar-sesion" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950">
              <LogOut className="size-4" /> <span className="hidden sm:inline">Cerrar sesión</span>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
        <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#1f6f8b]">{centerName}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-slate-950 sm:text-4xl">Resumen de afluencia</h1>
            <p className="mt-2 text-sm text-slate-500">Indicadores almacenados por la API de Nordictech.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {PERIODS.map((period) => (
                <button
                  key={period.days}
                  type="button"
                  onClick={() => setPeriodDays(period.days)}
                  className={periodDays === period.days ? "rounded-lg bg-[#173143] px-3 py-2 text-sm font-semibold text-white" : "rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"}
                >
                  {period.label}
                </button>
              ))}
            </div>
            <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
              <CalendarDays className="size-4 text-[#1f6f8b]" />
              <input type="date" value={selectedDate} max={today} onChange={(event) => event.target.value && setSelectedDate(event.target.value)} className="bg-transparent text-sm font-semibold outline-none" />
            </label>
            <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
              <Clock3 className="size-4 text-[#1f6f8b]" />
              <select value={startHour} onChange={(event) => { const hour = Number(event.target.value); setStartHour(hour); if (hour > endHour) setEndHour(hour); }} className="bg-transparent text-sm font-semibold outline-none">
                {HOURS.map((hour) => <option key={hour} value={hour}>{String(hour).padStart(2, "0")}:00</option>)}
              </select>
              <span className="text-slate-300">—</span>
              <select value={endHour} onChange={(event) => { const hour = Number(event.target.value); setEndHour(hour); if (hour < startHour) setStartHour(hour); }} className="bg-transparent text-sm font-semibold outline-none">
                {HOURS.map((hour) => <option key={hour} value={hour}>{String(hour).padStart(2, "0")}:59</option>)}
              </select>
            </label>
            <button type="button" onClick={() => void exportExcel()} disabled={!dashboard || exporting} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-50">
              <FileSpreadsheet className="size-4" /> {exporting ? "Preparando…" : "Exportar Excel"}
            </button>
            <button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0d3b52] px-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
              <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} /> Actualizar
            </button>
          </div>
        </section>

        {error && (
          <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div><strong>No se pudieron cargar los datos.</strong> {error}</div>
          </div>
        )}

        {dashboard && reportDates.length > 1 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,.04)]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">Detalle por día</h2>
                <p className="mt-1 text-xs text-slate-500">Selecciona una fecha para actualizar todos los indicadores.</p>
              </div>
              <span className="text-xs font-medium text-slate-500">{hoursLabel}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {daily.map(({ date, totals }) => {
                const selected = date === visibleDate;
                return (
                  <button key={date} type="button" onClick={() => setActiveReportDate(date)} aria-pressed={selected} className={selected ? "rounded-xl border border-[#1f6f8b] bg-[#173143] p-3 text-left text-white shadow-sm" : "rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-left hover:border-sky-200 hover:bg-sky-50"}>
                    <span className={selected ? "block text-xs font-semibold text-white/75" : "block text-xs font-semibold text-slate-500"}>{formatDate(date, true)}</span>
                    <span className="mt-1 block text-xl font-semibold tabular-nums">{number(totals.entered + totals.exited)}</span>
                    <span className={selected ? "text-[.7rem] text-white/65" : "text-[.7rem] text-slate-500"}>movimientos</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {!visible && loading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl bg-white" />)}
          </div>
        ) : visible ? (
          <>
            <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric primary label="Personas dentro" value={visible.totals.occupancy} detail="Entradas menos salidas del día seleccionado" icon={Users} />
              <Metric label="Entradas del día" value={visible.totals.entered} detail={formatDate(visibleDate)} icon={ArrowDownRight} />
              <Metric label="Salidas del día" value={visible.totals.exited} detail={formatDate(visibleDate)} icon={ArrowUpRight} />
              <Metric label="Accesos reportados" value={`${visible.totals.online} / ${visible.totals.total}`} detail="Cámaras recibidas por la API" icon={Camera} />
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,.75fr)]">
              <article className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,.04)]">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div><h2 className="font-semibold">Movimiento por hora</h2><p className="mt-1 text-xs text-slate-500">{formatDate(visibleDate)} · {hoursLabel}</p></div>
                  <div className="flex gap-4 text-xs font-medium text-slate-500"><span className="flex items-center gap-2"><i className="size-2.5 rounded-sm bg-[#1f6f8b]" />Entradas</span><span className="flex items-center gap-2"><i className="size-2.5 rounded-sm bg-[#e5a63b]" />Salidas</span></div>
                </div>
                <div className="h-[330px] p-5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visible.traffic} margin={{ left: -15, right: 5, top: 8 }}>
                      <CartesianGrid vertical={false} stroke="#e7eef1" strokeDasharray="4 4" />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} interval="preserveStartEnd" />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#dbe5e9" }} />
                      <Bar dataKey="entradas" fill="#1f6f8b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="salidas" fill="#e5a63b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,.04)]">
                <h2 className="font-semibold">Estado de la información</h2>
                <div className={visible.totals.online === visible.totals.total ? "mt-5 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800" : "mt-5 flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-amber-800"}>
                  {visible.totals.online === visible.totals.total ? <Wifi className="size-5" /> : <WifiOff className="size-5" />}
                  <div><p className="text-sm font-semibold">{visible.totals.online === visible.totals.total ? "Sincronización completa" : "Sincronización parcial"}</p><p className="mt-0.5 text-xs">{visible.totals.online} de {visible.totals.total} accesos</p></div>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Última actualización</p><p className="mt-1 text-sm font-semibold">{formatDateTime(visible.generatedAt)}</p></div>
                <div className="mt-4 rounded-xl bg-slate-950 p-4 text-white"><p className="text-xs text-white/60">Pico de movimientos</p><p className="mt-2 text-2xl font-semibold">{number(peak.entradas + peak.salidas)}</p><p className="mt-1 text-xs text-amber-300">{peak.hour}</p></div>
              </aside>
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,.04)]">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold">Cámaras y accesos</h2><p className="mt-1 text-xs text-slate-500">Conteo correspondiente al día seleccionado</p></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Acceso</th><th className="px-4 py-3 text-right">Entradas</th><th className="px-4 py-3 text-right">Salidas</th><th className="px-5 py-3 text-right">Estado</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.cameras.map((camera) => (
                      <tr key={camera.id}><td className="px-5 py-3.5 font-semibold text-slate-800">{camera.name}</td><td className="px-4 py-3.5 text-right font-semibold tabular-nums">{number(camera.entered)}</td><td className="px-4 py-3.5 text-right font-semibold tabular-nums">{number(camera.exited)}</td><td className="px-5 py-3.5 text-right"><span className={camera.status === "online" ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700" : "inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"}>{camera.status === "online" ? "Recibido" : "Sin datos"}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
