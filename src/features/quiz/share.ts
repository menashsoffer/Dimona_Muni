// Sharing a result: a ready-made challenge message with the score and a link to the quiz, and a
// picture of the result shown right on the results screen.
import { SITE_URL } from "../../content/event.ts";

export function shareText(score: number, total: number): string {
  return [
    `עניתי נכון על ${score} מתוך ${total} בחידון "מכירים את דימונה?" 🌅`,
    "לקראת יום העיון מהתלונה לתובנה, 15.11. מי עוקף אותי?",
    `${SITE_URL}quiz.html`,
  ].join("\n");
}

/** wa.me opens WhatsApp's own chat picker with the message filled in. */
export const whatsappHref = (text: string): string => `https://wa.me/?text=${encodeURIComponent(text)}`;

/** Can this browser share a picture through the share sheet (most phones)? */
export const canSharePicture = (file: File): boolean => !!navigator.canShare?.({ files: [file] });

/** Share the picture and the message through the share sheet. False if the browser refused. */
export async function sharePicture(file: File, text: string): Promise<boolean> {
  try { await navigator.share({ files: [file], text }); return true; }
  catch (e) { return (e as DOMException).name === "AbortError"; }
}
