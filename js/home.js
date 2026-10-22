// Home page: live "now" panel and schedule (Israel time), people and group cards.
import { DAY, SCHEDULE } from "./content/event.js";
import { PEOPLE, GROUPS } from "./content/people.js";
import { renderNav, scrollEffects, esc } from "./site.js";

renderNav("home");

const m = t => { const [a, b] = t.split(":").map(Number); return a * 60 + b };
const START = m(SCHEDULE[0].from), END = m(SCHEDULE[SCHEDULE.length - 1].to);
const $ = id => document.getElementById(id);
let demoMin = null;

/* people + groups */
$("peopleGrid").innerHTML = PEOPLE.map(p => `
  <article class="card person"><span class="av">${p.photo ? `<img src="assets/people/${p.photo}.png" alt="${esc(p.name)}">` : `<span>${esc(p.initial || p.name[0])}</span>`}</span>
  <div class="pbody"><span class="when">${esc(p.when)}</span><h3>${esc(p.name)}</h3><span class="role">${esc(p.role)}</span>${p.text ? `<p>${esc(p.text)}</p>` : ""}<span class="ph">פרטים נוספים יעודכנו</span></div></article>`).join("");
$("groupGrid").innerHTML = GROUPS.map((g, i) => `
  <div class="card"><span class="when">קבוצה ${i + 1}</span><h3>${esc(g.lead)}</h3><span class="role">${esc(g.role)}</span>${g.project ? `<p>${esc(g.project)}</p>` : `<span class="ph">תיאור הפרויקט יעודכן</span>`}</div>`).join("");

/* schedule */
const list = $("sched");
list.innerHTML = SCHEDULE.map(r => `<li class="${r.brk ? "brk" : ""}"><span class="t">${r.from}–${r.to}</span><div class="w"><b>${esc(r.title)}</b>${r.note ? `<span>${esc(r.note)}</span>` : ""}</div></li>`).join("");
const items = [...list.children];

function israelNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, min: (+p.hour % 24) * 60 + +p.minute };
}
const dayDiff = n => Math.round((Date.UTC(DAY.y, DAY.m - 1, DAY.d) - Date.UTC(n.y, n.mo - 1, n.d)) / 864e5);

function setSun(f) {
  f = Math.max(0, Math.min(1, f)); const a = Math.PI * (1 - f);
  // RTL: day starts on the right (east)
  const s = $("sun"); s.setAttribute("cx", (130 + 120 * Math.cos(Math.PI - a)).toFixed(1)); s.setAttribute("cy", (130 - 120 * Math.sin(a)).toFixed(1));
}

function render() {
  const n = israelNow(); let diff = dayDiff(n), cur = n.min;
  if (demoMin !== null) { diff = 0; cur = demoMin }
  const T = $("nowTitle"), TT = $("nowTime"), L = $("nowLabelText"), NX = $("nextText"), NR = $("nextRow"), P = $("prog");
  items.forEach(li => li.classList.remove("is-now", "done"));
  if (diff > 0) {
    L.textContent = diff === 1 ? "מחר" : "בקרוב";
    T.textContent = diff === 1 ? "נפגשים מחר ב-9:00 בבאר שבע צפון" : (diff === 2 ? "עוד יומיים ליום העיון" : `עוד ${diff} ימים ליום העיון`);
    TT.textContent = "יום ראשון, 15.11.2026"; NR.hidden = false; NX.textContent = `${SCHEDULE[0].from} · ${SCHEDULE[0].title}`; P.style.width = "0"; setSun(0); return;
  }
  if (diff < 0 || cur >= END) {
    L.textContent = "הסתיים"; T.textContent = "תודה שהייתם איתנו"; TT.textContent = "מהתלונה לתובנה · דימונה, 15.11.2026"; NR.hidden = true; P.style.width = "100%"; setSun(1);
    if (diff <= 0) items.forEach(li => li.classList.add("done")); return;
  }
  setSun((cur - START) / (END - START));
  if (cur < START) { L.textContent = "הבוקר"; T.textContent = "ההסעה יוצאת ב-9:00 מבאר שבע צפון"; TT.textContent = ""; NR.hidden = true; P.style.width = "0"; return }
  const i = SCHEDULE.findIndex(r => cur >= m(r.from) && cur < m(r.to));
  items.forEach((li, k) => { if (k < i) li.classList.add("done"); if (k === i) li.classList.add("is-now") });
  const r = SCHEDULE[i]; L.textContent = "עכשיו"; T.textContent = r.title; TT.textContent = `${r.from}–${r.to}` + (r.note ? ` · ${r.note}` : "");
  P.style.width = ((cur - m(r.from)) / (m(r.to) - m(r.from)) * 100).toFixed(0) + "%";
  const nx = SCHEDULE[i + 1]; NR.hidden = !nx; if (nx) NX.textContent = `${nx.from} · ${nx.title}`;
}

const DEMO_LABEL = "תצוגה לדוגמה: איך האתר ייראה ב-11:00 ביום עצמו";
$("demo").textContent = DEMO_LABEL;
$("demo").addEventListener("click", e => {
  if (demoMin === null) { demoMin = m("11:00"); e.target.textContent = "חזרה לזמן אמת" } else { demoMin = null; e.target.textContent = DEMO_LABEL }
  render(); $("now").scrollIntoView({ behavior: "smooth" });
});
render(); setInterval(render, 30000);

/* schedule timeline fills as you scroll */
scrollEffects({
  reveal: "main h2,main .lead,.gnote,.card,.sched li",
  onFrame() {
    const r = list.getBoundingClientRect(), sp = Math.max(0, Math.min(1, (innerHeight * .62 - r.top) / r.height));
    list.style.setProperty("--sp", sp.toFixed(3));
    const lim = r.top + r.height * sp;
    items.forEach(li => li.classList.toggle("lit", li.getBoundingClientRect().top + 20 < lim));
  },
});
