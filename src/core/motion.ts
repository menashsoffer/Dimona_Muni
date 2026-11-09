// Entrance and touch effects shared by every page, built on two libraries:
// - Motion (motion.dev): scroll reveals with springs, and a springy press on buttons.
// - anime.js: the staggered hero entrance and small playful loops.
// Everything is skipped when the visitor asks for reduced motion, so the page is complete without it.
import { animate as spring, inView, press } from "motion";
import { animate, stagger } from "animejs";
import { reducedMotion } from "./scroll.ts";

/** Wrap each word of the hero title in a span (keeping its <br>), so words can move one by one. */
function splitWords(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];
  [...el.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return;
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) { frag.append(part); return; }
      const w = document.createElement("span");
      w.className = "word";
      w.textContent = part;
      words.push(w);
      frag.append(w);
    });
    node.replaceWith(frag);
  });
  return words;
}

/** anime.js: logos drop in, the title rises word by word, then the tagline and facts follow. */
export function heroIntro(): void {
  const hero = document.querySelector<HTMLElement>(".hero");
  const h1 = hero?.querySelector<HTMLElement>("h1");
  if (!hero || !h1 || reducedMotion()) return;
  const words = splitWords(h1);
  animate(hero.querySelectorAll(".partner"), {
    opacity: [0, 1], translateY: [-18, 0], scale: [0.9, 1],
    delay: stagger(140), duration: 800, ease: "outBack(1.6)",
  });
  animate(words, {
    opacity: [0, 1], translateY: ["0.45em", "0em"], rotate: [-4, 0],
    delay: stagger(130, { start: 150 }), duration: 900, ease: "outExpo",
  });
  animate(hero.querySelectorAll(".tag, .facts > span"), {
    opacity: [0, 1], translateY: [12, 0],
    delay: stagger(110, { start: 450 + words.length * 130 }), duration: 700, ease: "outQuad",
  });
}

/** Motion: elements below the fold rise into place with a spring as they scroll into view.
 *  Elements already on the first screen stay put, so the page is complete at rest. */
export function revealOnScroll(selector: string): void {
  if (reducedMotion()) return;
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.classList.add("rv");
    if (el.getBoundingClientRect().top <= innerHeight) return;
    const idx = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.style.opacity = "0";
    el.style.transform = "translateY(34px) scale(.97)";
    el.style.filter = "blur(5px)";
    inView(el, () => {
      spring(el, { opacity: 1, transform: "translateY(0px) scale(1)", filter: "blur(0px)" },
        { type: "spring", bounce: 0.3, visualDuration: 0.6, delay: Math.min(idx, 5) * 0.08 })
        // Hand the element back to its own CSS (hover lifts, tilt) once it has arrived. Motion
        // writes the final values after the promise settles, so clear them on the next frame.
        .finished.then(() => requestAnimationFrame(() =>
          ["opacity", "transform", "filter"].forEach((p) => el.style.removeProperty(p))));
    }, { margin: "0px 0px -8% 0px" });
  });
}

/** Motion: buttons sink a little under the finger and spring back. */
export function pressSprings(selector = ".btn, .quiz-cta, nav a"): void {
  if (reducedMotion()) return;
  press(selector, (el) => {
    spring(el, { scale: 0.95 }, { type: "spring", stiffness: 600, damping: 30 });
    return () => spring(el, { scale: 1 }, { type: "spring", stiffness: 500, damping: 14 });
  });
}

/** anime.js: a gentle, endless wobble (the quiz "?" mark). */
export function wobble(selector: string): void {
  const el = document.querySelector(selector);
  if (!el || reducedMotion()) return;
  animate(el, { rotate: [-9, 9], scale: [1, 1.08], duration: 1400, ease: "inOutSine", loop: true, alternate: true });
}

/** anime.js: a right answer bounces, a wrong one shakes. */
export function answerFx(right: Element | null, wrong: Element | null): void {
  if (reducedMotion()) return;
  if (right) animate(right, { scale: [1, 1.06, 1], duration: 520, ease: "outElastic(1, .5)" });
  if (wrong) animate(wrong, { translateX: [0, -10, 9, -6, 4, 0], duration: 480, ease: "inOutQuad" });
}
