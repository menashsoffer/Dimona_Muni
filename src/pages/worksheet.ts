// Group worksheet page (linked from the groups page; printable).
import "../styles/site.css";
import "../features/worksheet/worksheet.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { mountSun } from "../features/sun/sun.ts";
import { renderSheets } from "../features/worksheet/sheet.ts";

renderNav("groups");
mountSun();
renderSheets(byId("sheets"));
byId("print").addEventListener("click", () => window.print());
