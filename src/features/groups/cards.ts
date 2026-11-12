// The three work-group cards. A click on a card opens the group's prep page (group.html?g=N).
import { GROUPS } from "../../content/people.ts";
import { PREP } from "../../content/prep.ts";
import { esc } from "../../core/dom.ts";

export function renderGroups(grid: HTMLElement): void {
  grid.innerHTML = GROUPS.map((g, i) => `
    <div class="card" data-href="group.html?g=${i + 1}">
      <span class="when">קבוצה ${i + 1}${PREP[i] ? ` · ${esc(PREP[i].group)}` : ""}</span>
      <h3>${esc(g.lead)}</h3>
      <span class="role">${esc(g.role)}</span>
      ${PREP[i] ? `<p class="tagline">${esc(PREP[i].tagline)}</p><p>${esc(PREP[i].question)}</p>` : g.project ? `<p>${esc(g.project)}</p>` : ""}
      <div class="btns"><a class="btn" href="group.html?g=${i + 1}">לחומר ההכנה</a><a class="btn ghost" href="form.html?g=${i + 1}">לטופס של הקבוצה</a></div>
    </div>`).join("");
  grid.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest("a")) return;
    const href = t.closest<HTMLElement>("[data-href]")?.dataset.href;
    if (href) location.href = href;
  });
}
