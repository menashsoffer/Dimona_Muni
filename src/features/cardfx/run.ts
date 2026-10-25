// Shared driver for the card scroll effects, one card at a time. Each card sits in a slot and
// sticks in the middle of the screen while its slot scrolls by; then it is pushed up and leaves
// while the next card rises in behind it. The driver works out how far each card is into its
// entrance and its exit, and hands both to a page-specific pose.
// So a lone card never reads as the end, the top of the real next card shows at the bottom of the
// screen, settled and opaque, and a pill there counts the cards ("02 / 08") and says to keep
// scrolling, until the last one. All positions are read from layout (slot rects and offsetTop),
// never from the card's own rect, which the pose's rotate, scale and translate would distort.
import { reducedMotion, startAtTop, view } from "../../core/scroll.ts";

export type Pose = (card: HTMLElement, index: number, enter: number, leave: number) => void;

const clamp = (v: number): number => Math.min(1, Math.max(0, v));
const easeOut = (t: number): number => 1 - (1 - t) ** 3;
const INTRO_MS = 750;
// How much of the next card shows at the bottom of the screen: about an eighth of the view,
// within these bounds. A card too tall to leave that much room keeps all of its own content
// and the peek shrinks instead.
const PEEK_MIN = 96;
const PEEK_MAX = 112;
// Space kept above a stuck card (under the nav) and between a card and the next one.
const GAP = 16;
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
  // Cards already on screen when the page opens are dealt in together on arrival.
  let onArrival: boolean[] | null = null;

  function frame(): void {
    const { top: vTop, bottom } = view();
    const span = bottom - vTop;
    const navH = nav?.offsetHeight ?? 0;
    const peek = Math.round(Math.min(PEEK_MAX, Math.max(PEEK_MIN, span * 0.13)));
    // The room a card is centred in: the view below the nav, less the strip where the next one peeks.
    const room = span - navH - peek;
    const heights = cards.map((c) => c.offsetHeight);
    const sticks = heights.map((h) => navH + Math.max(GAP, (room - h) / 2));
    // Each slot is just tall enough that, the moment its card settles, the next card's top edge sits
    // in the peek strip; a card too tall for that keeps its full height and a gap before the next.
    // The first slot is shorter if need be, so the next card already peeks on arrival, below the
    // page title; the last leaves room for its card to reach its place.
    const firstTop = (slots[0]?.getBoundingClientRect().top ?? 0) + scrollY;
    slots.forEach((s, i) => {
      const h = heights[i];
      const settle = Math.max(h + GAP, navH + room - sticks[i]);
      let want = i === slots.length - 1 ? Math.max(h, room) : settle;
      if (i === 0 && slots.length > 1) want = Math.min(want, Math.max(h + GAP, span - peek - firstTop));
      const px = `${Math.round(want)}px`;
      if (s.style.height !== px) s.style.height = px;
    });
    let cur = 0;
    const intro = clamp((performance.now() - start) / INTRO_MS);
    // Untransformed top of each card in the view; offsetTop includes the sticky offset.
    const tops = cards.map((c, i) => slots[i].getBoundingClientRect().top + c.offsetTop);
    onArrival ??= tops.map((t, i) => i === 0 || t < bottom);
    cards.forEach((c, i) => {
      const top = tops[i];
      c.style.top = `${Math.round(sticks[i])}px`;
      // The entrance plays out while the card's top crosses the peek strip, so by the time it rests
      // there it is whole: upright, in place and opaque.
      const enter = 1 - easeOut(onArrival![i] ? intro : clamp((bottom - top) / peek));
      const leave = clamp((vTop + sticks[i] - top) / (heights[i] * 0.8));
      if (top < vTop + sticks[i] + heights[i] / 2) cur = i;
      pose(c, i, enter, leave);
    });
    count.textContent = `${pad(cur + 1)} / ${pad(cards.length)}`;
    hint.classList.toggle("last", cur === cards.length - 1);
    if (intro < 1) requestAnimationFrame(frame);
  }
  // Card heights change as fonts and photos load and when the width changes.
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => requestAnimationFrame(frame));
    cards.forEach((c) => ro.observe(c));
  }
  return frame;
}
