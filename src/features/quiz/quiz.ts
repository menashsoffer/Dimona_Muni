// Runs the quiz in its stage: intro → one question at a time with instant feedback → result.
import type { Quiz } from "../../content/types.ts";
import { byId } from "../../core/dom.ts";
import { scrollBehavior } from "../../core/scroll.ts";
import { advance, type Game, isLast, isOver, newGame, pick, score } from "./game.ts";
import { feedbackView, introView, questionView, resultView } from "./view.ts";

export function startQuiz(stage: HTMLElement, quiz: Quiz): void {
  let game: Game | null = null;

  const showIntro = (): void => {
    stage.innerHTML = introView(quiz);
    byId("go").onclick = start;
  };

  function start(): void {
    game = newGame(quiz.questions);
    showQuestion();
    stage.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  function showQuestion(): void {
    if (!game) return;
    stage.innerHTML = questionView(game);
    stage.querySelectorAll<HTMLButtonElement>(".opt").forEach((b) => (b.onclick = () => answer(Number(b.dataset.k))));
    focusHeading();
  }

  // The screen was replaced, so move focus to its heading for keyboard and screen-reader users.
  const focusHeading = (): void => stage.querySelector<HTMLElement>("[data-focus]")?.focus({ preventScroll: true });

  function answer(k: number): void {
    if (!game || !pick(game, k)) return;
    const g = game;
    stage.querySelectorAll<HTMLButtonElement>(".opt").forEach((b, n) => {
      b.disabled = true;
      const mark = b.querySelector(".mark")!;
      if (g.options[g.index][n].ok) { b.classList.add("right"); mark.textContent = "✓"; }
      else if (n === k) { b.classList.add("wrong"); mark.textContent = "✗"; }
      else b.classList.add("dim");
    });
    stage.querySelector(".score")!.textContent = `${score(g)} תשובות נכונות`;
    byId("fbSlot").innerHTML = feedbackView(g);
    const next = byId<HTMLButtonElement>("next");
    next.onclick = () => (isLast(g) ? showResult() : (advance(g), showQuestion()));
    next.focus({ preventScroll: true });
    next.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
  }

  function showResult(): void {
    if (!game) return;
    advance(game);
    const ending = quiz.endings.find((e) => score(game!) >= e.min) ?? quiz.endings[quiz.endings.length - 1];
    stage.innerHTML = resultView(game, ending);
    byId("again").onclick = start;
    focusHeading();
    stage.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  // Keyboard for whoever runs the projector: 1–4 picks an answer.
  addEventListener("keydown", (e) => {
    const n = "1234".indexOf(e.key);
    if (n >= 0 && game && !isOver(game) && document.getElementById(`opt${n}`)) answer(n);
  });

  showIntro();
}
