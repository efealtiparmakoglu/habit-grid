/* DOM layer: month/habit inputs, printable grid with checkboxes,
 * add/remove habits, print button. */

import { DEFAULT_HABITS, buildGrid, type Habit } from "./core.ts";

const $ = (id: string): HTMLElement => document.getElementById(id) as HTMLElement;

function readHabits(): Habit[] {
  return [...document.querySelectorAll<HTMLInputElement>("#habits input:checked")].map(
    (box) => ({ name: box.dataset.name ?? "", color: box.dataset.color ?? "#333" }),
  );
}

function habitControls(): void {
  const container = $("habit-list");
  container.innerHTML = "";
  const all = [...DEFAULT_HABITS];
  const custom = localStorage.getItem("habit-custom");
  if (custom) {
    for (const name of JSON.parse(custom) as string[]) {
      all.push({ name, color: "#555" });
    }
  }
  for (const habit of all) {
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = true;
    box.dataset.name = habit.name;
    box.dataset.color = habit.color;
    label.appendChild(box);
    label.append(` ${habit.name}`);
    container.appendChild(label);
  }
  const addRow = document.createElement("div");
  addRow.className = "add-row";
  const input = document.createElement("input");
  input.placeholder = "custom habit…";
  const button = document.createElement("button");
  button.textContent = "add";
  button.addEventListener("click", () => {
    if (input.value.trim() === "") return;
    const saved = JSON.parse(localStorage.getItem("habit-custom") ?? "[]") as string[];
    saved.push(input.value.trim());
    localStorage.setItem("habit-custom", JSON.stringify(saved));
    habitControls();
    render();
  });
  addRow.append(input, button);
  container.appendChild(addRow);
}

function render(): void {
  const year = Number(($("year") as HTMLInputElement).value) || 2026;
  const month = Number(($("month") as HTMLSelectElement).value) || 9;
  const habits = readHabits();
  if (habits.length === 0) {
    $("grid").innerHTML = "<p>select at least one habit</p>";
    return;
  }
  let spec;
  try {
    spec = buildGrid(year, month, habits);
  } catch (error) {
    $("grid").textContent = String(error);
    return;
  }

  const gridEl = $("grid");
  gridEl.innerHTML = "";
  const title = document.createElement("h2");
  title.textContent = `${spec.monthName} ${spec.year}`;
  gridEl.appendChild(title);

  const table = document.createElement("table");
  const headerRow = table.insertRow();
  headerRow.appendChild(document.createElement("th")).textContent = "habit";
  for (let day = 1; day <= spec.days; day++) {
    const th = document.createElement("th");
    th.textContent = String(day);
    if ((spec.firstWeekday + day - 1) % 7 >= 5) th.classList.add("weekend");
    headerRow.appendChild(th);
  }
  for (const habit of spec.habits) {
    const row = table.insertRow();
    row.insertCell().textContent = habit.name;
    for (let day = 1; day <= spec.days; day++) {
      const cell = row.insertCell();
      cell.classList.add("check");
      if ((spec.firstWeekday + day - 1) % 7 >= 5) cell.classList.add("weekend");
    }
  }
  gridEl.appendChild(table);
  ($("summary") as HTMLElement).textContent =
    `${spec.days} days × ${spec.habits.length} habits — print me ✓`;
}

function setup(): void {
  const now = new Date();
  ($("year") as HTMLInputElement).value = String(now.getFullYear());
  ($("month") as HTMLSelectElement).value = String(now.getMonth() + 1);
  habitControls();
  render();
  $("year")?.addEventListener("input", render);
  $("month")?.addEventListener("change", render);
  $("print")?.addEventListener("click", () => window.print());
  $("render")?.addEventListener("click", render);
}

setup();
