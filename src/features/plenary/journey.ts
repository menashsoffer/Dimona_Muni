// The journey bar along the top of the plenary: a resident's request travels from the right edge
// (פניה) through one stop per group to the left edge (תובנה).
import { GROUPS } from "../../content/people.ts";
import { esc } from "../../core/dom.ts";

/** Position along the track, 0 (start) to 1 (end), for a stop index (-1 = start, GROUPS.length = end). */
export const stopAt = (i: number): number => (i + 1) / (GROUPS.length + 1);

export function journeyBar(pos: number, current: number): string {
  const arrived = pos >= 1;
  const stops = GROUPS.map((g, i) =>
    `<li class="${i < current ? "past" : i === current ? "here" : ""}" style="inset-inline-start:${stopAt(i) * 100}%"><i></i><span>${esc(g.lead)}</span></li>`).join("");
  return `<div class="jr" aria-hidden="true">
    <span class="jr-end jr-start">פניה</span><span class="jr-end jr-finish">תובנה</span>
    <div class="jr-track"><b style="width:${pos * 100}%"></b></div>
    <ol>${stops}</ol>
    <div class="jr-letter${arrived ? " sun" : ""}" style="inset-inline-start:${pos * 100}%">${arrived ? "☀" : "✉"}</div>
  </div>`;
}
