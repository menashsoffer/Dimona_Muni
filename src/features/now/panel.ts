// The live "now" panel, and the "how it will look at 11:00" demo button.
import { DAY } from "../../content/event.ts";
import { byId } from "../../core/dom.ts";
import { daysUntil, israelNow, toMinutes } from "../../core/time.ts";
import { nowState } from "./state.ts";

const DEMO_LABEL = "תצוגה לדוגמה: איך האתר ייראה ב-11:00 ביום עצמו";

export function startNowPanel(items: HTMLLIElement[]): void {
  let demoMin: number | null = null;

  function render(): void {
    const now = israelNow();
    const s = demoMin === null ? nowState(daysUntil(DAY, now), now.min) : nowState(0, demoMin);
    byId("nowLabelText").textContent = s.label;
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

  const demo = byId<HTMLButtonElement>("demo");
  demo.textContent = DEMO_LABEL;
  demo.addEventListener("click", () => {
    demoMin = demoMin === null ? toMinutes("11:00") : null;
    demo.textContent = demoMin === null ? DEMO_LABEL : "חזרה לזמן אמת";
    render();
    byId("now").scrollIntoView({ behavior: "smooth" });
  });

  render();
  setInterval(render, 30_000);
}
