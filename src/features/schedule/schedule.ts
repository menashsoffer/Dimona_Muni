// The schedule as a stack of cards: each slot slides up over the one before it as you scroll.
import { SCHEDULE } from "../../content/event.ts";
import { esc } from "../../core/dom.ts";

export function renderSchedule(list: HTMLElement): HTMLLIElement[] {
  list.innerHTML = SCHEDULE.map((r, i) => `
    <li class="${r.brk ? "brk" : ""}" style="--i:${i}">
      <span class="t">${r.from}–${r.to}</span>
      <div class="w"><b>${esc(r.title)}</b>${r.note ? `<span>${esc(r.note)}</span>` : ""}</div>
    </li>`).join("");
  return [...list.children] as HTMLLIElement[];
}

/** Called on every scroll frame: a card that the next one has slid over sinks back slightly. */
export function stackCards(items: HTMLLIElement[]): void {
  const tops = items.map((li) => li.getBoundingClientRect().top);
  items.forEach((li, k) => li.classList.toggle("under", k < items.length - 1 && tops[k + 1] - tops[k] < 40));
}
