// Shared driver for the card scroll effects, one card at a time. Each card sits in a slot as tall
// as the view and sticks in the middle of the screen while its slot scrolls by; then it is pushed
// up and leaves while the next card rises in behind it. The driver works out how far each card is
// into its entrance and its exit, and hands both to a page-specific pose.
import { reducedMotion, startAtTop, view } from "../../core/scroll.ts";

export type Pose = (card: HTMLElement, index: number, enter: number, leave: number) => void;

const clamp = (v: number): number => Math.min(1, Math.max(0, v));
const easeOut = (t: number): number => 1 - (1 - t) ** 3;
const INTRO_MS = 750;

/** Returns the per-frame update to pass to scrollEffects, or undefined under reduced motion. */
export function driveCards(selector: string, cls: string, pose: Pose): (() => void) | undefined {
  startAtTop();
  if (reducedMotion()) return undefined;
  const cards = [...document.querySelectorAll<HTMLElement>(selector)];
  const nav = document.querySelector("nav");
  const slots = cards.map((c) => {
    c.parentElement?.classList.add("solo");
    const slot = document.createElement("div");
    slot.className = "slot";
    c.replaceWith(slot);
    slot.append(c);
    c.classList.add(cls);
    return slot;
  });
  const start = performance.now();
  let slotH = 0;

  function frame(): void {
    const { top: vTop, bottom } = view();
    const navH = nav?.offsetHeight ?? 0;
    const room = bottom - vTop - navH;
    // Slots as tall as the view below the nav; only touch layout when that changes.
    if (Math.abs(room - slotH) > 2) {
      slotH = room;
      slots.forEach((s) => (s.style.minHeight = `${Math.round(room)}px`));
    }
    const zone = Math.min(240, room * 0.35);
    const intro = clamp((performance.now() - start) / INTRO_MS);
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      // Where this card sticks: centred in the room under the nav.
      const stick = navH + Math.max(12, (room - r.height) / 2);
      c.style.top = `${Math.round(stick)}px`;
      const enter = 1 - easeOut(Math.min(i === 0 ? intro : 1, clamp((bottom - r.top) / zone)));
      const leave = clamp((vTop + stick - r.top) / (r.height * 0.8));
      pose(c, i, enter, leave);
    });
    if (intro < 1) requestAnimationFrame(frame);
  }
  return frame;
}
