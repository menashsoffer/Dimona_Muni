// The plenary slideshow: an opening slide, one slide per group whose sections appear one click at a time,
// and a closing slide with every group's insight. Next = click, Space or ←; back = →.
import { GROUPS } from "../../content/people.ts";
import { PLENARY } from "../../content/plenary.ts";
import { esc } from "../../core/dom.ts";
import { loadAnswers, type Answers } from "./answers.ts";

const STEPS = 4; // sections revealed per group

interface State { slide: number; step: number; answers: Map<number, Answers>; error: boolean; timerEnd: number }

const list = (items: string[]) => items.filter(Boolean).map((t) => `<li>${esc(t)}</li>`).join("");
const line = (label: string, text: string) => (text ? `<p><b>${esc(label)}</b> ${esc(text)}</p>` : "");

function groupSlide(i: number, a: Answers | undefined, step: number): string {
  const g = GROUPS[i];
  const head = `<header class="pl-head"><span class="pl-kicker">קבוצה ${i + 1}</span><h1>${esc(g.lead)}</h1><span class="pl-role">${esc(g.role)}</span>
    ${a?.presenter ? `<span class="pl-presenter">מציג/ה: ${esc(a.presenter)}</span>` : ""}</header>`;
  if (!a) return `${head}<p class="pl-wait">התשובות של הקבוצה עוד לא הגיעו. המסך מתעדכן לבד.</p>`;
  const blocks = [
    `<h2>מי ישב איתנו</h2>${line("התפקיד:", a.role)}${line("מהשולחן שלו/ה:", a.project)}${line("מה הפתיע:", a.surprise)}`,
    `<h2>מה למדנו</h2><ol>${list(a.learned)}</ol>`,
    `<h2>מה אנחנו לוקחים איתנו</h2>${line("", a.take)}${line("שאלה פתוחה:", a.open)}`,
    `<h2>המשפט שלנו</h2>${a.request ? `<p class="pl-quote">״${esc(a.request)}״</p>` : ""}<p class="pl-insight">${esc(a.insight)}</p>`,
  ];
  return head + `<div class="pl-blocks">${blocks.map((b, k) => `<section class="pl-block${k < step ? " on" : ""}${k === 3 ? " last" : ""}">${b}</section>`).join("")}</div>`;
}

function render(stage: HTMLElement, s: State): void {
  const last = GROUPS.length + 1;
  let html: string;
  if (s.slide === 0) {
    html = `<div class="pl-cover"><span class="pl-kicker">12:30 · הצגה במליאה</span><h1>מה לקחנו מהשולחן?</h1>
      <p>${GROUPS.length} קבוצות · כ-${PLENARY.minutes} דקות לכל קבוצה</p><p class="pl-hint">לחיצה או רווח כדי להתחיל</p></div>`;
  } else if (s.slide === last) {
    const items = GROUPS.map((g, i) => ({ g, a: s.answers.get(i) })).filter((x) => x.a?.insight);
    html = `<div class="pl-cover pl-end"><span class="pl-kicker">מהפניה לתובנה</span><h1>התובנות שלנו</h1>
      <ul>${items.map((x) => `<li><span>${esc(x.g.lead)}</span>${esc(x.a!.insight)}</li>`).join("") || "<li>עוד אין תובנות</li>"}</ul></div>`;
  } else {
    html = groupSlide(s.slide - 1, s.answers.get(s.slide - 1), s.step);
  }
  const status = s.error ? `<span class="pl-status">אין חיבור לתשובות כרגע</span>` : "";
  stage.innerHTML = html + status + `<div class="pl-dots">${Array.from({ length: last + 1 }, (_, k) => `<i${k === s.slide ? ' class="on"' : ""}></i>`).join("")}</div>`;
}

function tick(clock: HTMLElement, s: State): void {
  const inGroup = s.slide > 0 && s.slide <= GROUPS.length;
  clock.hidden = !inGroup;
  if (!inGroup) return;
  const left = Math.round((s.timerEnd - Date.now()) / 1000);
  const t = Math.abs(left);
  clock.textContent = `${left < 0 ? "+" : ""}${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  clock.classList.toggle("over", left < 0);
}

export function startShow(stage: HTMLElement, clock: HTMLElement): void {
  const s: State = { slide: 0, step: 0, answers: new Map(), error: false, timerEnd: 0 };
  const last = GROUPS.length + 1;
  const go = (dir: 1 | -1) => {
    const inGroup = s.slide > 0 && s.slide <= GROUPS.length;
    const steps = inGroup && s.answers.get(s.slide - 1) ? STEPS : 0;
    if (dir === 1 && inGroup && s.step < steps) s.step++;
    else if (dir === -1 && inGroup && s.step > 0) s.step--;
    else {
      const next = Math.min(last, Math.max(0, s.slide + dir));
      if (next === s.slide) return;
      s.slide = next;
      s.step = dir === -1 && next > 0 && next <= GROUPS.length && s.answers.get(next - 1) ? STEPS : 0;
      if (dir === 1) s.timerEnd = Date.now() + PLENARY.minutes * 60_000;
    }
    render(stage, s);
    tick(clock, s);
  };
  document.addEventListener("keydown", (e) => {
    if (["ArrowLeft", " ", "PageDown", "Enter"].includes(e.key)) { e.preventDefault(); go(1); }
    if (["ArrowRight", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(-1); }
    if (e.key === "f") void document.documentElement.requestFullscreen?.();
  });
  stage.addEventListener("click", () => go(1));

  const refresh = async () => {
    if (!PLENARY.sheetId) { s.error = true; render(stage, s); return; }
    try { s.answers = await loadAnswers(PLENARY.sheetId); s.error = false; } catch { s.error = true; }
    render(stage, s);
  };
  render(stage, s);
  void refresh();
  setInterval(refresh, PLENARY.refreshSeconds * 1000);
  setInterval(() => tick(clock, s), 500);
}
