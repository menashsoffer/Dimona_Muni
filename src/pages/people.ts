// "האנשים של היום" page.
import "../styles/site.css";
import "../features/people/people.css";
import "../features/people/thread.css";
import "../features/cardfx/cardfx.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { scrollEffects } from "../core/scroll.ts";
import { dealCards } from "../features/cardfx/deal.ts";
import { renderPeople } from "../features/people/cards.ts";
import { mountThread } from "../features/people/thread.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("people");
mountSun();
mountThread(byId("thread"), renderPeople(byId("peopleGrid")));
scrollEffects(dealCards(".grid > .card"));
