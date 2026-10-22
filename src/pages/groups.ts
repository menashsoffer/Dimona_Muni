// Work groups page.
import "../styles/site.css";
import "../features/groups/groups.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { revealOnScroll, scrollEffects } from "../core/scroll.ts";
import { renderGroups } from "../features/groups/cards.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("groups");
mountSun();
renderGroups(byId("groupGrid"));
scrollEffects();
revealOnScroll(".card");
