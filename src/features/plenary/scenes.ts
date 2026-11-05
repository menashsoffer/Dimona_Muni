// The plenary's scenes: opening, one stop per group (sections revealed one at a time),
// "desk against desk" (one question, every group side by side), and the closing insights.
import { GROUPS, PEOPLE } from "../../content/people.ts";
import { esc } from "../../core/dom.ts";
import type { Answers } from "./answers.ts";

export type Scene =
  | { kind: "intro" }
  | { kind: "group"; i: number }
  | { kind: "compare" }
  | { kind: "finale" };

export const SCENES: Scene[] = [{ kind: "intro" }, ...GROUPS.map((_, i) => ({ kind: "group" as const, i })), { kind: "compare" }, { kind: "finale" }];

/** How many clicks reveal a scene fully. */
export const stepsOf = (s: Scene, answers: Map<number, Answers>): number =>
  s.kind === "group" ? (answers.has(s.i) ? 3 : 0) : s.kind === "compare" ? GROUPS.length : s.kind === "finale" ? GROUPS.length : 0;

function face(i: number, size = ""): string {
  const g = GROUPS[i];
  const photo = PEOPLE.find((p) => p.name.startsWith(g.lead))?.photo;
  return photo
    ? `<img class="pl-face ${size}" src="assets/people/${photo}.png" alt="">`
    : `<span class="pl-face ${size} pl-initial">${esc(g.lead.slice(0, 1))}</span>`;
}

const p = (label: string, text: string) => (text ? `<p>${label ? `<b>${esc(label)}</b> ` : ""}${esc(text)}</p>` : "");
const on = (k: number, step: number) => (k < step ? " on" : "");

function intro(): string {
  return `<div class="pl-cover"><span class="pl-kicker">12:30 · הצגה במליאה</span><h1>מה לקחנו מהשולחן?</h1>
    <p>פנייה אחת של תושב יוצאת לדרך, ועוברת בשלושה שולחנות.</p><p class="pl-hint">לחיצה או רווח כדי לצאת לדרך</p></div>`;
}

function group(i: number, a: Answers | undefined, step: number): string {
  const g = GROUPS[i];
  const head = `<header class="pl-head">${face(i)}<div><span class="pl-kicker">תחנה ${i + 1}</span><h1>${esc(g.lead)}</h1><span class="pl-role">${esc(g.role)}</span></div>
    ${a?.presenter ? `<span class="pl-presenter">מציג/ה: ${esc(a.presenter)}</span>` : ""}</header>`;
  if (!a) return `${head}<p class="pl-wait">התשובות של הקבוצה עוד לא הגיעו. המסך מתעדכן לבד.</p>`;
  const blocks = [
    `<h2>מי ישב איתנו</h2>${p("התפקיד:", a.role)}${p("מהשולחן:", a.project)}`,
    `<h2>מה למדנו</h2><ol>${a.learned.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>`,
    `<h2>מה אנחנו לוקחים</h2>${p("", a.take)}${p("שאלה פתוחה:", a.open)}`,
  ];
  return head + `<div class="pl-blocks">${blocks.map((b, k) => `<section class="pl-block${on(k, step)}">${b}</section>`).join("")}</div>`;
}

function compare(answers: Map<number, Answers>, step: number): string {
  return `<div class="pl-q"><span class="pl-kicker">שולחן מול שולחן</span><h1>מה הפתיע אתכם?</h1></div>
    <div class="pl-cols">${GROUPS.map((g, i) => `<section class="pl-col${on(i, step)}">${face(i, "sm")}<b>${esc(g.lead)}</b>
      <p>${esc(answers.get(i)?.surprise || "…")}</p></section>`).join("")}</div>`;
}

function finale(answers: Map<number, Answers>, step: number): string {
  return `<div class="pl-q"><span class="pl-kicker">הגענו</span><h1>מהפניה לתובנה</h1></div>
    <div class="pl-insights">${GROUPS.map((g, i) => {
      const a = answers.get(i);
      return `<section class="pl-ins${on(i, step)}">${a?.request ? `<span class="pl-req">${esc(a.request)}</span><span class="pl-arrow">↓</span>` : ""}
        <p>${esc(a?.insight || "…")}</p><small>${esc(g.lead)}</small></section>`;
    }).join("")}</div>`;
}

export function sceneHtml(s: Scene, answers: Map<number, Answers>, step: number): string {
  if (s.kind === "intro") return intro();
  if (s.kind === "group") return group(s.i, answers.get(s.i), step);
  if (s.kind === "compare") return compare(answers, step);
  return finale(answers, step);
}
