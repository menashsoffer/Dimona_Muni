// Scroll-driven effects shared by every page: the sky and nav progress (--pp) and the hero parallax.
// Page-specific effects hook in through `onFrame`.

export const reducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;
/** "smooth" unless the visitor asked for reduced motion. */
export const scrollBehavior = (): ScrollBehavior => (reducedMotion() ? "auto" : "smooth");

export function scrollEffects(onFrame?: () => void): void {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>(".hero");
  const inner = hero?.querySelector<HTMLElement>(".in");
  const dunes = [document.getElementById("dune1"), document.getElementById("dune2")];
  const still = reducedMotion();
  let queued = false;

  function frame(): void {
    queued = false;
    const y = scrollY;
    const max = Math.max(1, root.scrollHeight - innerHeight);
    root.style.setProperty("--pp", `${(Math.min(1, y / max) * 100).toFixed(1)}%`);
    if (!still && hero && inner && y < hero.offsetHeight + 50) {
      inner.style.transform = `translateY(${y * 0.35}px)`;
      inner.style.opacity = Math.max(0, 1 - y / (hero.offsetHeight * 0.9)).toFixed(2);
      dunes[0]?.style.setProperty("transform", `translateY(${-y * 0.12}px)`);
      dunes[1]?.style.setProperty("transform", `translateY(${-y * 0.04}px)`);
    }
    onFrame?.();
  }

  addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(frame); }
  }, { passive: true });
  addEventListener("resize", frame);
  frame();
}

/** Fade elements in as they scroll into view. Only elements below the fold start hidden,
 *  so the first screen is complete at rest. */
export function revealOnScroll(selector: string): void {
  if (reducedMotion() || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement;
    el.classList.remove("pend");
    io.unobserve(el);
    setTimeout(() => el.style.removeProperty("--d"), 900);
  }), { rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.classList.add("rv");
    if (el.getBoundingClientRect().top <= innerHeight) return;
    const idx = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.style.setProperty("--d", `${Math.min(idx, 5) * 80}ms`);
    el.classList.add("pend");
    io.observe(el);
  });
}
