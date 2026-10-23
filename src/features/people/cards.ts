// "האנשים של היום" cards.
import { PEOPLE } from "../../content/people.ts";
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
        ${p.text ? `<p>${esc(p.text)}</p>` : `<span class="ph">פרטים נוספים יעודכנו</span>`}
      </div>
    </article>`).join("");
}
