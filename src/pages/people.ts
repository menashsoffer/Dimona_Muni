// "האנשים של היום" page.
import "../styles/site.css";
import "../features/people/people.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { revealOnScroll, scrollEffects } from "../core/scroll.ts";
import { renderPeople } from "../features/people/cards.ts";

renderNav("people");
renderPeople(byId("peopleGrid"));
scrollEffects();
revealOnScroll(".card");
