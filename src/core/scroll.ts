// Scroll-driven effects shared by every page: the sky and nav progress (--pp) and the hero parallax.
// Page-specific effects hook in through `onFrame`.

export const reducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;
/** "smooth" unless the visitor asked for reduced motion. */
export const scrollBehavior = (): ScrollBehavior => (reducedMotion() ? "auto" : "smooth");

// The band of the page the visitor can see, in client coordinates. Normally that is the window.
// Some hosts (the Artifact viewer among them) can show the page in a frame that grows to the
// page's full height, so the window never scrolls and only the host does. An IntersectionObserver
// still reports which part of the frame is on screen, so effects follow that instead.
let band = { top: 0, bottom: innerHeight };
export const view = (): { top: number; bottom: number } => band;
const framed = (): boolean => document.documentElement.scrollHeight - innerHeight < 4;

// The observer only reports when an element's visible share changes, which a single tall target
// stops doing once the view sits fully inside it. So the page is tiled with thin, contiguous strips:
// as the host scrolls, the strips at the top and bottom edges of the view always change.
const STRIP = 200;

function watchBand(onChange: () => void): void {
  if (!("IntersectionObserver" in window)) return;
  const steps = Array.from({ length: 101 }, (_, i) => i / 100);
  const seen = new Map<Element, DOMRectReadOnly | null>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target, e.isIntersecting ? e.intersectionRect : null));
    if (!framed()) return;
    const rects = [...seen.values()].filter((r): r is DOMRectReadOnly => !!r && r.height > 0);
    if (!rects.length) return;
    band = { top: Math.min(...rects.map((r) => r.top)), bottom: Math.max(...rects.map((r) => r.bottom)) };
    onChange();
  }, { threshold: steps });

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  // Sized to the frame itself (inset:0 on the initial containing block) and clipped, so the strips
  // never make the page taller than its content.
  layer.style.cssText = "position:absolute;inset:0 auto 0 0;width:1px;overflow:hidden;pointer-events:none;opacity:0";
  document.body.append(layer);
  const tile = (): void => {
    if (!framed()) return;
    const need = Math.ceil(innerHeight / STRIP);
    for (let k = layer.children.length; k < need; k++) {
      const strip = document.createElement("div");
      strip.style.cssText = `position:absolute;left:0;width:1px;top:${k * STRIP}px;height:${STRIP}px`;
      layer.append(strip);
      io.observe(strip);
    }
  };
  tile();
  addEventListener("resize", tile);
}

/** Open at the top of the page, even if the browser or a host frame kept the last position. */
export function startAtTop(): void {
  if (location.hash) return;
  history.scrollRestoration = "manual";
  scrollTo(0, 0);
  if (framed()) document.body.scrollIntoView({ block: "start" });
}

export function scrollEffects(onFrame?: () => void): void {
  const root = document.documentElement;

  const hero = document.querySelector<HTMLElement>(".hero");
  const inner = hero?.querySelector<HTMLElement>(".in");
  const dunes = [document.getElementById("dune1"), document.getElementById("dune2")];
  const still = reducedMotion();
  let queued = false;

  function frame(): void {
    queued = false;
    if (!framed()) band = { top: 0, bottom: innerHeight };
    const span = band.bottom - band.top;
    const y = framed() ? band.top : scrollY;
    const max = Math.max(1, root.scrollHeight - span);
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
  watchBand(frame);
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
