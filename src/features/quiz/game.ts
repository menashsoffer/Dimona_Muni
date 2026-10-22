// Quiz game state, with no DOM. Questions keep their order (history first, today last);
// options are shuffled every game.
import type { Question } from "../../content/types.ts";

export interface Option {
  text: string;
  ok: boolean;
}

export interface Game {
  questions: Question[];
  options: Option[][]; // shuffled options per question
  index: number; // current question; equals questions.length when finished
  results: boolean[]; // per answered question
  picked: number | null; // option picked on the current question
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}

export function newGame(questions: Question[]): Game {
  const options = questions.map((q) => shuffle(q.options.map((text, i) => ({ text, ok: i === q.answer }))));
  return { questions, options, index: 0, results: [], picked: null };
}

export const score = (g: Game): number => g.results.filter(Boolean).length;
export const isLast = (g: Game): boolean => g.index === g.questions.length - 1;
export const isOver = (g: Game): boolean => g.index >= g.questions.length;
export const rightOption = (g: Game): Option => g.options[g.index].find((o) => o.ok)!;

/** Record an answer. Returns false if this question was already answered. */
export function pick(g: Game, option: number): boolean {
  if (g.picked !== null || isOver(g)) return false;
  g.picked = option;
  g.results[g.index] = g.options[g.index][option].ok;
  return true;
}

export function advance(g: Game): void {
  g.index++;
  g.picked = null;
}
