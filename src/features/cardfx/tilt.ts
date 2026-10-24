// Cards that stand up as they scroll in, hinged on their bottom edge like a sign raised off the table,
// and lean back into the distance as they leave under the nav.
import { reducedMotion } from "../../core/scroll.ts";

const clamp = (v: number): number => Math.min(1, Math.max(0, v));
const easeOut = (t: number): number => 1 - (1 - t) ** 3;

/** Returns the per-frame update to pass to scrollEffects, or undefined under reduced motion. */
export function tiltCards(selector: string): (() => void) | undefined {
  if (reducedMotion()) return undefined;
  const cards = [...document.querySelectorAll<HTMLElement>(selector)];
  const nav = document.querySelector("nav");
  cards.forEach((c) => c.classList.add("tilted"));

  return () => {
    const top = nav?.getBoundingClientRect().bottom ?? 0;
    const zone = Math.min(240, innerHeight * 0.32);
    cards.forEach((c) => {
      const r = c.getBoundingClientRect();
      const enter = 1 - easeOut(clamp((innerHeight - r.top) / zone));
      const leave = clamp((top - r.top) / (r.height * 0.8));
      c.style.rotate = `x ${(enter * 70 - leave * 34).toFixed(1)}deg`;
      c.style.scale = (1 - leave * 0.18).toFixed(3);
      c.style.opacity = (1 - Math.max(enter * 0.9, leave)).toFixed(3);
    });
  };
}
