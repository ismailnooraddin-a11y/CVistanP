export function formatCurrency(value: number, currency: "USD" | "IQD" = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IQD" ? 0 : 0
  }).format(value);
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", options ?? { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function formatDateTime(value: string): string {
  return formatDate(value, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function relativeDate(value: string, now = new Date("2026-07-17T12:00:00Z")): string {
  const date = new Date(value);
  const diffMinutes = Math.round((date.getTime() - now.getTime()) / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");
  return formatter.format(Math.round(diffHours / 24), "day");
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
