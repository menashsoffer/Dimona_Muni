// The live "now" panel, and the "how it will look at 11:00" demo, which is hidden on the day itself.
import { DAY } from "../../content/event.ts";
import { byId } from "../../core/dom.ts";
import { scrollBehavior } from "../../core/scroll.ts";
import { daysUntil, israelNow, toMinutes } from "../../core/time.ts";
import { nowState } from "./state.ts";

const DEMO_LABEL = "תצוגה לדוגמה: איך האתר ייראה ב-11:00 ביום עצמו";

export function startNowPanel(items: HTMLLIElement[]): void {
  let demoMin: number | null = null;

  function render(): void {
    const now = israelNow();
    const s = demoMin === null ? nowState(daysUntil(DAY, now), now.min) : nowState(0, demoMin);
    byId("now").classList.toggle("is-demo", demoMin !== null);
    byId("nowLabelText").textContent = demoMin === null ? s.label : "מצב הדגמה · 11:00";
    byId("demoExit").hidden = demoMin === null;
    byId("nowTitle").textContent = s.title;
    byId("nowTime").textContent = s.time;
    byId("nextRow").hidden = !s.next;
    byId("nextText").textContent = s.next ?? "";
    byId("prog").style.width = `${Math.round(s.progress * 100)}%`;
    items.forEach((li, k) => {
      li.classList.toggle("done", k < s.done && k !== s.current);
      li.classList.toggle("is-now", k === s.current);
    });
  }

  function setDemo(on: boolean): void {
    demoMin = on ? toMinutes("11:00") : null;
    demo.textContent = on ? "חזרה לזמן אמת" : DEMO_LABEL;
    render();
    if (on) byId("now").scrollIntoView({ behavior: scrollBehavior() });
  }

  const demo = byId<HTMLButtonElement>("demo");
  demo.textContent = DEMO_LABEL;
  demo.hidden = daysUntil(DAY, israelNow()) === 0;
  demo.addEventListener("click", () => setDemo(demoMin === null));
  byId("demoExit").addEventListener("click", () => setDemo(false));

  render();
  setInterval(render, 30_000);
}
