// One group's prep page: group.html?g=<group number>.
import "../styles/site.css";
import "../features/groups/groups.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { renderPrep } from "../features/groups/prep.ts";
import { mountSun } from "../features/sun/sun.ts";
import { heroIntro, pressSprings, revealOnScroll } from "../core/motion.ts";

renderNav("groups");
mountSun();
renderPrep(byId("prepBody"), byId("gTitle"), byId("gTag"));
heroIntro();
pressSprings();
revealOnScroll(".prep-points li,.prep-next");
