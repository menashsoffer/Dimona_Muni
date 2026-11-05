// The group worksheet: one printable A4 sheet per work group, filled by hand during the
// group work (11:45) and read out almost as is in the plenary (12:30).
import { GROUPS } from "../../content/people.ts";
import { esc } from "../../core/dom.ts";

/** Who the cadets heard before the group work, so they can note one thing from each. */
const HEARD = ["יהודה בצלאל, ממלא מקום ראש העיר", "ימית רווח וצוות אגף השירות"];

const lines = (n: number): string => `<span class="ln"></span>`.repeat(n);

function sheet(i: number): string {
  const g = GROUPS[i];
  const rows = [...HEARD, `${g.lead}, ${g.role}`]
    .map((who) => `<tr><th>${esc(who)}</th><td></td></tr>`).join("");
  return `
  <article class="sheet">
    <header class="sh-head">
      <div><span class="sh-kicker">מהפניה לתובנה · 15.11.2026</span>
      <h2>דף עבודה לקבוצה ${i + 1}</h2></div>
      <div class="sh-lead"><b>${esc(g.lead)}</b><span>${esc(g.role)}</span></div>
    </header>
    <div class="sh-meta">
      <label>חברי הקבוצה ${lines(1)}</label>
      <label>מציגים במליאה ${lines(1)}</label>
    </div>

    <section class="sh-q"><h3><i>1</i>קצת על מי שישב איתנו</h3>
      <p class="hint">מה התפקיד במילים שלנו? ודבר אחד שלא ידענו.</p>${lines(3)}</section>

    <section class="sh-q"><h3><i>2</i>מה למדנו מכל אחד</h3>
      <p class="hint">משפט אחד לכל אחד.</p>
      <table class="sh-table">${rows}</table></section>

    <section class="sh-q"><h3><i>3</i>הרגע שבו הפנייה הפכה לתובנה</h3>
      <div class="sh-two"><label>הפנייה ${lines(3)}</label><label>התובנה ${lines(3)}</label></div></section>

    <section class="sh-q"><h3><i>4</i>מה אנחנו לוקחים איתנו</h3>
      <div class="sh-two"><label>לרשות שלנו ${lines(3)}</label><label>לעבודה של כל אחד מאיתנו ${lines(3)}</label></div></section>

    <section class="sh-say">
      <h3>במליאה: כ-5 דקות, פשוט קוראים</h3>
      <ol>
        <li>„ישבנו עם ${esc(g.lead)}, ${esc(g.role)}. דבר אחד שלא ידענו…” <small>(1)</small></li>
        <li>„מכל מי ששמענו היום למדנו…” <small>(2)</small></li>
        <li>„הרגע שבו פנייה הפכה לתובנה היה…” <small>(3)</small></li>
        <li>„ומה אנחנו לוקחים איתנו…” <small>(4)</small></li>
      </ol>
      <p class="hint">אפשר להתחלק: כל אחד בקבוצה קורא שורה.</p>
    </section>
  </article>`;
}

export function renderSheets(host: HTMLElement): void {
  host.innerHTML = GROUPS.map((_, i) => sheet(i)).join("");
}
