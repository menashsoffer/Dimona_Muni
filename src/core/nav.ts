// The nav bar shared by every page.
// To add a page: create <name>.html (copy quiz.html), add it to vite.config.ts, and add one entry here.

interface NavItem {
  label: string;
  anchor?: string; // a section of the home page
  page?: string;
  href?: string;
  feature?: boolean;
}

export const PAGES: NavItem[] = [
  { label: "עכשיו", anchor: "now" },
  { label: "לו\"ז", anchor: "schedule" },
  { label: "הגעה", anchor: "arrive" },
  { label: "אנשים", anchor: "people" },
  { label: "קבוצות", anchor: "groups" },
  { label: "דימונה", anchor: "city" },
  { label: "חידון דימונה", page: "quiz", href: "quiz.html", feature: true },
];

export function renderNav(current: "home" | "quiz"): void {
  const nav = document.getElementById("nav");
  if (!nav) return;
  nav.innerHTML = PAGES.map((p) => {
    const href = p.anchor ? (current === "home" ? `#${p.anchor}` : `index.html#${p.anchor}`) : p.href;
    const cls = p.feature ? ' class="feature"' : "";
    const cur = p.page === current ? ' aria-current="page"' : "";
    return `<a href="${href}"${cls}${cur}>${p.label}</a>`;
  }).join("");
  // Keep the current page's tab visible on narrow screens.
  const active = nav.querySelector("[aria-current]");
  if (active) nav.scrollLeft += active.getBoundingClientRect().left - nav.getBoundingClientRect().left - 8;
}
