// Where a person stands right now: on stage, coming up (with a countdown), or done. Pure.
import { SCHEDULE } from "../../content/event.ts";
import type { Person } from "../../content/types.ts";
import { toMinutes } from "../../core/time.ts";

export interface Span {
  from: number;
  to: number;
}

/** The person's slots as minute ranges, looked up in SCHEDULE by start time. */
export function spans(p: Person): Span[] {
  return p.slots.map((t) => {
    const slot = SCHEDULE.find((r) => r.from === t);
    if (!slot) throw new Error(`No schedule slot starts at ${t} (${p.name})`);
    return { from: toMinutes(slot.from), to: toMinutes(slot.to) };
  });
}

/** "10:30–11:30 · 14:45–15:30" for the card, as HTML: each range kept on one line. */
export const whenLine = (p: Person): string =>
  p.slots.map((t) => {
    const slot = SCHEDULE.find((r) => r.from === t)!;
    return `<span class="rng">${slot.from}–${slot.to}</span>`;
  }).join(" · ");

export type Stage = "now" | "next" | "done";

export interface Status {
  stage: Stage;
  text: string;
}

function inTime(min: number): string {
  if (min < 60) return `בעוד ${min} דק׳`;
  const h = Math.floor(min / 60), m = min % 60;
  const hours = h === 1 ? "שעה" : h === 2 ? "שעתיים" : `${h} שעות`;
  return `בעוד ${hours}${m ? ` ו-${m} דק׳` : ""}`;
}

/** Where the person stands at the real date and time: counts down to the day itself, then
 *  to their slot on the day. @param daysLeft days until the event (0 = today) */
export function status(p: Person, daysLeft: number, min: number): Status {
  const s = spans(p);
  const at = SCHEDULE.find((r) => r.from === p.slots[0])!.from;
  if (daysLeft > 1) return { stage: "next", text: `15.11 ב-${at} · בעוד ${daysLeft === 2 ? "יומיים" : `${daysLeft} ימים`}` };
  if (daysLeft === 1) return { stage: "next", text: `מחר ב-${at}` };
  if (daysLeft < 0) return { stage: "done", text: "✓ הסתיים" };
  if (s.some((r) => min >= r.from && min < r.to)) return { stage: "now", text: "עכשיו על הבמה" };
  const next = s.find((r) => r.from > min);
  if (next) return { stage: "next", text: inTime(next.from - min) };
  return { stage: "done", text: "✓ הסתיים" };
}
