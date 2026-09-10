import type { DashboardPayload } from "./types";

export function calendarDates(fromDate: string, toDate: string) {
  const dates: string[] = [];
  const current = new Date(`${fromDate}T00:00:00Z`);
  const last = new Date(`${toDate}T00:00:00Z`);
  while (current <= last) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export function dashboardForDay(dashboard: DashboardPayload, date: string) {
  if (dashboard.report.fromDate === date && dashboard.report.toDate === date) {
    return dashboard;
  }

  const cameras = dashboard.cameras.map((camera) => {
    const breakdown = camera.breakdown.filter(
      (point) =>
        point.date === date &&
        point.hour >= dashboard.report.startHour &&
        point.hour <= dashboard.report.endHour,
    );
    const entered = breakdown.reduce((sum, point) => sum + point.entradas, 0);
    const exited = breakdown.reduce((sum, point) => sum + point.salidas, 0);
    return {
      ...camera,
      entered,
      exited,
      occupancy: Math.max(0, entered - exited),
      breakdown,
    };
  });
  const traffic = Array.from(
    { length: dashboard.report.endHour - dashboard.report.startHour + 1 },
    (_, index) => {
      const hour = dashboard.report.startHour + index;
      return cameras.reduce(
        (total, camera) => {
          const point = camera.breakdown.find((item) => item.hour === hour);
          total.entradas += point?.entradas ?? 0;
          total.salidas += point?.salidas ?? 0;
          return total;
        },
        {
          hour: `${String(hour).padStart(2, "0")}:00`,
          entradas: 0,
          salidas: 0,
        },
      );
    },
  );
  const entered = cameras.reduce((sum, camera) => sum + camera.entered, 0);
  const exited = cameras.reduce((sum, camera) => sum + camera.exited, 0);

  return {
    ...dashboard,
    selectedDate: date,
    report: { ...dashboard.report, fromDate: date, toDate: date },
    totals: {
      ...dashboard.totals,
      entered,
      exited,
      occupancy: Math.max(0, entered - exited),
    },
    traffic,
    cameras,
  };
}
