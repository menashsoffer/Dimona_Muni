// Cards dealt like a deck: each one swings in from the side as it rises into view,
// and is tossed off the other way once it slides up under the nav.
import { reducedMotion } from "../../core/scroll.ts";

const clamp = (v: number): number => Math.min(1, Math.max(0, v));
const easeOut = (t: number): number => 1 - (1 - t) ** 3;
const easeIn = (t: number): number => t * t;

/** Returns the per-frame update to pass to scrollEffects, or undefined under reduced motion. */
export function dealCards(selector: string): (() => void) | undefined {
  if (reducedMotion()) return undefined;
  const cards = [...document.querySelectorAll<HTMLElement>(selector)];
  const nav = document.querySelector("nav");
  cards.forEach((c) => c.classList.add("dealt"));

  return () => {
    const top = nav?.getBoundingClientRect().bottom ?? 0;
    const zone = Math.min(200, innerHeight * 0.28);
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      // Side: the card's own column in a multi-column grid, otherwise alternate.
      const grid = c.parentElement?.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const gmid = grid ? grid.left + grid.width / 2 : mid;
      const side = Math.abs(mid - gmid) > 20 ? Math.sign(mid - gmid) : (i % 2 ? -1 : 1);

      const enter = 1 - easeOut(clamp((innerHeight - r.top) / zone));
      const leave = easeIn(clamp((top - r.top) / (r.height * 0.85)));
      const x = side * (enter * 90 + leave * 140);
      const y = enter * 36 - leave * 20;
      const turn = side * (enter * 7 + leave * 12);
      c.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      c.style.rotate = `${turn.toFixed(2)}deg`;
      c.style.opacity = (1 - Math.max(enter, leave)).toFixed(3);
    });
  };
}
