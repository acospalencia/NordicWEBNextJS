import type { Cell, Workbook, Worksheet } from "exceljs";
import { calendarDates, dashboardForDay } from "./report";
import type { DashboardPayload, TrafficPoint } from "./types";

const COLORS = {
  navy: "FF0D3B52",
  teal: "FF1F6F8B",
  tealLight: "FFDDECF1",
  gold: "FFE5A63B",
  goldLight: "FFFFF3D8",
  green: "FF16815D",
  ink: "FF173143",
  muted: "FF607482",
  line: "FFD6E2E6",
  soft: "FFF3F7F8",
  white: "FFFFFFFF",
};

function eachCell(
  sheet: Worksheet,
  top: number,
  left: number,
  bottom: number,
  right: number,
  callback: (cell: Cell) => void,
) {
  for (let row = top; row <= bottom; row += 1) {
    for (let column = left; column <= right; column += 1) {
      callback(sheet.getCell(row, column));
    }
  }
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("es-SV", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(`${value}T12:00:00Z`))
    .replace(".", "");
}

function rangeLabel(dashboard: DashboardPayload) {
  const { fromDate, toDate, startHour, endHour } = dashboard.report;
  const dates =
    fromDate === toDate
      ? dateLabel(toDate)
      : `${dateLabel(fromDate)} al ${dateLabel(toDate)}`;
  return `${dates} · ${String(startHour).padStart(2, "0")}:00–${String(endHour).padStart(2, "0")}:59`;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.roundRect(x, y, width, height, safeRadius);
}

function chartImage(traffic: TrafficPoint[], label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1120;
  canvas.height = 480;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no pudo crear el gráfico del reporte.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#173143";
  context.font = "600 25px Arial";
  context.fillText("Movimiento por hora", 48, 48);
  context.fillStyle = "#607482";
  context.font = "15px Arial";
  context.fillText(label, 48, 74);

  const plot = { left: 70, top: 105, right: 1070, bottom: 410 };
  const width = plot.right - plot.left;
  const height = plot.bottom - plot.top;
  const maximum = Math.max(
    4,
    ...traffic.flatMap((point) => [point.entradas, point.salidas]),
  );
  const axisMaximum = Math.ceil(maximum / 4) * 4;
  context.textAlign = "right";
  context.font = "12px Arial";
  for (let tick = 0; tick <= 4; tick += 1) {
    const value = (axisMaximum / 4) * tick;
    const y = plot.bottom - (height / 4) * tick;
    context.strokeStyle = tick === 0 ? "#b9cdd5" : "#e4ecef";
    context.beginPath();
    context.moveTo(plot.left, y);
    context.lineTo(plot.right, y);
    context.stroke();
    context.fillStyle = "#71848f";
    context.fillText(String(value), plot.left - 12, y + 4);
  }

  const groupWidth = width / Math.max(traffic.length, 1);
  const barWidth = Math.max(4, Math.min(14, groupWidth * 0.3));
  context.textAlign = "center";
  traffic.forEach((point, index) => {
    const center = plot.left + groupWidth * index + groupWidth / 2;
    const enteredHeight = (point.entradas / axisMaximum) * height;
    const exitedHeight = (point.salidas / axisMaximum) * height;
    context.fillStyle = "#1f6f8b";
    roundedRect(context, center - barWidth - 2, plot.bottom - enteredHeight, barWidth, enteredHeight, 3);
    context.fill();
    context.fillStyle = "#e5a63b";
    roundedRect(context, center + 2, plot.bottom - exitedHeight, barWidth, exitedHeight, 3);
    context.fill();
    if (index % (traffic.length > 16 ? 2 : 1) === 0 || index === traffic.length - 1) {
      context.fillStyle = "#607482";
      context.font = "12px Arial";
      context.fillText(point.hour, center, plot.bottom + 25);
    }
  });
  return canvas.toDataURL("image/png");
}

function styleHeader(sheet: Worksheet, row: number, columns: number) {
  eachCell(sheet, row, 1, row, columns, (cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.navy } };
    cell.font = { name: "Aptos", size: 10, bold: true, color: { argb: COLORS.white } };
    cell.alignment = { vertical: "middle" };
  });
}

function addDailySheet(workbook: Workbook, source: DashboardPayload, date: string) {
  const dashboard = dashboardForDay(source, date);
  const sheet = workbook.addWorksheet(`Día ${date.slice(5)}`, {
    views: [{ state: "frozen", ySplit: 7, showGridLines: false }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  sheet.columns = [
    { width: 30 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
    { width: 16 },
  ];
  sheet.mergeCells("A1:L2");
  sheet.getCell("A1").value = "CONTEO DE PERSONAS BAMBÚ";
  sheet.getCell("A1").font = { name: "Aptos Display", size: 23, bold: true, color: { argb: COLORS.white } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.navy } };
  sheet.getCell("A1").alignment = { vertical: "middle" };
  sheet.mergeCells("A3:L3");
  sheet.getCell("A3").value = `Detalle diario · ${rangeLabel(dashboard)}`;
  sheet.getCell("A3").font = { name: "Aptos", size: 11, color: { argb: COLORS.muted } };

  const cards = [
    ["ENTRADAS", dashboard.totals.entered, COLORS.tealLight, COLORS.teal],
    ["SALIDAS", dashboard.totals.exited, COLORS.goldLight, "FF9B6507"],
    ["BALANCE", dashboard.totals.occupancy, "FFE9F4F1", COLORS.green],
  ] as const;
  cards.forEach(([label, value, fill, color], index) => {
    const cell = sheet.getCell(5, index + 1);
    cell.value = `${label}\n${new Intl.NumberFormat("es-SV").format(value)}`;
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.font = { name: "Aptos", size: 12, bold: true, color: { argb: color } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
    cell.border = {
      top: { style: "thin", color: { argb: COLORS.line } },
      bottom: { style: "thin", color: { argb: COLORS.line } },
      left: { style: "thin", color: { argb: COLORS.line } },
      right: { style: "thin", color: { argb: COLORS.line } },
    };
  });
  sheet.getRow(5).height = 45;
  ["HORA", "ENTRADAS", "SALIDAS"].forEach((label, index) => {
    sheet.getCell(7, index + 1).value = label;
  });
  styleHeader(sheet, 7, 3);
  dashboard.traffic.forEach((point, index) => {
    const row = index + 8;
    sheet.getCell(row, 1).value = point.hour;
    sheet.getCell(row, 2).value = point.entradas;
    sheet.getCell(row, 3).value = point.salidas;
    if (index % 2 === 1) {
      eachCell(sheet, row, 1, row, 3, (cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.soft } };
      });
    }
  });
  const chartId = workbook.addImage({
    base64: chartImage(dashboard.traffic, rangeLabel(dashboard)),
    extension: "png",
  });
  sheet.addImage(chartId, { tl: { col: 3.45, row: 4.2 }, ext: { width: 760, height: 330 } });

  const accessStart = Math.max(35, dashboard.traffic.length + 10);
  ["ACCESO", "ENTRADAS", "SALIDAS", "BALANCE"].forEach((label, index) => {
    sheet.getCell(accessStart, index + 1).value = label;
  });
  styleHeader(sheet, accessStart, 4);
  dashboard.cameras.forEach((camera, index) => {
    const row = accessStart + index + 1;
    sheet.getCell(row, 1).value = camera.name;
    sheet.getCell(row, 2).value = camera.entered;
    sheet.getCell(row, 3).value = camera.exited;
    sheet.getCell(row, 4).value = camera.entered - camera.exited;
  });
  sheet.autoFilter = { from: `A${accessStart}`, to: `D${accessStart + dashboard.cameras.length}` };
  sheet.headerFooter.oddFooter = `&LNordictech&C${dateLabel(date)}&RPágina &P de &N`;
}

function addDetailSheet(workbook: Workbook, dashboard: DashboardPayload) {
  const sheet = workbook.addWorksheet("Detalle horario", {
    views: [{ state: "frozen", xSplit: 3, ySplit: 1, showGridLines: false }],
  });
  sheet.columns = [
    { header: "Fecha", key: "date", width: 15 },
    { header: "Hora", key: "hour", width: 11 },
    { header: "Acceso", key: "camera", width: 35 },
    { header: "Entradas", key: "entered", width: 14 },
    { header: "Salidas", key: "exited", width: 14 },
    { header: "Balance", key: "balance", width: 14 },
  ];
  styleHeader(sheet, 1, 6);
  const dates = calendarDates(dashboard.report.fromDate, dashboard.report.toDate);
  for (const date of dates) {
    const day = dashboardForDay(dashboard, date);
    for (const camera of day.cameras) {
      const points = new Map(camera.breakdown.map((point) => [point.hour, point]));
      for (let hour = dashboard.report.startHour; hour <= dashboard.report.endHour; hour += 1) {
        const point = points.get(hour);
        const entered = point?.entradas ?? 0;
        const exited = point?.salidas ?? 0;
        const row = sheet.addRow({
          date: new Date(`${date}T12:00:00Z`),
          hour: `${String(hour).padStart(2, "0")}:00`,
          camera: camera.name,
          entered,
          exited,
          balance: entered - exited,
        });
        row.getCell(1).numFmt = "dd mmm yyyy";
      }
    }
  }
  sheet.autoFilter = { from: "A1", to: `F${Math.max(2, sheet.rowCount)}` };
  sheet.headerFooter.oddFooter = "&LNordictech&CDetalle horario&RPágina &P de &N";
}

function download(buffer: ArrayBuffer, filename: string) {
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportPeopleCounterExcel(dashboard: DashboardPayload) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nordictech";
  workbook.company = "Nordictech";
  workbook.title = "Reporte de conteo de personas";
  const dates = calendarDates(dashboard.report.fromDate, dashboard.report.toDate);
  dates.forEach((date) => addDailySheet(workbook, dashboard, date));
  addDetailSheet(workbook, dashboard);
  const output = await workbook.xlsx.writeBuffer();
  const bytes = new Uint8Array(output.byteLength);
  bytes.set(new Uint8Array(output));
  download(
    bytes.buffer,
    `reporte-conteo-bambu-${dashboard.report.fromDate}-${dashboard.report.toDate}.xlsx`,
  );
}
