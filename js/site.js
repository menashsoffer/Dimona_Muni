// Shared behavior for every page: the nav bar and the scroll effects.
// To add a page: create <name>.html (copy quiz.html as a starting point) and add one entry here.
// Entries with `anchor` point at a section of the home page.

export const PAGES = [
  { label: "עכשיו", anchor: "now" },
  { label: "לו\"ז", anchor: "schedule" },
  { label: "הגעה", anchor: "arrive" },
  { label: "אנשים", anchor: "people" },
  { label: "קבוצות", anchor: "groups" },
  { label: "דימונה", anchor: "city" },
  { label: "חידון דימונה", page: "quiz", href: "quiz.html", feature: true },
];

export function renderNav(current) {
  const nav = document.getElementById("nav");
  if (!nav) return;
  nav.innerHTML = PAGES.map(p => {
    const href = p.anchor ? (current === "home" ? `#${p.anchor}` : `index.html#${p.anchor}`) : p.href;
    const attrs = [p.feature ? 'class="feature"' : "", p.page === current ? 'aria-current="page"' : ""].join(" ");
    return `<a href="${href}" ${attrs}>${p.label}</a>`;
  }).join("");
  // Keep the current page's tab visible on narrow screens.
  const cur = nav.querySelector("[aria-current]");
  if (cur) nav.scrollLeft += cur.getBoundingClientRect().left - nav.getBoundingClientRect().left - 8;
}

// Scroll progress (--pp), hero parallax, and reveal-on-scroll. `onFrame` runs on every scroll frame.
export function scrollEffects({ onFrame, reveal = "main h2,main .lead,.card" } = {}) {
  const root = document.documentElement, RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero"), hin = hero?.querySelector(".in");
  const d1 = document.getElementById("dune1"), d2 = document.getElementById("dune2");
  let ticking = false;
  function frame() {
    ticking = false;
    const sy = scrollY, max = Math.max(1, root.scrollHeight - innerHeight);
    root.style.setProperty("--pp", (Math.min(1, sy / max) * 100).toFixed(1) + "%");
    if (!RM && hero && sy < hero.offsetHeight + 50) {
      hin.style.transform = `translateY(${sy * .35}px)`;
      hin.style.opacity = Math.max(0, 1 - sy / (hero.offsetHeight * .9)).toFixed(2);
      if (d1) d1.style.transform = `translateY(${-sy * .12}px)`;
      if (d2) d2.style.transform = `translateY(${-sy * .04}px)`;
    }
    onFrame?.();
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame) } }, { passive: true });
  addEventListener("resize", frame);
  frame();
  if (RM || !("IntersectionObserver" in window)) return frame;
  // Only elements below the fold start hidden, so the first screen is complete at rest.
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.remove("pend"); io.unobserve(el);
    setTimeout(() => el.style.removeProperty("--d"), 900);
  }), { rootMargin: "0px 0px -8% 0px" });
  if (reveal) document.querySelectorAll(reveal).forEach(el => {
    el.classList.add("rv");
    if (el.getBoundingClientRect().top > innerHeight) {
      const idx = [...el.parentElement.children].indexOf(el);
      el.style.setProperty("--d", Math.min(idx, 5) * 80 + "ms"); el.classList.add("pend"); io.observe(el);
    }
  });
  return frame;
}

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
