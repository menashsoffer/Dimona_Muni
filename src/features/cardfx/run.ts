// Shared driver for the card scroll effects, one card at a time. Each card sits in a slot as tall
// as the view and sticks in the middle of the screen while its slot scrolls by; then it is pushed
// up and leaves while the next card rises in behind it. The driver works out how far each card is
// into its entrance and its exit, and hands both to a page-specific pose.
// So a lone card never reads as the end: the next card peeks in at the bottom, and a pill there
// counts the cards ("02 / 08") and says to keep scrolling, until the last one.
import { reducedMotion, startAtTop, view } from "../../core/scroll.ts";

export type Pose = (card: HTMLElement, index: number, enter: number, leave: number) => void;

const clamp = (v: number): number => Math.min(1, Math.max(0, v));
const easeOut = (t: number): number => 1 - (1 - t) ** 3;
const INTRO_MS = 750;
// How much of the next card shows at the bottom of the screen.
const PEEK = 84;
const pad = (n: number): string => String(n).padStart(2, "0");

function mountHint(): HTMLElement {
  const hint = document.createElement("div");
  hint.className = "more-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.innerHTML = `<span class="n" dir="ltr"></span><span class="go">גללו לעוד</span>
    <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.append(hint);
  return hint;
}

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
  const hint = mountHint();
  const count = hint.querySelector<HTMLElement>(".n")!;
  const start = performance.now();
  let slotH = 0;

  function frame(): void {
    const { top: vTop, bottom } = view();
    const navH = nav?.offsetHeight ?? 0;
    // The room a card is centred in: the view below the nav, less the strip where the next one peeks.
    const room = bottom - vTop - navH - PEEK;
    // Each slot is just tall enough that, the moment its card settles in the centre, the next card's
    // top edge sits in the peek strip; the last slot leaves room for its card to reach the centre.
    if (Math.abs(room - slotH) > 2) {
      slotH = room;
      slots.forEach((s, i) => {
        const h = cards[i].offsetHeight;
        s.style.height = `${Math.round(i === slots.length - 1 ? room : Math.max(h, (room + h) / 2))}px`;
      });
    }
    let cur = 0;
    const zone = Math.min(240, room * 0.35);
    const intro = clamp((performance.now() - start) / INTRO_MS);
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      // Where this card sticks: centred in the room under the nav.
      const stick = navH + Math.max(12, (room - r.height) / 2);
      c.style.top = `${Math.round(stick)}px`;
      const enter = 1 - easeOut(Math.min(i === 0 ? intro : 1, clamp((bottom - r.top) / zone)));
      const leave = clamp((vTop + stick - r.top) / (r.height * 0.8));
      if (r.top < vTop + stick + r.height / 2) cur = i;
      pose(c, i, enter, leave);
    });
    count.textContent = `${pad(cur + 1)} / ${pad(cards.length)}`;
    hint.classList.toggle("last", cur === cards.length - 1);
    if (intro < 1) requestAnimationFrame(frame);
  }
  return frame;
}
