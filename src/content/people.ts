// "האנשים של היום" cards and the three work groups.
// To add a photo: put it in public/assets/people/<slug>.png and set photo: "<slug>".
import type { Group, Person } from "./types.ts";

export const PEOPLE: Person[] = [
  { when: "10:00", name: "ברכת בכיר מהעירייה", role: "השם יעודכן", initial: "✦" },
  { when: "10:30", name: "ימית רווח", role: "מנהלת אגף השירות, עיריית דימונה", text: "מציגה עם צוות האגף איך נראה השירות מבפנים.", initial: "י" },
  { when: "10:30 · 14:45", name: "אסתר אלישייב דנון (אסתי)", role: "בוגרת התוכנית, צוערת באגף שירות לתושב", text: "מצטרפת לימית בבוקר, ומובילה את הסיכום והשיח הפתוח בסוף היום.", photo: "esther" },
  { when: "11:45", name: "מרים כהן", role: "מנמר\"ית העירייה", text: "מובילה קבוצה בעבודה על פרויקט שירות.", initial: "מ" },
  { when: "11:45", name: "נחמה אוחנה", role: "מנהלת אגף הרווחה", text: "מובילה קבוצה בעבודה על פרויקט שירות.", photo: "nechama" },
  { when: "11:45", name: "נועם נגאוקר", role: "מנהל הדיגיטל העירוני", text: "מוביל קבוצה בעבודה על פרויקט שירות.", photo: "noam" },
  { when: "13:30", name: "מוקד עירוני 106", role: "הסבר וסיור קצר במוקד", text: "המקום שבו כל פנייה של תושב מתחילה את הדרך.", initial: "106" },
  { when: "13:45", name: "אבי בוחבוט", role: "חיבור בין קהילה לבין שירות", text: "מקרה בוחן: נפילת טיל בדימונה.", initial: "א" },
];

// project: short description of the group's project (pending, arrives 26.10.26).
export const GROUPS: Group[] = [
  { lead: "מרים כהן", role: "מנמר\"ית העירייה" },
  { lead: "נחמה אוחנה", role: "מנהלת אגף הרווחה" },
  { lead: "נועם נגאוקר", role: "מנהל הדיגיטל העירוני" },
];
