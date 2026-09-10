export const PEOPLE_COUNTER_CENTERS = [
  { slug: "bambu", name: "Centro Comercial Bambú" },
  {
    slug: "el-encuentro-sonsonate",
    name: "CC El Encuentro Sonsonate",
  },
] as const;

const CENTER_SLUG_PATTERN = /^[a-z0-9-]{2,64}$/;

export function normalizePeopleCounterCenterSlug(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const slug = String(value).trim().toLowerCase();
  return CENTER_SLUG_PATTERN.test(slug) ? slug : null;
}

export function getPeopleCounterCenterName(slug: string) {
  return (
    PEOPLE_COUNTER_CENTERS.find((center) => center.slug === slug)?.name ??
    slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}
