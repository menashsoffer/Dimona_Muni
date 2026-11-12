// The day itself: date and schedule. Times and wording as Menash set them (22.10.26, updated from Esti's schedule 5.11.26, afternoon from the invitation 10.11.26).
import type { Slot } from "./types.ts";

export const DAY = { y: 2026, m: 11, d: 15 };
/** The public site (GitHub Pages), for links shared outside it. */
export const SITE_URL = "https://menashsoffer.github.io/Dimona_Muni/";

export const SCHEDULE: Slot[] = [
  { from: "09:00", to: "09:30", title: "יציאת ההסעה מתחנת רכבת באר שבע צפון", brk: true },
  { from: "09:30", to: "10:00", title: "התכנסות וארוחת בוקר", note: "מתוקה וקפה חם", brk: true },
  { from: "10:00", to: "10:15", title: "פתיחה קצרה", note: "עם אסתר אלישייב דנון (אסתי)" },
  { from: "10:15", to: "10:30", title: "ברכה: יהודה בצלאל, ממלא מקום ראש העיר" },
  { from: "10:30", to: "11:30", title: "ימית רווח, מנהלת האגף, וצוות אגף השירות" },
  { from: "11:30", to: "11:45", title: "הפסקה", brk: true },
  { from: "11:45", to: "12:30", title: "פרויקטים משולחנם של בעלי תפקידים", note: "עבודה בקבוצות קטנות" },
  { from: "12:30", to: "12:45", title: "הצגת הקבוצות במליאה" },
  { from: "12:45", to: "13:30", title: "ארוחת צהריים", brk: true },
  { from: "13:30", to: "13:40", title: "סיור והסבר במוקד העירוני 106", note: "שיח עם עובדי המוקד" },
  { from: "13:40", to: "14:25", title: "אבי בוחבוט: כשהשירות פוגש את הקהילה, הגשר המחבר", note: "מקרה בוחן: נפילת טיל בדימונה" },
  { from: "14:25", to: "15:10", title: "סיכום יום וצידה לדרך מצוערת בוגרת", note: "עם אסתר אלישייב דנון (אסתי)" },
  { from: "15:10", to: "15:30", title: "סיכום יום", note: "עם מובילי יום העיון" },
];
