// Swipe between pages: home → people → groups → quiz. In a right-to-left site the next page lies to
// the left, so dragging the finger rightward (pulling the next page in from the left) goes forward
// and dragging leftward goes back. A horizontal trackpad scroll does the same. While dragging, a
// tab at the screen edge names the page that will open; the page slides out, and the next one
// slides in from the side it came from.
import { reducedMotion } from "./scroll.ts";

const ORDER = [
  { page: "home", href: "index.html", label: "דף הבית" },
  { page: "people", href: "people.html", label: "אנשים" },
  { page: "groups", href: "groups.html", label: "קבוצות" },
  { page: "quiz", href: "quiz.html", label: "חידון" },
];
const KEY = "swipe-in";
const TRIGGER = 80; // px of drag that commits

export function swipePages(current: string): void {
  const at = ORDER.findIndex((p) => p.page === current);
  if (at < 0) return;
  arrive();
  // Coming back with the browser's Back button restores this page as it was left: mid slide-out.
  addEventListener("pageshow", (e) => {
    if (e.persisted) document.documentElement.classList.remove("swipe-out-right", "swipe-out-left");
  });

  const tab = document.createElement("div");
  tab.className = "swipe-tab";
  tab.setAttribute("aria-hidden", "true");
  document.body.append(tab);

  // dir +1 = forward (next page, arrives from the left), -1 = back.
  const target = (dir: number): (typeof ORDER)[number] | undefined => ORDER[at + dir];

  function show(dir: number, pull: number): void {
    const t = target(dir);
    if (!t || pull <= 0) { tab.classList.remove("on"); return; }
    tab.textContent = dir > 0 ? `${t.label} ←` : `→ ${t.label}`;
    tab.dataset.side = dir > 0 ? "left" : "right";
    tab.style.setProperty("--pull", Math.min(1, pull / TRIGGER).toFixed(2));
    tab.classList.add("on");
    tab.classList.toggle("ready", pull >= TRIGGER);
  }

  function go(dir: number): void {
    const t = target(dir);
    if (!t) return;
    try { sessionStorage.setItem(KEY, dir > 0 ? "left" : "right"); } catch { /* no storage: no slide-in */ }
    if (reducedMotion()) { location.href = t.href; return; }
    document.documentElement.classList.add(dir > 0 ? "swipe-out-right" : "swipe-out-left");
    setTimeout(() => (location.href = t.href), 220);
  }

  // Touch. Ignore drags that start in something that scrolls sideways itself (the nav tabs).
  let x0 = 0, y0 = 0, t0 = 0, live = false, dirLock = 0;
  addEventListener("touchstart", (e) => {
    const el = e.target as Element;
    live = e.touches.length === 1 && !el.closest("nav, iframe, input, textarea, [data-noswipe]");
    if (!live) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = performance.now(); dirLock = 0;
  }, { passive: true });
  addEventListener("touchmove", (e) => {
    if (!live) return;
    const dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
    if (!dirLock && Math.hypot(dx, dy) > 12) dirLock = Math.abs(dx) > Math.abs(dy) * 1.6 ? 1 : -1;
    if (dirLock !== 1) { show(0, 0); return; }
    show(dx > 0 ? 1 : -1, Math.abs(dx));
  }, { passive: true });
  addEventListener("touchend", (e) => {
    if (!live || dirLock !== 1) { show(0, 0); return; }
    const dx = e.changedTouches[0].clientX - x0;
    const fast = performance.now() - t0 < 300 && Math.abs(dx) > 40;
    show(0, 0);
    if (Math.abs(dx) >= TRIGGER || fast) go(dx > 0 ? 1 : -1);
  }, { passive: true });

  // Trackpad: a clearly horizontal scroll gesture, summed until it settles.
  let sum = 0, idle = 0;
  addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.6) return;
    if ((e.target as Element).closest("nav, [data-noswipe]")) return;
    sum -= e.deltaX; // deltaX < 0 is a rightward swipe on the pad: forward
    show(sum > 0 ? 1 : -1, Math.abs(sum));
    clearTimeout(idle);
    if (Math.abs(sum) >= TRIGGER * 1.5) { const d = sum > 0 ? 1 : -1; sum = 0; show(0, 0); go(d); return; }
    idle = window.setTimeout(() => { sum = 0; show(0, 0); }, 180);
  }, { passive: true });
}

/** Slide the page in from the side the swipe pulled it from. */
function arrive(): void {
  let from: string | null = null;
  try { from = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  if (!from || reducedMotion()) return;
  const root = document.documentElement;
  root.classList.add(`swipe-in-${from}`);
  setTimeout(() => root.classList.remove(`swipe-in-${from}`), 450);
}
