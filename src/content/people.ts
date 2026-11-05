// "האנשים של היום" cards and the three work groups.
// To add a photo: put it in public/assets/people/<slug>.png and set photo: "<slug>".
// slots: the start times of this person's slots in SCHEDULE (event.ts); the card shows their times
// and live status from those.
import type { Group, Person } from "./types.ts";

export const PEOPLE: Person[] = [
  { slots: ["10:15"], name: "יהודה בצלאל", role: "ממלא מקום ראש העיר", text: "פותח את יום העיון בברכה בשם עיריית דימונה.", photo: "yehuda" },
  { slots: ["10:30"], name: "ימית רווח", role: "מנהלת אגף שירות לתושב ויועצת ראש העיר לקידום מעמד האישה", text: "מנהלת האגף הראשונה, מאז הקמתו לפני כשלוש שנים. החזון שלה ושל ראש העיר: לקלוט את המוקד העירוני לתוך האגף ולשפר את השירות בעירייה כולה. מציגה עם צוות האגף איך נראה השירות מבפנים.", initial: "י" },
  { slots: ["10:00", "14:45"], name: "אסתר אלישייב דנון (אסתי)", role: "צוערת במתכונת הקודמת של תוכנית צוערים לשלטון המקומי, אגף שירות לתושב", text: "פותחת את שולחן העבודה שלה: איך היא משפיעה על פעילות אגף השירות ומקדמת אותה. פותחת את היום, ומובילה את הסיכום והשיח הפתוח בסוף היום.", photo: "esther" },
  { slots: ["11:45"], name: "מרים כהן", role: "מנהלת מערכות מידע (מנמר\"ית), עיריית דימונה", text: "הצצה לשולחן העבודה של המנמר\"ית, מעבר לפעולות השוטפות: איך המחשוב תורם לשירות לתושב, משפר אותו ומייעל אותו.", initial: "מ" },
  { slots: ["11:45"], name: "נחמה אוחנה", role: "מנהלת אגף הרווחה (האגף לשירותים חברתיים)", text: "מניסיונה העשיר ומשולחן העבודה שלה: השאיפה ליצור \"וואן סטופ שופ\", כתובת אחת לכל שירותי הרווחה העירוניים שמפוזרים בעיר, והפן הרגיש, איך שירות מיטבי משפר את המענה המקצועי לתושבים שפונים לאגף.", photo: "nechama" },
  { slots: ["11:45"], name: "אריק", role: "מהנדס העיר, עיריית דימונה", text: "מוביל את אחת משלוש הקבוצות. פרטים נוספים יעודכנו.", initial: "א" },
  { slots: ["13:30"], name: "מוקד עירוני 106", role: "ביקור ושיח עם עובדי המוקד", text: "המקום שבו כל פנייה של תושב מתחילה את הדרך.", initial: "106" },
  { slots: ["13:45"], name: "אבי בוחבוט", role: "מנהל אגף קהילה, רשת המרכזים הקהילתיים בדימונה", text: "דמות מרכזית ומשמעותית בנוף הדימונאי. מביא את הזווית של איך קהילה ושירות מתחברים זה לזה, ומקרה בוחן: נפילת הטיל האיראני בדימונה, והעשייה המדהימה של הקהילה ושל מתנדבים רבים בשטח.", photo: "avi" },
];

// project: what the group works on with its lead (final details arrive 26.10.26).
// Each group's link opens the group form (Google Forms) with the group already chosen.
// The choice text must stay exactly as it is in the form.
const FORM = "https://docs.google.com/forms/d/e/1FAIpQLSfDGnOJwV0kywjjZ6R3FnGapl1g4In5vcNGIRNs5Av94u8nzg/viewform?usp=pp_url&entry.1624475687=";
const form = (choice: string) => FORM + encodeURIComponent(choice);

export const GROUPS: Group[] = [
  { lead: "מרים כהן", role: "מנהלת מערכות מידע (מנמר\"ית)", project: "מה קורה מאחורי המסך: איך מערכות המידע של העירייה תורמות לשירות לתושב, משפרות אותו ומייעלות אותו.", form: form("מרים כהן, מנמר\"ית העירייה") },
  { lead: "נחמה אוחנה", role: "מנהלת אגף הרווחה", project: "שירות במקום הרגיש: השאיפה ליצור \"וואן סטופ שופ\", כתובת אחת לכל שירותי הרווחה העירוניים, ואיך שירות מיטבי משפר את המענה לתושבים שפונים.", form: form("נחמה אוחנה, מנהלת אגף הרווחה") },
  { lead: "אריק", role: "מהנדס העיר", form: form("אריק, מהנדס העיר") },
];
