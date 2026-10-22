// The live "now" panel, the sun on the hero arc, and the "how it will look at 11:00" demo button.
import { DAY } from "../../content/event.ts";
import { byId } from "../../core/dom.ts";
import { daysUntil, israelNow, toMinutes } from "../../core/time.ts";
import { nowState } from "./state.ts";

const DEMO_LABEL = "תצוגה לדוגמה: איך האתר ייראה ב-11:00 ביום עצמו";

function placeSun(f: number): void {
  const a = Math.PI * (1 - Math.max(0, Math.min(1, f)));
  // RTL: the day starts on the right (east).
  const sun = byId("sun");
  sun.setAttribute("cx", (130 + 120 * Math.cos(Math.PI - a)).toFixed(1));
  sun.setAttribute("cy", (130 - 120 * Math.sin(a)).toFixed(1));
}

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
    placeSun(s.sun);
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
