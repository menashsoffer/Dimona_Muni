// The group form page: form.html?g=<group number>.
import "../styles/site.css";
import "../features/groupform/form.css";

import { byId } from "../core/dom.ts";
import { renderNav } from "../core/nav.ts";
import { mountGroupForm } from "../features/groupform/form.ts";
import { mountSun } from "../features/sun/sun.ts";

renderNav("groups");
mountSun();
mountGroupForm(byId("gform"));
