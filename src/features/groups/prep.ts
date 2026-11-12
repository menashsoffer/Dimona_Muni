// One group's prep page: group.html?g=<group number>.
import { GROUPS } from "../../content/people.ts";
import { PREP } from "../../content/prep.ts";
import { esc } from "../../core/dom.ts";

/** The group number in the URL (?g=1..), as an index into GROUPS, or -1. */
export function groupFromUrl(): number {
  const g = Number(new URLSearchParams(location.search).get("g")) - 1;
  return g >= 0 && g < GROUPS.length ? g : -1;
}

export function renderPrep(root: HTMLElement, title: HTMLElement, tag: HTMLElement): void {
  const i = groupFromUrl();
  if (i < 0) { location.replace("groups.html"); return; }
  const g = GROUPS[i], p = PREP[i];
  document.title = `${p.group} · מהפניה לתובנה`;
  title.textContent = p.group;
  tag.textContent = `11:45–12:30 · ${g.lead}, ${g.role}`;
  root.innerHTML = `
    <div class="card prep-card">
      <span class="when">קבוצה ${i + 1} · חומר הכנה</span>
      <h2 class="prep-tagline">${esc(p.tagline)}</h2>
      <p class="prep-q">${esc(p.question)}</p>
      <p class="prep-intro">${esc(p.intro)}</p>
      <ol class="prep-points">${p.points.map((pt) =>
        `<li>${pt.key ? `<b>${esc(pt.key)}</b> ` : ""}${esc(pt.text)}</li>`).join("")}</ol>
      <blockquote class="prep-closing">${esc(p.closing)}</blockquote>
    </div>
    <div class="card prep-next">
      <h3>ובקבוצה</h3>
      <p>תוך כדי השיחה, נציג הקבוצה ממלא את הטופס: מה הפתיע אותנו, שלושה דברים שלמדנו, מה ניקח לרשות שלנו, והמשפט שלנו למליאה. ב-12:30 התשובות עולות על המסך, ומציגים מהן.</p>
      <div class="btns"><a class="btn" href="form.html?g=${i + 1}">לטופס של הקבוצה</a><a class="btn ghost" href="groups.html">לכל הקבוצות</a></div>
    </div>`;
}
