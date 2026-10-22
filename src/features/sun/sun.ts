// A sun that rises on the right (east) as the page starts, climbs overhead mid-page
// and sets on the left at the bottom, warming as it nears the horizon.
import "./sun.css";

const reducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function mountSun(): void {
  const sun = document.createElement("div");
  sun.className = "sun";
  sun.setAttribute("aria-hidden", "true");
  sun.innerHTML = '<span class="sun-halo"></span><span class="sun-disc"></span>';
  document.body.prepend(sun);

  const root = document.documentElement;
  let queued = false;

  // It rises from behind the hero dunes and sets low on the left at the bottom of the page.
  const hero = document.querySelector<HTMLElement>(".hero");
  let riseY = 0;
  const measure = (): void => {
    riseY = hero ? hero.offsetTop + hero.offsetHeight - 36 : innerHeight * 0.7;
  };

  function place(p: number): void {
    const elevation = Math.sin(Math.PI * p); // 0 at the horizon, 1 overhead
    const horizon = riseY + (innerHeight * 0.95 - riseY) * p;
    const y = horizon - (horizon - innerHeight * 0.16) * elevation;
    const x = innerWidth * (0.86 - 0.72 * p);
    sun.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    sun.style.setProperty("--e", elevation.toFixed(3));
  }

  measure();
  if (reducedMotion()) { place(0.3); return; }

  function frame(): void {
    queued = false;
    const max = Math.max(1, root.scrollHeight - innerHeight);
    place(Math.min(1, Math.max(0, scrollY / max)));
  }
  addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(frame); }
  }, { passive: true });
  addEventListener("resize", () => { measure(); frame(); });
  frame();
}
