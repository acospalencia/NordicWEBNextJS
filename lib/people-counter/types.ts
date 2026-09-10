export type TrafficPoint = {
  hour: string;
  entradas: number;
  salidas: number;
};

export type ReportPoint = {
  date: string;
  hour: number;
  entradas: number;
  salidas: number;
};

export type CameraReading = {
  id: string;
  name: string;
  entered: number;
  exited: number;
  occupancy: number;
  status: "online" | "offline";
  latencyMs: number | null;
  breakdown: ReportPoint[];
  error?: string;
};

export type DashboardPayload = {
  mode: "live" | "stored";
  generatedAt: string;
  selectedDate: string;
  report: {
    fromDate: string;
    toDate: string;
    startHour: number;
    endHour: number;
  };
  availableData: {
    firstDate: string | null;
    lastDate: string | null;
    days: string[];
  };
  totals: {
    entered: number;
    exited: number;
    occupancy: number;
    online: number;
    total: number;
  };
  traffic: TrafficPoint[];
  cameras: CameraReading[];
};

export function isDashboardPayload(value: unknown): value is DashboardPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DashboardPayload>;
  return (
    typeof candidate.generatedAt === "string" &&
    typeof candidate.selectedDate === "string" &&
    !!candidate.report &&
    !!candidate.availableData &&
    !!candidate.totals &&
    Array.isArray(candidate.traffic) &&
    Array.isArray(candidate.cameras)
  );
}
