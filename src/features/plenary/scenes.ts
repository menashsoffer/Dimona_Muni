// The plenary's scenes: opening, one stop per group (sections revealed one at a time),
// "desk against desk" (one question, every group side by side), and the closing insights.
import { GROUPS, PEOPLE } from "../../content/people.ts";
import { PREP } from "../../content/prep.ts";
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
  const photo = PEOPLE.find((p) => g.lead.startsWith(p.name))?.photo;
  return photo
    ? `<img class="pl-face ${size}" src="assets/people/${photo}.png" alt="">`
    : `<span class="pl-face ${size} pl-initial">${esc(g.lead.slice(0, 1))}</span>`;
}

const p = (label: string, text: string) => (text ? `<p>${label ? `<b>${esc(label)}</b> ` : ""}${esc(text)}</p>` : "");
/** The group members as small name chips (the presenter already has their own label). */
const team = (members: string, presenter: string) => {
  const names = members.split(",").map((n) => n.trim()).filter((n) => n && n !== presenter);
  return names.length ? `<span class="pl-members">${names.map((n) => `<span>${esc(n)}</span>`).join("")}</span>` : "";
};
const on = (k: number, step: number) => (k < step ? " on" : "");

function intro(): string {
  return `<div class="pl-cover"><span class="pl-kicker">12:30 · הצגה במליאה</span><h1>מה לקחנו מהשולחן?</h1>
    <p>שלושה שולחנות, שלוש זוויות שבהן העירייה משפיעה על איכות החיים של התושב.</p><p class="pl-hint">לחיצה או רווח כדי לצאת לדרך</p></div>`;
}


// Decorative role illustrations, kept separate from the answer text.
const roleArt: Record<string, string> = {
  tech: `<svg class="pl-art pl-art-tech" viewBox="0 0 240 74" aria-hidden="true" focusable="false">
    <g class="pl-art-lines"><path d="M4 8h30l13 13h23l10 10h19 M4 25h24l12 12h34 M4 59h34l12-12h30 M236 8h-30l-13 13h-23l-10 10h-19 M236 59h-34l-12-12h-30"/><rect x="96" y="12" width="48" height="34" rx="3"/><path d="M89 52h62l-5 5H94z M116 23l-5 5 5 5 M124 23l5 5-5 5"/></g>
    <g class="pl-art-nodes"><circle cx="70" cy="21" r="3"/><circle cx="74" cy="37" r="3"/><circle cx="80" cy="47" r="3"/><circle cx="170" cy="21" r="3"/><circle cx="160" cy="47" r="3"/></g>
  </svg>`,
  build: `<svg class="pl-art pl-art-build" viewBox="0 0 240 74" aria-hidden="true" focusable="false">
    <g class="pl-art-grid"><path d="M8 18h224 M8 36h224 M8 54h224 M40 4v64 M80 4v64 M120 4v64 M160 4v64 M200 4v64"/></g>
    <g class="pl-art-lines"><path d="M59 60h122 M76 60V27l43-20 45 20v33 M119 7v53 M88 60V34l23-10v36 M130 60V24l22 10v26 M88 42l23-8 M130 34l22 8 M34 64h25 M34 60v8 M181 64h25 M206 60v8 M66 14v42 M62 14h8 M62 56h8"/></g>
  </svg>`,
  care: `<svg class="pl-art pl-art-care" viewBox="0 0 240 74" aria-hidden="true" focusable="false">
    <g class="pl-art-lines"><circle cx="120" cy="20" r="9"/><circle cx="91" cy="27" r="7"/><circle cx="149" cy="27" r="7"/><path d="M104 54c0-11 7-18 16-18s16 7 16 18 M76 54c0-9 6-15 15-15 4 0 7 1 10 4 M164 54c0-9-6-15-15-15-4 0-7 1-10 4 M55 55c14 9 32 13 65 13s51-4 65-13 M48 22l-8-5 M192 22l8-5"/></g>
  </svg>`
};

function group(i: number, a: Answers | undefined, step: number): string {
  const g = GROUPS[i];
  const head = `<header class="pl-head">${face(i)}<div><span class="pl-kicker">שולחן ${i + 1}${PREP[i] ? ` · ${esc(PREP[i].angle)}` : ""}</span><h1>${esc(g.lead)}</h1><span class="pl-role">${esc(g.role)}</span></div>
    ${a?.presenter || a?.members ? `<div class="pl-team">${a.presenter ? `<span class="pl-presenter">מציג/ה: ${esc(a.presenter)}</span>` : ""}${team(a.members, a.presenter)}</div>` : ""}</header>`;
  if (!a) return `${head}<p class="pl-wait">התשובות של השולחן עוד לא הגיעו. המסך מתעדכן לבד.</p>`;
  const blocks = [
    `<h2>${esc(PREP[i]?.tagline ?? "מי ישב איתנו")}</h2>${p("השאלה שלנו:", PREP[i]?.question ?? g.project ?? "")}`,
    `<h2>מה למדנו</h2><ol>${a.learned.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>`,
    `<h2>מה אנחנו לוקחים</h2>${p("", a.take)}`,
  ];
  const theme = ["tech", "care", "build"][i] || "care";
  return head + `<div class="pl-blocks pl-theme-${theme}">${blocks.map((b, k) => `<section class="pl-block pl-focus-card${k < step ? " is-revealed" : " is-pending"}${step > 0 && k === step - 1 ? " is-focused" : ""}"><div class="pl-card-content">${roleArt[theme]}${b}</div></section>`).join("")}</div>`;
}

function compare(answers: Map<number, Answers>, step: number): string {
  return `<div class="pl-q"><span class="pl-kicker">שולחן מול שולחן</span><h1>מה הפתיע אתכם?</h1></div>
    <div class="pl-cols">${GROUPS.map((g, i) => `<section class="pl-col${on(i, step)}">${face(i, "sm")}<b>${esc(g.lead)}</b>
      <p>${esc(answers.get(i)?.surprise || "…")}</p></section>`).join("")}</div>`;
}

function finale(answers: Map<number, Answers>, step: number): string {
  return `<div class="pl-q"><span class="pl-kicker">שלושה שולחנות, שלוש זוויות</span><h1>התובנות שלנו</h1></div>
    <div class="pl-insights">${GROUPS.map((g, i) => {
      const a = answers.get(i);
      return `<section class="pl-ins${on(i, step)}">${a?.request ? `<span class="pl-req">${esc(a.request)}</span><span class="pl-arrow">↓</span>` : ""}
        <p>${esc(a?.insight || "…")}</p><small>${esc(PREP[i]?.angle ?? g.lead)}</small></section>`;
    }).join("")}</div>`;
}

export function sceneHtml(s: Scene, answers: Map<number, Answers>, step: number): string {
  if (s.kind === "intro") return intro();
  if (s.kind === "group") return group(s.i, answers.get(s.i), step);
  if (s.kind === "compare") return compare(answers, step);
  return finale(answers, step);
}
