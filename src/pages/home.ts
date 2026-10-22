// Home page: live "now" panel and schedule, arrival, people, groups, and the Dimona section.
import "../styles/site.css";
import "../features/now/now.css";
import "../features/schedule/schedule.css";
import "../features/people/people.css";
import "../features/video/player.css";
import "./home.css";

import { VIDEO } from "../content/video.ts";
import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { revealOnScroll, scrollEffects } from "../core/scroll.ts";
import { startNowPanel } from "../features/now/panel.ts";
import { renderGroups, renderPeople } from "../features/people/cards.ts";
import { fillTimeline, renderSchedule } from "../features/schedule/schedule.ts";
import { mountPlayer } from "../features/video/player.ts";

renderNav("home");
renderPeople(byId("peopleGrid"));
renderGroups(byId("groupGrid"));
mountPlayer(byId("video"), VIDEO);

const list = byId("sched");
const items = renderSchedule(list);
startNowPanel(items);

scrollEffects(() => fillTimeline(list, items));
revealOnScroll("main h2,main .lead,.gnote,.card,.sched li");
