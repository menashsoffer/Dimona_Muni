// "האנשים של היום" page.
import "../styles/site.css";
import "../features/people/people.css";
import "../features/deal/deal.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { scrollEffects } from "../core/scroll.ts";
import { dealCards } from "../features/deal/deal.ts";
import { renderPeople } from "../features/people/cards.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("people");
mountSun();
renderPeople(byId("peopleGrid"));
scrollEffects(dealCards(".grid > .card"));
