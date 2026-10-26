// The thread beside the people cards: a line through the day, one bead per person, and a sun you
// drag along it to move through time. Every card then says whether that person is on stage, how
// long until they are, or that they are done. On the day itself the sun follows the clock until
// someone moves it; tapping the clock sends it back to now.
import { DAY, SCHEDULE } from "../../content/event.ts";
import { PEOPLE } from "../../content/people.ts";
import { daysUntil, israelNow, toMinutes } from "../../core/time.ts";
import { scrollBehavior } from "../../core/scroll.ts";
import { spans, status } from "./status.ts";

const START = toMinutes(SCHEDULE[0].from);
const END = toMinutes(SCHEDULE[SCHEDULE.length - 1].to);
const STEP = 5;
const hhmm = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// Beads sit evenly down the line, in card order. Time maps onto the line piecewise through them,
// so the sun reaches each bead exactly when that person starts. People who start together share
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

export function mountThread(thread: HTMLElement, cards: HTMLElement[]): void {
  thread.innerHTML = `
    <button type="button" class="clock" title="חזרה לשעה עכשיו"></button>
    <div class="track" role="slider" tabindex="0" aria-label="שעה ביום העיון"
      aria-valuemin="${START}" aria-valuemax="${END}">
      <span class="fill"></span>
      ${PEOPLE.map((p, i) => `<span class="bead" style="--y:${beadY[i]}" data-i="${i}" title="${p.slots[0]} · ${p.name}"></span>`).join("")}
      <span class="sun"></span>
    </div>`;
  const clock = thread.querySelector<HTMLButtonElement>(".clock")!;
  const track = thread.querySelector<HTMLElement>(".track")!;
  const beads = [...thread.querySelectorAll<HTMLElement>(".bead")];
  const chips = cards.map((c) => c.querySelector<HTMLElement>(".live")!);

  const liveNow = (): number | null => {
    const n = israelNow();
    return daysUntil(DAY, n) === 0 && n.min >= START && n.min < END ? n.min : null;
  };
  let follow = liveNow() !== null;
  let time = liveNow() ?? START;

  function show(): void {
    const y = timeToY(time);
    thread.style.setProperty("--sun", y.toFixed(4));
    thread.classList.toggle("live", follow);
    clock.textContent = hhmm(time);
    track.setAttribute("aria-valuenow", String(time));
    track.setAttribute("aria-valuetext", hhmm(time));
    PEOPLE.forEach((p, i) => {
      const s = status(p, time);
      cards[i].classList.toggle("on-stage", s.stage === "now");
      cards[i].classList.toggle("over", s.stage === "done");
      chips[i].textContent = s.text;
      chips[i].dataset.stage = s.stage;
      beads[i].classList.toggle("lit", firsts[i] <= time);
      beads[i].classList.toggle("cur", s.stage === "now");
    });
  }

  function setTime(t: number, fromUser = true): void {
    if (fromUser) follow = false;
    time = Math.min(END, Math.max(START, t));
    show();
  }

  // The card worth seeing at this time: whoever is on stage, else whoever is next, else the last.
  function scrollToFocus(): void {
    let i = PEOPLE.findIndex((p) => status(p, time).stage === "now");
    if (i < 0) i = PEOPLE.findIndex((p) => status(p, time).stage === "next");
    if (i < 0) i = PEOPLE.length - 1;
    scrollToCard(i);
  }
  function scrollToCard(i: number): void {
    const box = cards[i].parentElement?.classList.contains("slot") ? cards[i].parentElement! : cards[i];
    const navH = document.querySelector("nav")?.offsetHeight ?? 0;
    scrollTo({ top: box.getBoundingClientRect().top + scrollY - navH - 16, behavior: scrollBehavior() });
  }

  const yAt = (e: PointerEvent): number => {
    const r = track.getBoundingClientRect();
    return (e.clientY - r.top) / r.height;
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
    setTime(yToTime(yAt(e)));
  });
  track.addEventListener("pointermove", (e) => {
    if (track.hasPointerCapture(e.pointerId)) setTime(yToTime(yAt(e)));
  });
  const release = (e: PointerEvent): void => {
    if (!track.hasPointerCapture(e.pointerId)) return;
    track.releasePointerCapture(e.pointerId);
    thread.classList.remove("dragging");
    scrollToFocus();
  };
  track.addEventListener("pointerup", release);
  track.addEventListener("pointercancel", release);
  // Time runs down the line, so Down moves later.
  track.addEventListener("keydown", (e) => {
    const keys: Record<string, number> = { ArrowDown: STEP, ArrowRight: -STEP, ArrowUp: -STEP, ArrowLeft: STEP, PageDown: 30, PageUp: -30 };
    if (e.key in keys) setTime(time + keys[e.key]);
    else if (e.key === "Home") setTime(START);
    else if (e.key === "End") setTime(END);
    else if (e.key === "Enter") scrollToFocus();
    else return;
    e.preventDefault();
  });
  clock.addEventListener("click", () => {
    const now = liveNow();
    follow = now !== null;
    setTime(now ?? START, false);
    scrollToFocus();
  });

  show();
  setInterval(() => {
    const now = liveNow();
    if (follow && now !== null) setTime(now, false);
  }, 30_000);
}
