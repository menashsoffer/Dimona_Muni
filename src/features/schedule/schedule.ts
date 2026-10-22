// The schedule list, with the timeline that fills as you scroll.
import { SCHEDULE } from "../../content/event.ts";
import { esc } from "../../core/dom.ts";

export function renderSchedule(list: HTMLElement): HTMLLIElement[] {
  list.innerHTML = SCHEDULE.map((r) => `
    <li class="${r.brk ? "brk" : ""}">
      <span class="t">${r.from}–${r.to}</span>
      <div class="w"><b>${esc(r.title)}</b>${r.note ? `<span>${esc(r.note)}</span>` : ""}</div>
    </li>`).join("");
  return [...list.children] as HTMLLIElement[];
}

/** Called on every scroll frame: fill the line and light the dots that are above the fill. */
export function fillTimeline(list: HTMLElement, items: HTMLLIElement[]): void {
  const r = list.getBoundingClientRect();
  const sp = Math.max(0, Math.min(1, (innerHeight * 0.62 - r.top) / r.height));
  list.style.setProperty("--sp", sp.toFixed(3));
  const limit = r.top + r.height * sp;
  items.forEach((li) => li.classList.toggle("lit", li.getBoundingClientRect().top + 20 < limit));
}
