/* Pure logic: month/day math, grid generation, defaults. No DOM. */

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Days in a month (1-based month). Leap-year aware. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** ISO-ish weekday: 0 = Monday .. 6 = Sunday. */
export function firstWeekday(year: number, month: number): number {
  return (new Date(year, month - 1, 1).getDay() + 6) % 7;
}

export interface Habit {
  name: string;
  color: string;
}

export const DEFAULT_HABITS: Habit[] = [
  { name: "Exercise", color: "#2e7d32" },
  { name: "Read", color: "#1565c0" },
  { name: "Meditate", color: "#6a1b9a" },
  { name: "No sugar", color: "#c62828" },
];

/** Default month: the current month. Pure input → output. */
export function defaultYearMonth(now: Date): { year: number; month: number } {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export interface GridSpec {
  year: number;
  month: number;
  monthName: string;
  days: number;
  firstWeekday: number;
  habits: Habit[];
}

/** Build the printable grid spec. */
export function buildGrid(
  year: number,
  month: number,
  habits: Habit[],
): GridSpec {
  if (month < 1 || month > 12) throw new Error("month must be 1..12");
  if (habits.length === 0) throw new Error("at least one habit required");
  return {
    year,
    month,
    monthName: MONTH_NAMES[month - 1] as string,
    days: daysInMonth(year, month),
    firstWeekday: firstWeekday(year, month),
    habits,
  };
}

/** Serialize the spec to markdown (export alternative). */
export function toMarkdown(spec: GridSpec): string {
  const header = `# ${spec.monthName} ${spec.year} — habit grid\n`;
  const names = spec.habits.map((h) => h.name).join(", ");
  const table = [
    "| Habit | " + Array.from({ length: spec.days }, (_, i) => i + 1).join(" | ") + " |",
    "|" + "---|".repeat(spec.days + 1),
    ...spec.habits.map((h) => `| ${h.name} | ${" ".repeat(spec.days * 3 - 1)} |`),
  ];
  return `${header}\nHabits: ${names}\n\n${table.join("\n")}\n`;
}
