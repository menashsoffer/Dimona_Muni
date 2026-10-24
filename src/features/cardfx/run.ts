// Shared driver for the card scroll effects: works out how far each card is into its entrance
// (rising in from the bottom of the screen) and its exit (sliding up under the nav), and hands
// both to a page-specific pose. Cards already on screen when the page opens play their entrance
// once, staggered, so the effect starts at the top of the page and not only further down.
import { reducedMotion, startAtTop, view } from "../../core/scroll.ts";

export type Pose = (card: HTMLElement, index: number, enter: number, leave: number) => void;

const clamp = (v: number): number => Math.min(1, Math.max(0, v));
const easeOut = (t: number): number => 1 - (1 - t) ** 3;
const INTRO_MS = 750;
const STAGGER_MS = 120;

/** Returns the per-frame update to pass to scrollEffects, or undefined under reduced motion. */
export function driveCards(selector: string, cls: string, pose: Pose): (() => void) | undefined {
  startAtTop();
  if (reducedMotion()) return undefined;
  const cards = [...document.querySelectorAll<HTMLElement>(selector)];
  const nav = document.querySelector("nav");
  cards.forEach((c) => c.classList.add(cls));
  const start = performance.now();

  function frame(): void {
    const { top: vTop, bottom } = view();
    const top = Math.max(nav?.getBoundingClientRect().bottom ?? 0, vTop);
    const zone = Math.min(220, (bottom - vTop) * 0.3);
    const now = performance.now();
    let intro = false;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const t = clamp((now - start - i * STAGGER_MS) / INTRO_MS);
      if (t < 1) intro = true;
      const enter = 1 - easeOut(Math.min(t, clamp((bottom - r.top) / zone)));
      const leave = clamp((top - r.top) / (r.height * 0.8));
      pose(c, i, enter, leave);
    });
    if (intro) requestAnimationFrame(frame);
  }
  return frame;
}
