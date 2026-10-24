// "האנשים של היום" cards.
import { PEOPLE } from "../../content/people.ts";
import type { Person } from "../../content/types.ts";
import { esc } from "../../core/dom.ts";

const avatar = (p: Person): string => p.photo
  ? `<img src="assets/people/${p.photo}.png" alt="${esc(p.name)}">`
  : `<span>${esc(p.initial ?? p.name[0])}</span>`;

// One duotone filter for every photo, so they read as a set: grayscale first, then
// shadows mapped to the dark earth brown and highlights to warm sunset gold.
const DUOTONE = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <filter id="duotone" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.23 1"/>
        <feFuncG type="table" tableValues="0.11 0.86"/>
        <feFuncB type="table" tableValues="0.05 0.55"/>
      </feComponentTransfer>
    </filter>
  </svg>`;

export function renderPeople(grid: HTMLElement): void {
  grid.insertAdjacentHTML("beforebegin", DUOTONE);
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
