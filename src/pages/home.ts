// Home page: live "now" panel and schedule, quiz call-to-action, arrival, and the Dimona section.
import "../styles/site.css";
import "../features/now/now.css";
import "../features/schedule/schedule.css";
import "../features/video/player.css";
import "../features/quiz/cta.css";
import "./home.css";

import { VIDEO } from "../content/video.ts";
import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { revealOnScroll, scrollEffects } from "../core/scroll.ts";
import { startNowPanel } from "../features/now/panel.ts";
import { renderSchedule, stackCards } from "../features/schedule/schedule.ts";
import { mountPlayer } from "../features/video/player.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("home");
mountSun();
mountPlayer(byId("video"), VIDEO);

const list = byId("sched");
const items = renderSchedule(list);
startNowPanel(items);

scrollEffects(() => stackCards(items));
revealOnScroll("main h2,main .lead,.card");
