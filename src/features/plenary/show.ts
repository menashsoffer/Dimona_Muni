// The plenary slideshow. Next = click, Space or ←; back = →; f = fullscreen.
// plenary.html?demo (and the claude.ai preview) shows made-up answers instead of the real sheet.
import { PLENARY } from "../../content/plenary.ts";
import { loadAnswers, type Answers } from "./answers.ts";
import { DEMO } from "./demo.ts";
import { COMPARE_STOP, END_STOP, mountJourney } from "./journey.ts";
import { SCENES, sceneHtml, stepsOf, type Scene } from "./scenes.ts";

interface State { scene: number; step: number; answers: Map<number, Answers>; error: boolean; timerEnd: number }

const demo = new URLSearchParams(location.search).has("demo") || window.top !== window;

/** Which stop of the journey bar the sun is at for a scene. */
const stopOf = (s: Scene): number =>
  s.kind === "intro" ? -1 : s.kind === "group" ? s.i : s.kind === "compare" ? COMPARE_STOP : END_STOP;

/** Seconds on the clock for a scene, or 0 for none. */
const seconds = (s: Scene) => (s.kind === "group" ? PLENARY.minutes * 60 : s.kind === "compare" ? PLENARY.compareMinutes * 60 : 0);

/** Shrink each card's text until it fits without scrolling (cards are fixed-height on the big screen). */
function fitCards(stage: HTMLElement): void {
  for (const el of stage.querySelectorAll<HTMLElement>(".pl-focus-card,.pl-col,.pl-ins")) {
    let fit = 1;
    el.style.setProperty("--fit", "1");
    while (el.scrollHeight > el.clientHeight + 1 && fit > 0.4) {
      fit -= 0.04;
      el.style.setProperty("--fit", fit.toFixed(2));
    }
  }
}

export function startShow(stage: HTMLElement, bar: HTMLElement, clock: HTMLElement): void {
  const s: State = { scene: 0, step: 0, answers: new Map(), error: false, timerEnd: 0 };

  const journey = mountJourney(bar);
  const render = (animateReveal = false) => {
    const scene = SCENES[s.scene];
    journey.move(stopOf(scene));
    stage.dataset.kind = scene.kind;
    stage.innerHTML = sceneHtml(scene, s.answers, s.step)
      + (demo ? `<span class="pl-status">הדגמה עם תשובות לדוגמה</span>` : s.error ? `<span class="pl-status">אין חיבור לתשובות כרגע</span>` : "");
    if (animateReveal && scene.kind === "compare" && s.step > 0) {
      stage.querySelectorAll(".pl-col")[s.step - 1]?.classList.add("pl-surprise-enter");
    }
    if (animateReveal && scene.kind === "finale" && s.step > 0) {
      stage.querySelectorAll(".pl-ins")[s.step - 1]?.classList.add("pl-memo-enter");
    }
    fitCards(stage);
  };
  const tick = () => {
    const total = seconds(SCENES[s.scene]);
    clock.hidden = !total;
    if (!total) return;
    const left = Math.round((s.timerEnd - Date.now()) / 1000);
    const t = Math.abs(left);
    clock.textContent = `${left < 0 ? "+" : ""}${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
    clock.classList.toggle("over", left < 0);
  };
  const go = (dir: 1 | -1) => {
    const previousScene = s.scene;
    const previousStep = s.step;
    const max = stepsOf(SCENES[s.scene], s.answers);
    if (dir === 1 && s.step < max) s.step++;
    else if (dir === -1 && s.step > 0) s.step--;
    else {
      const next = Math.min(SCENES.length - 1, Math.max(0, s.scene + dir));
      if (next === s.scene) return;
      s.scene = next;
      s.step = dir === -1 ? stepsOf(SCENES[next], s.answers) : 0;
      s.timerEnd = Date.now() + seconds(SCENES[next]) * 1000;
    }
    render(dir === 1 && s.scene === previousScene && s.step > previousStep);
    tick();
  };

  document.addEventListener("keydown", (e) => {
    if (["ArrowLeft", " ", "PageDown", "Enter"].includes(e.key)) { e.preventDefault(); go(1); }
    if (["ArrowRight", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(-1); }
    if (e.key === "f") void document.documentElement.requestFullscreen?.();
  });
  stage.addEventListener("click", () => go(1));

  const refresh = async () => {
    try { s.answers = await loadAnswers(PLENARY.sheetId, PLENARY.gid); s.error = false; } catch { s.error = true; }
    render();
  };
  addEventListener("resize", () => fitCards(stage));
  void document.fonts?.ready.then(() => fitCards(stage));
  if (demo) s.answers = new Map(DEMO.map((a) => [a.group, a]));
  render();
  if (!demo) { void refresh(); setInterval(refresh, PLENARY.refreshSeconds * 1000); }
  setInterval(tick, 500);
}
