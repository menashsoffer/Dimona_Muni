// Work groups page.
import "../styles/site.css";
import "../features/groups/groups.css";
import "../features/deal/deal.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { scrollEffects } from "../core/scroll.ts";
import { dealCards } from "../features/deal/deal.ts";
import { renderGroups } from "../features/groups/cards.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("groups");
mountSun();
renderGroups(byId("groupGrid"));
scrollEffects(dealCards(".grid > .card"));
