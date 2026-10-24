// HTML for the three quiz screens. Templates only: no state, no events.
import type { Ending, Quiz, Source } from "../../content/types.ts";
import { esc } from "../../core/dom.ts";
import { type Game, isLast, rightOption, score } from "./game.ts";
import { shareText, whatsappHref } from "./share.ts";

const WA_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3Z"/></svg>`;

const KEYS = ["א", "ב", "ג", "ד"];

const links = (list: Source[]): string =>
  list.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");

function dots(g: Game): string {
  const cls = (k: number): string => k < g.index ? (g.results[k] ? "ok" : "no") : k === g.index ? "cur" : "";
  return `<div class="dots" aria-hidden="true">${g.questions.map((_, k) => `<i class="${cls(k)}"></i>`).join("")}</div>`;
}

export const introView = (quiz: Quiz): string => `
  <span class="eyebrow">חידון</span>
  <h2>${esc(quiz.title)}</h2>
  <p class="intro">${esc(quiz.intro)}</p>
  <div class="chips">
    <span class="chip">${quiz.questions.length} שאלות</span>
    <span class="chip">משוב מיד אחרי כל תשובה</span>
    <span class="chip">אפשר לבד או בקבוצות, מול המסך</span>
  </div>
  <div class="act"><button class="btn big" id="go" type="button">מתחילים</button></div>`;

export function questionView(g: Game): string {
  const q = g.questions[g.index];
  const opts = g.options[g.index].map((o, k) => `
    <button class="opt" type="button" id="opt${k}" data-k="${k}">
      <span class="k">${KEYS[k]}</span><span>${esc(o.text)}</span><span class="mark" aria-hidden="true"></span>
    </button>`).join("");
  return `
    <div class="top"><span class="eyebrow">שאלה ${g.index + 1} מתוך ${g.questions.length}</span><span class="score">${score(g)} תשובות נכונות</span></div>
    ${dots(g)}
    <h2 class="qtext" tabindex="-1" data-focus>${esc(q.q)}</h2>
    <div class="opts" role="group" aria-label="תשובות">${opts}</div>
    <div id="fbSlot"></div>`;
}

export function feedbackView(g: Game): string {
  const q = g.questions[g.index];
  const ok = g.results[g.index];
  return `
    <div class="fb ${ok ? "" : "no"}">
      <b class="h">${ok ? "נכון!" : `לא בדיוק. התשובה: ${esc(rightOption(g).text)}`}</b>
      <p>${esc(q.fact)}</p>
      <div class="src"><span>מקור:</span>${links(q.sources)}</div>
    </div>
    <div class="act next-row">
      <button class="btn big" id="next" type="button">${isLast(g) ? "לתוצאה" : "לשאלה הבאה"}</button>
      <span class="hint">אפשר גם Enter</span>
    </div>`;
}

export function resultView(g: Game, ending: Ending): string {
  const all = [...new Map(g.questions.flatMap((q) => q.sources).map((s) => [s.url, s])).values()];
  return `
    <span class="eyebrow">סיימתם!</span>
    ${dots(g)}
    <div class="result" tabindex="-1" data-focus>
      <div class="total">${score(g)}</div>
      <span class="of">תשובות נכונות מתוך ${g.questions.length}</span>
      <p class="endtxt">${esc(ending.text)}</p>
    </div>
    <div class="act">
      <a class="btn big wa" id="wa" href="${whatsappHref(shareText(score(g), g.questions.length))}" target="_blank" rel="noopener">${WA_ICON}שליחה בוואטסאפ</a>
      <button class="btn ghost wa-ghost" id="sharePic" type="button" hidden>שיתוף התמונה</button>
    </div>
    <figure class="share-card" id="shareCard" hidden>
      <img id="shareImg" alt="תמונת התוצאה לשיתוף: ${score(g)} מתוך ${g.questions.length} בחידון מכירים את דימונה">
      <figcaption>אפשר לשמור את התמונה ולצרף אותה להודעה: בטלפון בלחיצה ארוכה עליה, או <a id="savePic" download="dimona-quiz.png">בהורדה</a>.</figcaption>
    </figure>
    <div class="act"><button class="btn ghost" id="again" type="button">משחק חוזר</button><a class="btn ghost" href="index.html">חזרה לאתר</a></div>
    <details><summary>כל המקורות של החידון</summary><ul class="allsrc">${all.map((s) => `<li>${links([s])}</li>`).join("")}</ul></details>`;
}
