// src/lib/dateRanges.ts
//
// Client-side date-range math for the Sessions calendar views. The backend
// only exposes a flat searchable list (POST /api/sessions/search with
// date_from/date_to) — it has no concept of "day/week/month view". Bucketing
// a selected date into the right request range, and the flat response back
// into calendar cells, is frontend work done here.

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

// Monday–Sunday week containing `date`.
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const start = addDays(date, -daysSinceMonday);
  const end = addDays(start, 6);
  return { start, end };
}

export function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
}

export function formatWeekLabel(start: Date, end: Date): string {
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startLabel} – ${endLabel}`;
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
