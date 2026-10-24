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

const pad = (n: number): string => String(n).padStart(2, "0");

/** Called on every scroll frame: fill the line, light the dots that are above the fill,
 *  and show which slot the reader has reached in the "03 / 11" pill. */
export function fillTimeline(list: HTMLElement, items: HTMLLIElement[], pill?: HTMLElement): void {
  const r = list.getBoundingClientRect();
  const sp = Math.max(0, Math.min(1, (innerHeight * 0.62 - r.top) / r.height));
  list.style.setProperty("--sp", sp.toFixed(3));
  const limit = r.top + r.height * sp;
  let reached = 0;
  items.forEach((li) => {
    const lit = li.getBoundingClientRect().top + 20 < limit;
    li.classList.toggle("lit", lit);
    if (lit) reached++;
  });
  if (pill) pill.textContent = `${pad(Math.max(1, reached))} / ${pad(items.length)}`;
}
