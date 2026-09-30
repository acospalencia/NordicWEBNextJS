import "server-only";

import {
  normalizePeopleCounterCenterSlug,
  PEOPLE_COUNTER_CENTERS,
  type PeopleCounterCenterOption,
} from "@/lib/people-counter/centers";

function apiBaseUrl() {
  const configured =
    process.env.PEOPLE_COUNTER_API_BASE_URL ??
    "https://conteo.nordictech-corp.com";
  const url = new URL(configured);
  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new Error("PEOPLE_COUNTER_API_BASE_URL debe utilizar HTTPS.");
  }
  return configured.replace(/\/$/, "");
}

export async function getPeopleCounterCenterOptions(): Promise<
  PeopleCounterCenterOption[]
> {
  try {
    const token = process.env.PEOPLE_COUNTER_API_READ_TOKEN;
    if (!token) throw new Error("PEOPLE_COUNTER_API_READ_TOKEN no está configurado.");

    const response = await fetch(
      `${apiBaseUrl()}/api/v1/people-counter/centers`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      },
    );
    if (!response.ok) {
      throw new Error(`La API de conteo respondió HTTP ${response.status}.`);
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object" || !("centers" in payload)) {
      throw new Error("La API de conteo no devolvió la lista de centros.");
    }
    const rawCenters = (payload as { centers?: unknown }).centers;
    if (!Array.isArray(rawCenters)) {
      throw new Error("La lista de centros de conteo no es válida.");
    }

    const centers: PeopleCounterCenterOption[] = [];
    const seen = new Set<string>();
    for (const rawCenter of rawCenters) {
      if (!rawCenter || typeof rawCenter !== "object") continue;
      const record = rawCenter as Record<string, unknown>;
      const slug = normalizePeopleCounterCenterSlug(record.slug);
      const name = String(record.name ?? "").trim();
      if (!slug || !name || seen.has(slug)) continue;
      seen.add(slug);
      centers.push({ slug, name });
    }

    return centers.length > 0 ? centers : [...PEOPLE_COUNTER_CENTERS];
  } catch (error) {
    console.error("No fue posible cargar los centros para asignación:", error);
    return [...PEOPLE_COUNTER_CENTERS];
  }
}
