// What the "now" panel should say at a given moment. Pure, so it is easy to reason about.
import { SCHEDULE } from "../../content/event.ts";
import { toMinutes } from "../../core/time.ts";

const START = toMinutes(SCHEDULE[0].from);
const END = toMinutes(SCHEDULE[SCHEDULE.length - 1].to);
const DATE_LINE = "יום ראשון, 15.11.2026";

export interface NowState {
  label: string;
  title: string;
  time: string;
  next?: string;
  progress: number; // 0–1 through the current slot
  sun: number; // 0–1 through the day
  current: number; // index of the current slot, -1 if none
  done: number; // slots before this index are over
}

const slotLine = (i: number): string => `${SCHEDULE[i].from} · ${SCHEDULE[i].title}`;

/** @param daysLeft days until the event (0 = today); @param min minutes since midnight */
export function nowState(daysLeft: number, min: number): NowState {
  if (daysLeft > 0) {
    const title = daysLeft === 1 ? "נפגשים מחר ב-9:00 בבאר שבע צפון"
      : daysLeft === 2 ? "עוד יומיים ליום העיון"
      : `עוד ${daysLeft} ימים ליום העיון`;
    return { label: daysLeft === 1 ? "מחר" : "בקרוב", title, time: DATE_LINE, next: slotLine(0), progress: 0, sun: 0, current: -1, done: 0 };
  }
  if (daysLeft < 0 || min >= END) {
    return { label: "הסתיים", title: "תודה שהייתם איתנו", time: "מהתלונה לתובנה · דימונה, 15.11.2026", progress: 1, sun: 1, current: -1, done: SCHEDULE.length };
  }
  if (min < START) {
    return { label: "הבוקר", title: "ההסעה יוצאת ב-9:00 מבאר שבע צפון", time: "", progress: 0, sun: 0, current: -1, done: 0 };
  }
  const i = SCHEDULE.findIndex((r) => min >= toMinutes(r.from) && min < toMinutes(r.to));
  const r = SCHEDULE[i];
  const from = toMinutes(r.from), to = toMinutes(r.to);
  return {
    label: "עכשיו",
    title: r.title,
    time: `${r.from}–${r.to}${r.note ? ` · ${r.note}` : ""}`,
    next: i + 1 < SCHEDULE.length ? slotLine(i + 1) : undefined,
    progress: (min - from) / (to - from),
    sun: (min - START) / (END - START),
    current: i,
    done: i,
  };
}
