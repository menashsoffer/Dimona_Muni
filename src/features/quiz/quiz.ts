// Runs the quiz in its stage: intro → one question at a time with instant feedback → result.
import type { Quiz } from "../../content/types.ts";
import { byId } from "../../core/dom.ts";
import { scrollBehavior } from "../../core/scroll.ts";
import { celebrate, popFrom } from "../confetti/confetti.ts";
import { advance, type Game, isLast, isOver, newGame, pick, score } from "./game.ts";
import { resultCard } from "./card.ts";
import { canSharePicture, sharePicture, shareText } from "./share.ts";
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

  // The screen was replaced, so move focus to its heading for keyboard and screen-reader users,
  // and bring the heading into view if the reader had scrolled down to the explanation.
  function focusHeading(): void {
    const heading = stage.querySelector<HTMLElement>("[data-focus]");
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
  }

  function answer(k: number): void {
    if (!game || !pick(game, k)) return;
    const g = game;
    stage.querySelectorAll<HTMLButtonElement>(".opt").forEach((b, n) => {
      b.disabled = true;
      const mark = b.querySelector(".mark")!;
      if (g.options[g.index][n].ok) {
        b.classList.add("right"); mark.textContent = "✓";
        if (n === k) popFrom(b);
      }
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
    showPicture(score(game), game.questions.length, ending.text);
    focusHeading();
    stage.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    // Every finish gets a celebration; a better score gets a bigger one.
    setTimeout(() => celebrate(score(game!) / game!.questions.length), 250);
  }

  // The result picture, shown on the results screen so it can be saved or shared from there;
  // on phones that can share pictures, a button sends it through the share sheet too.
  async function showPicture(s: number, total: number, ending: string): Promise<void> {
    const blob = await resultCard(s, total, ending);
    const img = document.getElementById("shareImg") as HTMLImageElement | null;
    if (!blob || !img) return;
    const url = URL.createObjectURL(blob);
    img.src = url;
    byId<HTMLAnchorElement>("savePic").href = url;
    byId("shareCard").hidden = false;
    const file = new File([blob], "dimona-quiz.png", { type: "image/png" });
    if (!canSharePicture(file)) return;
    const btn = byId<HTMLButtonElement>("sharePic");
    btn.hidden = false;
    btn.onclick = () => void sharePicture(file, shareText(s, total));
  }

  // Keyboard for whoever runs the projector: 1–4 picks an answer.
  addEventListener("keydown", (e) => {
    const n = "1234".indexOf(e.key);
    if (n >= 0 && game && !isOver(game) && document.getElementById(`opt${n}`)) answer(n);
  });

  showIntro();
}
