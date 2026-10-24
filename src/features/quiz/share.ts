// Sharing a result to WhatsApp: a ready-made challenge message with the score and a link to the
// quiz. wa.me opens WhatsApp's own chat picker, so the cadets' group is one tap away.
import { SITE_URL } from "../../content/event.ts";

export function shareText(score: number, total: number): string {
  return [
    `עניתי נכון על ${score} מתוך ${total} בחידון "מכירים את דימונה?" 🌅`,
    "לקראת יום העיון מהתלונה לתובנה, 15.11. מי עוקף אותי?",
    `${SITE_URL}quiz.html`,
  ].join("\n");
}

export const whatsappHref = (text: string): string => `https://wa.me/?text=${encodeURIComponent(text)}`;
