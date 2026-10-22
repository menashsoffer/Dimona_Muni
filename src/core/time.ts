// Clock helpers. The day runs on Israel time whatever the viewer's time zone.

export interface IsraelNow {
  y: number;
  mo: number;
  d: number;
  min: number; // minutes since midnight
}

/** "HH:MM" → minutes since midnight. */
export const toMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function israelNow(date = new Date()): IsraelNow {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jerusalem",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, min: (+p.hour % 24) * 60 + +p.minute };
}

/** Whole days from `now` until the given date (negative once it has passed). */
export function daysUntil(day: { y: number; m: number; d: number }, now: IsraelNow): number {
  return Math.round((Date.UTC(day.y, day.m - 1, day.d) - Date.UTC(now.y, now.mo - 1, now.d)) / 864e5);
}
