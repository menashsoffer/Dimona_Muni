// Small DOM helpers shared by every page.

/** Element by id; throws if the page is missing it, so markup and code stay in step. */
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
}

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

/** Escape text for use inside an HTML template string. */
export const esc = (s: string | number): string => String(s).replace(/[&<>"]/g, (c) => ENTITIES[c]);
