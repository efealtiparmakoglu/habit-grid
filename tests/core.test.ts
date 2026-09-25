import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildGrid,
  daysInMonth,
  defaultYearMonth,
  firstWeekday,
  toMarkdown,
} from "../src/core.ts";

test("daysInMonth: leap years handled", () => {
  assert.equal(daysInMonth(2026, 9), 30);
  assert.equal(daysInMonth(2026, 2), 28);
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2000, 2), 29);
  assert.equal(daysInMonth(1900, 2), 28);
});

test("firstWeekday: Monday = 0", () => {
  // Sep 1 2026 is a Tuesday
  assert.equal(firstWeekday(2026, 9), 1);
  // Sep 1 2025 is a Monday
  assert.equal(firstWeekday(2025, 9), 0);
});

test("defaultYearMonth reads a date", () => {
  const { year, month } = defaultYearMonth(new Date(2026, 8, 24));
  assert.equal(year, 2026);
  assert.equal(month, 9);
});

test("buildGrid validates month and habits", () => {
  assert.throws(() => buildGrid(2026, 13, [{ name: "x", color: "#fff" }]));
  assert.throws(() => buildGrid(2026, 9, []));
});

test("buildGrid produces correct spec", () => {
  const spec = buildGrid(2026, 9, [{ name: "Exercise", color: "#2e7d32" }]);
  assert.equal(spec.days, 30);
  assert.equal(spec.firstWeekday, 1);
  assert.equal(spec.monthName, "September");
  assert.equal(spec.habits.length, 1);
});

test("toMarkdown renders a full-width table", () => {
  const spec = buildGrid(2026, 9, [{ name: "Exercise", color: "#2e7d32" }]);
  const md = toMarkdown(spec);
  assert.ok(md.includes("# September 2026 — habit grid"));
  assert.ok(md.includes("| Habit | 1 | 2 |"));
  assert.ok(md.includes("| Exercise |"));
});
