// Quiz engine: intro → one question at a time with instant feedback → result.
// No timer on purpose; questions come from js/content/quiz.js.
import { QUIZ } from "./content/quiz.js";
import { renderNav, scrollEffects, esc } from "./site.js";

renderNav("quiz");
scrollEffects({ reveal: "" });

const stage = document.getElementById("stage");
const KEYS = ["א", "ב", "ג", "ד"];
const QS = QUIZ.questions;
let order, i, score, results, picked;

const shuffle = a => { a = [...a]; for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]] } return a };
const srcLinks = list => list.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");

function intro() {
  stage.innerHTML = `
    <span class="eyebrow">חידון</span>
    <h2>${esc(QUIZ.title)}</h2>
    <p style="margin:0">${esc(QUIZ.intro)}</p>
    <div class="chips"><span class="chip">${QS.length} שאלות</span><span class="chip">משוב מיד אחרי כל תשובה</span><span class="chip">אפשר לבד או בקבוצות, מול המסך</span></div>
    <div class="act"><button class="btn big" id="go" type="button">מתחילים</button></div>`;
  document.getElementById("go").onclick = start;
}

function start() {
  i = 0; score = 0; results = [];
  // Questions keep their order (history first, today last); options are shuffled every game.
  order = QS.map(q => shuffle(q.options.map((text, idx) => ({ text, ok: idx === q.answer }))));
  question();
  stage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function dots() {
  return `<div class="dots" aria-hidden="true">${QS.map((_, k) => `<i class="${k < i ? (results[k] ? "ok" : "no") : k === i ? "cur" : ""}"></i>`).join("")}</div>`;
}

function question() {
  picked = null;
  const q = QS[i];
  stage.innerHTML = `
    <div class="top"><span class="eyebrow">שאלה ${i + 1} מתוך ${QS.length}</span><span class="score">${score} תשובות נכונות</span></div>
    ${dots()}
    <h2 class="qtext">${esc(q.q)}</h2>
    <div class="opts" role="group" aria-label="תשובות">${order[i].map((o, k) => `<button class="opt" type="button" id="opt${k}" data-k="${k}"><span class="k">${KEYS[k]}</span><span>${esc(o.text)}</span><span class="mark" aria-hidden="true"></span></button>`).join("")}</div>
    <div id="fbSlot"></div>`;
  stage.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.k));
}

function answer(k) {
  if (picked !== null) return;
  picked = k;
  const q = QS[i], opts = order[i], ok = opts[k].ok;
  if (ok) score++;
  results[i] = ok;
  stage.querySelectorAll(".opt").forEach((b, n) => {
    b.disabled = true;
    const mark = b.querySelector(".mark");
    if (opts[n].ok) { b.classList.add("right"); mark.textContent = "✓" }
    else if (n === k) { b.classList.add("wrong"); mark.textContent = "✗" }
    else b.classList.add("dim");
  });
  stage.querySelector(".score").textContent = `${score} תשובות נכונות`;
  const right = opts.find(o => o.ok).text, last = i === QS.length - 1;
  document.getElementById("fbSlot").innerHTML = `
    <div class="fb ${ok ? "" : "no"}">
      <b class="h">${ok ? "נכון!" : `לא בדיוק. התשובה: ${esc(right)}`}</b>
      <p>${esc(q.fact)}</p>
      <div class="src"><span>מקור:</span>${srcLinks(q.sources)}</div>
    </div>
    <div class="act" style="margin-top:12px"><button class="btn big" id="next" type="button">${last ? "לתוצאה" : "לשאלה הבאה"}</button><span class="hint">אפשר גם Enter</span></div>`;
  const next = document.getElementById("next");
  next.onclick = () => { if (last) result(); else { i++; question(); } };
  next.focus({ preventScroll: true });
  next.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function result() {
  i = QS.length;
  const end = QUIZ.endings.find(e => score >= e.min);
  const all = [...new Map(QS.flatMap(q => q.sources).map(s => [s.url, s])).values()];
  stage.innerHTML = `
    <span class="eyebrow">סיימתם!</span>
    ${dots()}
    <div class="result">
      <div class="total">${score}</div>
      <span class="of">תשובות נכונות מתוך ${QS.length}</span>
      <p class="endtxt">${esc(end.text)}</p>
    </div>
    <div class="act"><button class="btn big" id="again" type="button">משחק חוזר</button><a class="btn ghost" href="index.html">חזרה לאתר</a></div>
    <details><summary>כל המקורות של החידון</summary><ul class="allsrc">${all.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul></details>`;
  document.getElementById("again").onclick = start;
}

// Keyboard for the person at the projector: 1–4 picks an answer.
addEventListener("keydown", e => {
  if (e.target.closest?.("input,textarea")) return;
  const n = "1234".indexOf(e.key);
  if (n >= 0 && picked === null && i < QS.length && document.getElementById(`opt${n}`)) answer(n);
});

intro();
