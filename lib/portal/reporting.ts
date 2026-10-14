import type { PortalTicket, PortalUser } from "@/lib/portal/types";

const PORTAL_TIMEZONE_OFFSET = "-06:00";
const LATIN_LOG_DATE = /\[(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?:\s*:\s*\d{2})?\s*(AM|PM)\]/gi;
const ISO_LOG_DATE = /\[(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?\]/g;

export type TicketReportFilters = {
  from: string;
  to: string;
  clientId?: number | null;
  identifiers?: string[];
};

export type TicketReportRow = {
  ticket: PortalTicket;
  client: PortalUser;
  identifier: string | null;
  opened: boolean;
  closed: boolean;
  worked: boolean;
  openedAt: string;
  closedAt: string | null;
  lastWorkedAt: string | null;
};

export type TicketReport = {
  from: string;
  to: string;
  rows: TicketReportRow[];
  totals: {
    opened: number;
    closed: number;
    worked: number;
  };
  missingCloseHistory: number;
};

function parsePortalDate(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  const databaseDate = normalized.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::(\d{2}))?$/);
  const date = databaseDate
    ? new Date(`${databaseDate[1]}T${databaseDate[2]}:${databaseDate[3] ?? "00"}${PORTAL_TIMEZONE_OFFSET}`)
    : new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateRange(from: string, to: string) {
  const start = new Date(`${from}T00:00:00${PORTAL_TIMEZONE_OFFSET}`);
  const end = new Date(`${to}T23:59:59.999${PORTAL_TIMEZONE_OFFSET}`);
  return { start, end };
}

function isInRange(date: Date | null, start: Date, end: Date) {
  return !!date && date >= start && date <= end;
}

function logDates(value: string | null | undefined) {
  if (!value) return [];
  const dates: Date[] = [];
  for (const match of value.matchAll(LATIN_LOG_DATE)) {
    let hour = Number(match[4]) % 12;
    if (match[6].toUpperCase() === "PM") hour += 12;
    const date = new Date(
      `${match[3]}-${match[2]}-${match[1]}T${String(hour).padStart(2, "0")}:${match[5]}:00${PORTAL_TIMEZONE_OFFSET}`
    );
    if (!Number.isNaN(date.getTime())) dates.push(date);
  }
  for (const match of value.matchAll(ISO_LOG_DATE)) {
    const date = new Date(
      `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6] ?? "00"}${PORTAL_TIMEZONE_OFFSET}`
    );
    if (!Number.isNaN(date.getTime())) dates.push(date);
  }
  return dates;
}

function latestDate(dates: Date[]) {
  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString();
}

export function buildTicketReport(
  tickets: PortalTicket[],
  clients: PortalUser[],
  filters: TicketReportFilters
): TicketReport {
  const { start, end } = dateRange(filters.from, filters.to);
  const clientsById = new Map(
    clients
      .filter((client) => client.activo === 1)
      .map((client) => [client.id_usuario, client])
  );
  const identifiers = new Set(
    (filters.identifiers ?? []).map((identifier) => identifier.trim().toLocaleUpperCase("es"))
  );
  let missingCloseHistory = 0;

  const rows = tickets.flatMap<TicketReportRow>((ticket) => {
    if (ticket.activo !== 1) return [];
    const client = clientsById.get(ticket.id_usuario);
    if (!client) return [];
    if (filters.clientId && client.id_usuario !== filters.clientId) return [];
    const identifier = client.codigo_empresa?.trim() || null;
    if (
      identifiers.size &&
      (!identifier || !identifiers.has(identifier.toLocaleUpperCase("es")))
    ) {
      return [];
    }

    const openedDate = parsePortalDate(ticket.fecha_creacion);
    const explicitCloseDate = parsePortalDate(ticket.fecha_cierre);
    const closeDates = [explicitCloseDate, ...logDates(ticket.observacion_cierre)].filter(
      (date): date is Date => !!date
    );
    const workDates = [
      ...logDates(ticket.observacion_proceso),
      ...logDates(ticket.observacion_cierre),
    ];
    const updatedDate = parsePortalDate(ticket.fecha_actualizacion);
    if (
      updatedDate &&
      (!openedDate || updatedDate.getTime() !== openedDate.getTime())
    ) {
      workDates.push(updatedDate);
    }

    const opened = isInRange(openedDate, start, end);
    const closed = closeDates.some((date) => isInRange(date, start, end));
    const hasTechnician = !!ticket.id_tecnico || !!ticket.nombre_tecnico;
    const worked = hasTechnician && workDates.some((date) => isInRange(date, start, end));
    if (
      (ticket.estado === "Cerrado" || ticket.estado === "Resuelto") &&
      !closeDates.length
    ) {
      missingCloseHistory += 1;
    }
    if (!opened && !closed && !worked) return [];

    return [{
      ticket,
      client,
      identifier,
      opened,
      closed,
      worked,
      openedAt: openedDate?.toISOString() ?? ticket.fecha_creacion,
      closedAt: latestDate(closeDates.filter((date) => isInRange(date, start, end))),
      lastWorkedAt: latestDate(workDates.filter((date) => isInRange(date, start, end))),
    }];
  });

  rows.sort((left, right) => {
    const leftDate = left.lastWorkedAt ?? left.closedAt ?? left.openedAt;
    const rightDate = right.lastWorkedAt ?? right.closedAt ?? right.openedAt;
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });

  return {
    from: filters.from,
    to: filters.to,
    rows,
    totals: {
      opened: rows.filter((row) => row.opened).length,
      closed: rows.filter((row) => row.closed).length,
      worked: rows.filter((row) => row.worked).length,
    },
    missingCloseHistory,
  };
}
