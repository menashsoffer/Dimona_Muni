// The nav bar shared by every page.
import { view } from "./scroll.ts";
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
  { label: "דימונה", anchor: "city" },
  { label: "אנשים", page: "people", href: "people.html" },
  { label: "קבוצות", page: "groups", href: "groups.html" },
  { label: "חידון דימונה", page: "quiz", href: "quiz.html", feature: true },
];

export type PageName = "home" | "people" | "groups" | "quiz";

export function renderNav(current: PageName): void {
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

/** Home page: light up the tab of the section the visitor is in, and keep it in view. */
export function spyNav(): () => void {
  const nav = document.getElementById("nav");
  const tabs = PAGES.filter((p) => p.anchor).map((p) => ({
    link: nav?.querySelector<HTMLAnchorElement>(`a[href="#${p.anchor}"]`),
    section: document.getElementById(p.anchor ?? ""),
  }));
  let lit: HTMLAnchorElement | null | undefined;
  return () => {
    const { top, bottom } = view();
    const line = top + (document.querySelector("nav")?.offsetHeight ?? 0) + (bottom - top) * 0.3;
    let cur = tabs[0];
    for (const t of tabs) if (t.section && t.section.getBoundingClientRect().top <= line) cur = t;
    // At the very end of the page the last section may never reach the line; it is the one in view.
    if (bottom >= document.documentElement.getBoundingClientRect().bottom - 12) cur = tabs[tabs.length - 1];
    if (!nav || !cur?.link || cur.link === lit) return;
    lit?.removeAttribute("aria-current");
    cur.link.setAttribute("aria-current", "location");
    lit = cur.link;
    nav.scrollTo({ left: nav.scrollLeft + cur.link.getBoundingClientRect().left - nav.getBoundingClientRect().left - 8, behavior: "smooth" });
  };
}
