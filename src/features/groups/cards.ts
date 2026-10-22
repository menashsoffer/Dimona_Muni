// The three work-group cards.
import { GROUPS } from "../../content/people.ts";
import { esc } from "../../core/dom.ts";

export function renderGroups(grid: HTMLElement): void {
  grid.innerHTML = GROUPS.map((g, i) => `
    <div class="card">
      <span class="when">קבוצה ${i + 1}</span>
      <h3>${esc(g.lead)}</h3>
      <span class="role">${esc(g.role)}</span>
      ${g.project ? `<p>${esc(g.project)}</p>` : `<span class="ph">תיאור הפרויקט יעודכן</span>`}
    </div>`).join("");
}
