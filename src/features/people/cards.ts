// "האנשים של היום" and group cards.
import { GROUPS, PEOPLE } from "../../content/people.ts";
import type { Person } from "../../content/types.ts";
import { esc } from "../../core/dom.ts";

const avatar = (p: Person): string => p.photo
  ? `<img src="assets/people/${p.photo}.png" alt="${esc(p.name)}">`
  : `<span>${esc(p.initial ?? p.name[0])}</span>`;

export function renderPeople(grid: HTMLElement): void {
  grid.innerHTML = PEOPLE.map((p) => `
    <article class="card person">
      <span class="av">${avatar(p)}</span>
      <div class="pbody">
        <span class="when">${esc(p.when)}</span>
        <h3>${esc(p.name)}</h3>
        <span class="role">${esc(p.role)}</span>
        ${p.text ? `<p>${esc(p.text)}</p>` : ""}
        <span class="ph">פרטים נוספים יעודכנו</span>
      </div>
    </article>`).join("");
}

export function renderGroups(grid: HTMLElement): void {
  grid.innerHTML = GROUPS.map((g, i) => `
    <div class="card">
      <span class="when">קבוצה ${i + 1}</span>
      <h3>${esc(g.lead)}</h3>
      <span class="role">${esc(g.role)}</span>
      ${g.project ? `<p>${esc(g.project)}</p>` : `<span class="ph">תיאור הפרויקט יעודכן</span>`}
    </div>`).join("");
}
