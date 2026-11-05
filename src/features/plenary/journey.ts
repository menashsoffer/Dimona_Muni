// The journey bar along the top of the plenary: a sun hops from the right edge (פניה) through one stop
// per group and a shared "desk against desk" stop, to the left edge (תובנה).
import { GROUPS } from "../../content/people.ts";
import { esc } from "../../core/dom.ts";

const STOPS = [...GROUPS.map((g) => g.lead), "שולחן מול שולחן"];

/** Position along the track, 0 (start) to 1 (end), for stop i (-1 = start, STOPS.length = end). */
export const stopAt = (i: number): number => (i + 1) / (STOPS.length + 1);
export const COMPARE_STOP = GROUPS.length;
export const END_STOP = STOPS.length;

export interface Journey { move(stop: number): void }

export function mountJourney(bar: HTMLElement): Journey {
  bar.innerHTML = `<div class="jr" aria-hidden="true">
    <span class="jr-end jr-start">פניה</span><span class="jr-end jr-finish">תובנה</span>
    <div class="jr-track"><b></b></div>
    <ol>${STOPS.map((name, i) => `<li style="inset-inline-start:${stopAt(i) * 100}%"><i></i><span>${esc(name)}</span></li>`).join("")}</ol>
    <div class="jr-sun"><i></i></div>
  </div>`;
  const fill = bar.querySelector<HTMLElement>(".jr-track b")!;
  const sun = bar.querySelector<HTMLElement>(".jr-sun")!;
  const dots = [...bar.querySelectorAll<HTMLElement>("li")];
  let at = Number.NaN;
  return {
    move(stop) {
      if (stop === at) return;
      const pos = stopAt(stop) * 100;
      fill.style.width = `${pos}%`;
      sun.style.insetInlineStart = `${pos}%`;
      sun.classList.toggle("arrived", stop >= END_STOP);
      dots.forEach((d, i) => { d.className = i < stop ? "past" : i === stop ? "here" : ""; });
      // Restart the hop each time the sun moves to another stop.
      if (!Number.isNaN(at)) { sun.classList.remove("hop"); void sun.offsetWidth; sun.classList.add("hop"); }
      at = stop;
    },
  };
}
