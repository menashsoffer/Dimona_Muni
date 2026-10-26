// The thread beside the people cards: a line through the day with a bead per person and a sun.
// The sun follows the cards: as you flip through them it moves to the time of the card in view,
// and dragging it (or tapping a bead) flips the cards to that time. Each card's status counts down
// to the real date and hour of that person's slot. On the day itself a green mark shows the
// actual time, and tapping the clock flips to whoever is on stage.
import { DAY, SCHEDULE } from "../../content/event.ts";
import { PEOPLE } from "../../content/people.ts";
import { scrollBehavior, view } from "../../core/scroll.ts";
import { daysUntil, israelNow, toMinutes } from "../../core/time.ts";
import { spans, status } from "./status.ts";

const START = toMinutes(SCHEDULE[0].from);
const END = toMinutes(SCHEDULE[SCHEDULE.length - 1].to);
const STEP = 5;
const hhmm = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// Beads sit evenly down the line, in card order. Time maps onto the line piecewise through them,
// so the sun reaches each bead exactly at that person's start. People who start together share
// the first one's point.
const firsts = PEOPLE.map((p) => spans(p)[0].from);
const beadY = PEOPLE.map((_, i) => (i + 1) / (PEOPLE.length + 1));
const anchors: [number, number][] = [[START, 0]];
firsts.forEach((t, i) => { if (t > anchors[anchors.length - 1][0]) anchors.push([t, beadY[i]]); });
anchors.push([END, 1]);

function lerp(v: number, from: 0 | 1): number {
  const to = 1 - from;
  for (let k = 1; k < anchors.length; k++) {
    const a = anchors[k - 1], b = anchors[k];
    if (v <= b[from]) return a[to] + ((v - a[from]) / (b[from] - a[from])) * (b[to] - a[to]);
  }
  return anchors[anchors.length - 1][to];
}
const timeToY = (t: number): number => lerp(Math.min(END, Math.max(START, t)), 0);
const yToTime = (y: number): number => Math.round(lerp(Math.min(1, Math.max(0, y)), 1) / STEP) * STEP;
/** The card for a time: the last person who has started by then (the first of a shared start). */
const cardAt = (t: number): number => {
  let i = 0;
  firsts.forEach((f, k) => { if (f <= t && f > firsts[i]) i = k; });
  return t < firsts[0] ? 0 : i;
};

export interface Thread {
  /** Call on every scroll frame: moves the sun to the card in view. */
  sync(): void;
}

export function mountThread(thread: HTMLElement, cards: HTMLElement[]): Thread {
  thread.innerHTML = `
    <button type="button" class="clock" title="לכרטיס של מי שעל הבמה עכשיו"></button>
    <div class="track" role="slider" tabindex="0" aria-label="שעה ביום העיון"
      aria-valuemin="${START}" aria-valuemax="${END}">
      <span class="fill"></span>
      <span class="nowmark" hidden></span>
      ${PEOPLE.map((p, i) => `<span class="bead" style="--y:${beadY[i]}" data-i="${i}" title="${p.slots[0]} · ${p.name}"></span>`).join("")}
      <span class="sun"></span>
    </div>`;
  const clock = thread.querySelector<HTMLButtonElement>(".clock")!;
  const track = thread.querySelector<HTMLElement>(".track")!;
  const nowmark = thread.querySelector<HTMLElement>(".nowmark")!;
  const beads = [...thread.querySelectorAll<HTMLElement>(".bead")];
  const chips = cards.map((c) => c.querySelector<HTMLElement>(".live")!);

  let time = START;
  // While the visitor drags, or the page scrolls itself to a card, scrolling must not move the sun.
  let holdUntil = 0;
  const hold = (ms: number): void => { holdUntil = performance.now() + ms; };

  function showSun(): void {
    thread.style.setProperty("--sun", timeToY(time).toFixed(4));
    clock.textContent = hhmm(time);
    track.setAttribute("aria-valuenow", String(time));
    track.setAttribute("aria-valuetext", hhmm(time));
    beads.forEach((b, i) => b.classList.toggle("lit", firsts[i] <= time));
  }

  // Statuses and the green "now" mark come from the real clock, never from the sun.
  function showLive(): void {
    const n = israelNow();
    const days = daysUntil(DAY, n);
    const today = days === 0 && n.min >= START && n.min < END;
    nowmark.hidden = !today;
    if (today) nowmark.style.setProperty("--y", timeToY(n.min).toFixed(4));
    PEOPLE.forEach((p, i) => {
      const s = status(p, days, n.min);
      cards[i].classList.toggle("on-stage", s.stage === "now");
      chips[i].textContent = s.text;
      chips[i].dataset.stage = s.stage;
      beads[i].classList.toggle("cur", s.stage === "now");
    });
    clock.disabled = !today;
  }

  function scrollToCard(i: number): void {
    const box = cards[i].parentElement?.classList.contains("slot") ? cards[i].parentElement! : cards[i];
    const navH = document.querySelector("nav")?.offsetHeight ?? 0;
    hold(900);
    scrollTo({ top: box.getBoundingClientRect().top + scrollY - navH - 16, behavior: scrollBehavior() });
  }

  function setTime(t: number): void {
    time = Math.min(END, Math.max(START, t));
    showSun();
  }

  // The card in view is the one whose middle is nearest the middle of the screen.
  function sync(): void {
    if (performance.now() < holdUntil) return;
    const { top, bottom } = view();
    const mid = (top + bottom) / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    if (firsts[best] !== time) setTime(firsts[best]);
  }

  const yAt = (e: PointerEvent): number => {
    const r = track.getBoundingClientRect();
    return (e.clientY - r.top) / r.height;
  };
  let shown = -1;
  const follow = (): void => {
    const i = cardAt(time);
    if (i !== shown) { shown = i; scrollToCard(i); }
  };
  track.addEventListener("pointerdown", (e) => {
    const bead = (e.target as HTMLElement).closest<HTMLElement>(".bead");
    if (bead) {
      const i = Number(bead.dataset.i);
      setTime(firsts[i]);
      scrollToCard(i);
      return;
    }
    track.setPointerCapture(e.pointerId);
    thread.classList.add("dragging");
    shown = -1;
    setTime(yToTime(yAt(e)));
    follow();
  });
  track.addEventListener("pointermove", (e) => {
    if (!track.hasPointerCapture(e.pointerId)) return;
    setTime(yToTime(yAt(e)));
    follow();
  });
  const release = (e: PointerEvent): void => {
    if (!track.hasPointerCapture(e.pointerId)) return;
    track.releasePointerCapture(e.pointerId);
    thread.classList.remove("dragging");
  };
  track.addEventListener("pointerup", release);
  track.addEventListener("pointercancel", release);
  // Time runs down the line, so Down (and Left, the reading direction) is later.
  track.addEventListener("keydown", (e) => {
    const keys: Record<string, number> = { ArrowDown: STEP, ArrowLeft: STEP, ArrowUp: -STEP, ArrowRight: -STEP, PageDown: 30, PageUp: -30 };
    if (e.key in keys) setTime(time + keys[e.key]);
    else if (e.key === "Home") setTime(START);
    else if (e.key === "End") setTime(END);
    else return;
    e.preventDefault();
    shown = -1;
    follow();
  });
  clock.addEventListener("click", () => {
    const i = PEOPLE.findIndex((p) => status(p, 0, israelNow().min).stage === "now");
    const next = PEOPLE.findIndex((p) => status(p, 0, israelNow().min).stage === "next");
    const k = i >= 0 ? i : next >= 0 ? next : PEOPLE.length - 1;
    setTime(firsts[k]);
    scrollToCard(k);
  });

  showSun();
  showLive();
  setInterval(showLive, 30_000);
  return { sync };
}
