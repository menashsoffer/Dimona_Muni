// Work groups page.
import "../styles/site.css";
import "../features/groups/groups.css";
import "../features/cardfx/cardfx.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { scrollEffects } from "../core/scroll.ts";
import { tiltCards } from "../features/cardfx/tilt.ts";
import { renderGroups } from "../features/groups/cards.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("groups");
mountSun();
renderGroups(byId("groupGrid"));
scrollEffects(tiltCards("#groups .card"));
