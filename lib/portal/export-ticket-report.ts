import type { Worksheet } from "exceljs";
import type { TicketReport } from "@/lib/portal/reporting";

const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function displayDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/El_Salvador",
  }).format(date);
}

function styleHeader(sheet: Worksheet, rowNumber: number, cells: number) {
  const row = sheet.getRow(rowNumber);
  row.height = 24;
  for (let column = 1; column <= cells; column += 1) {
    const cell = row.getCell(column);
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B3460" } };
    cell.alignment = { vertical: "middle" };
  }
}

function download(buffer: ArrayBuffer, filename: string) {
  const url = URL.createObjectURL(new Blob([buffer], { type: XLSX_CONTENT_TYPE }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportTicketReportExcel(report: TicketReport) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nordictech";
  workbook.company = "Nordictech";
  workbook.title = `Reporte de tickets ${report.from} a ${report.to}`;

  const summary = workbook.addWorksheet("Resumen", {
    views: [{ showGridLines: false }],
  });
  summary.columns = [{ width: 32 }, { width: 20 }];
  summary.mergeCells("A1:B1");
  summary.getCell("A1").value = "REPORTE DE TICKETS DE SOPORTE";
  summary.getCell("A1").font = { bold: true, size: 18, color: { argb: "FF0B3460" } };
  summary.getCell("A3").value = "Periodo";
  summary.getCell("B3").value = `${report.from} al ${report.to}`;
  summary.getCell("A5").value = "Tickets abiertos";
  summary.getCell("B5").value = report.totals.opened;
  summary.getCell("A6").value = "Tickets cerrados";
  summary.getCell("B6").value = report.totals.closed;
  summary.getCell("A7").value = "Tickets atendidos";
  summary.getCell("B7").value = report.totals.worked;
  summary.getCell("A9").value = "Registros sin historial de cierre";
  summary.getCell("B9").value = report.missingCloseHistory;
  summary.getColumn(1).font = { bold: true, color: { argb: "FF334155" } };

  const detail = workbook.addWorksheet("Detalle", {
    views: [{ state: "frozen", ySplit: 1, showGridLines: false }],
  });
  detail.columns = [
    { header: "Ticket", key: "ticket", width: 14 },
    { header: "Asunto", key: "subject", width: 36 },
    { header: "Cliente", key: "client", width: 28 },
    { header: "Identificador", key: "identifier", width: 20 },
    { header: "Técnico", key: "technician", width: 26 },
    { header: "Estado actual", key: "status", width: 18 },
    { header: "Apertura", key: "openedAt", width: 23 },
    { header: "Cierre en periodo", key: "closedAt", width: 23 },
    { header: "Última atención", key: "workedAt", width: 23 },
    { header: "Abierto", key: "opened", width: 12 },
    { header: "Cerrado", key: "closed", width: 12 },
    { header: "Atendido", key: "worked", width: 12 },
  ];
  styleHeader(detail, 1, 12);
  report.rows.forEach((row) => {
    detail.addRow({
      ticket: `TK-${row.ticket.id_ticket}`,
      subject: row.ticket.titulo,
      client: row.client.nombre,
      identifier: row.identifier ?? "Sin identificador",
      technician: row.ticket.nombre_tecnico ?? "Sin asignar",
      status: row.ticket.estado,
      openedAt: displayDate(row.openedAt),
      closedAt: displayDate(row.closedAt),
      workedAt: displayDate(row.lastWorkedAt),
      opened: row.opened ? "Sí" : "No",
      closed: row.closed ? "Sí" : "No",
      worked: row.worked ? "Sí" : "No",
    });
  });
  detail.autoFilter = { from: "A1", to: `L${Math.max(2, detail.rowCount)}` };
  detail.headerFooter.oddFooter = "&LNordictech&CReporte de tickets&RPágina &P de &N";

  const output = await workbook.xlsx.writeBuffer();
  const bytes = new Uint8Array(output.byteLength);
  bytes.set(new Uint8Array(output));
  download(bytes.buffer, `reporte-tickets-${report.from}-${report.to}.xlsx`);
}

function escapeHtml(value: string | number | null) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function printTicketReportPdf(report: TicketReport) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) throw new Error("El navegador bloqueó la ventana de impresión.");
  printWindow.opener = null;
  const rows = report.rows.map((row) => `
    <tr>
      <td>TK-${escapeHtml(row.ticket.id_ticket)}</td>
      <td>${escapeHtml(row.ticket.titulo)}</td>
      <td>${escapeHtml(row.client.nombre)}</td>
      <td>${escapeHtml(row.identifier ?? "Sin identificador")}</td>
      <td>${escapeHtml(row.ticket.nombre_tecnico ?? "Sin asignar")}</td>
      <td>${escapeHtml(row.ticket.estado)}</td>
      <td>${row.opened ? "Sí" : "No"}</td>
      <td>${row.closed ? "Sí" : "No"}</td>
      <td>${row.worked ? "Sí" : "No"}</td>
    </tr>`).join("");

  printWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Reporte de tickets</title><style>
    @page{size:landscape;margin:12mm}body{font-family:Arial,sans-serif;color:#172033;margin:0}h1{font-size:20px;color:#0b3460;margin:0 0 5px}.period{font-size:12px;color:#64748b}.metrics{display:flex;gap:12px;margin:20px 0}.metric{border:1px solid #d8e0ea;border-radius:8px;padding:10px 14px;min-width:130px}.metric b{display:block;color:#2563eb;font-size:22px;margin-top:4px}table{width:100%;border-collapse:collapse;font-size:9px}th{background:#0b3460;color:#fff;text-align:left;padding:7px}td{border-bottom:1px solid #dde5ee;padding:7px;vertical-align:top}tr:nth-child(even){background:#f5f8fb}.note{font-size:9px;color:#64748b;margin-top:12px}
  </style></head><body><h1>Reporte de tickets de soporte</h1><div class="period">Periodo: ${escapeHtml(report.from)} al ${escapeHtml(report.to)}</div><div class="metrics"><div class="metric">Abiertos<b>${report.totals.opened}</b></div><div class="metric">Cerrados<b>${report.totals.closed}</b></div><div class="metric">Atendidos<b>${report.totals.worked}</b></div></div><table><thead><tr><th>Ticket</th><th>Asunto</th><th>Cliente</th><th>Identificador</th><th>Técnico</th><th>Estado</th><th>Abierto</th><th>Cerrado</th><th>Atendido</th></tr></thead><tbody>${rows || '<tr><td colspan="9">Sin actividad para los filtros seleccionados.</td></tr>'}</tbody></table><p class="note">Generado desde datos activos del sistema. Los cierres se contabilizan únicamente cuando existe una fecha histórica de cierre dentro del periodo.</p><script>window.addEventListener("load",()=>{window.print()},{once:true});</script></body></html>`);
  printWindow.document.close();
}
