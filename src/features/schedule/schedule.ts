// The schedule as a stack of cards: each slot slides up over the one before it as you scroll,
// with a rail of dots beside it and an "03 / 11" pill that show where you are and how much is left.
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

/** One dot per slot, in a rail that sticks beside the cards. */
export function renderRail(rail: HTMLElement, count: number): void {
  rail.innerHTML = "<li></li>".repeat(count);
}

// Where card k sticks, in px from the top of the viewport. Keep in step with .sched li{top} in schedule.css.
const stickTop = (k: number): number => 104 + k * 6;
const pad = (n: number): string => String(n).padStart(2, "0");

/** Called on every scroll frame. A card the next one has slid over sinks back slightly;
 *  a card that has reached the top of the stack counts as reached on the rail and the pill. */
export function stackCards(items: HTMLLIElement[], rail: HTMLElement, pill: HTMLElement): void {
  const dots = [...rail.children] as HTMLLIElement[];
  const tops = items.map((li) => li.getBoundingClientRect().top);
  items.forEach((li, k) => li.classList.toggle("under", k < items.length - 1 && tops[k + 1] - tops[k] < 40));
  const reached = Math.max(1, tops.filter((t, k) => t <= stickTop(k) + 2).length);
  dots.forEach((d, k) => {
    d.classList.toggle("lit", k < reached);
    d.classList.toggle("cur", k === reached - 1);
  });
  rail.style.setProperty("--reach", items.length > 1 ? ((reached - 1) / (items.length - 1)).toFixed(3) : "0");
  pill.innerHTML = `${pad(reached)} <b>/ ${pad(items.length)}</b>`;
}
