// The group form inside the site: one step at a time, draft kept on the phone, sent to the Google Form.
// Sending again is fine: the plenary screen shows each group's latest answers.
import { GROUP_FORM as F } from "../../content/groupform.ts";
import { CADETS } from "../../content/cadets.ts";
import { GROUPS } from "../../content/people.ts";
import { PREP } from "../../content/prep.ts";
import { esc } from "../../core/dom.ts";

type Draft = Record<string, string>;

const key = (g: number) => `groupform-${g}`;
function loadDraft(g: number): Draft {
  try { return JSON.parse(localStorage.getItem(key(g)) ?? "{}") as Draft; } catch { return {}; }
}
function saveDraft(g: number, d: Draft): void {
  try { localStorage.setItem(key(g), JSON.stringify(d)); } catch { /* private mode: no draft */ }
}

function pickGroup(root: HTMLElement): void {
  root.innerHTML = `<div class="gf-card"><h2>איזו קבוצה אתם?</h2><div class="gf-pick">${GROUPS.map((g, i) =>
    `<a class="gf-group" href="?g=${i + 1}"><span>קבוצה ${i + 1}</span><b>${esc(g.lead)}</b><small>${esc(g.role)}</small></a>`).join("")}</div></div>`;
}

export function mountGroupForm(root: HTMLElement): void {
  const g = Number(new URLSearchParams(location.search).get("g")) - 1;
  if (!(g >= 0 && g < GROUPS.length)) return pickGroup(root);
  const draft = loadDraft(g);
  let step = 0;

  const render = (sent = false) => {
    if (sent) {
      root.innerHTML = `<div class="gf-card gf-done"><div class="gf-sun" aria-hidden="true"></div><h2>נשלח!</h2>
        <p>התשובות שלכם יעלו על המסך במליאה ב-12:30, ותציגו מהן.</p>
        <button class="btn ghost" type="button" data-act="edit">לתקן משהו ולשלוח שוב</button></div>`;
      return;
    }
    const s = F.steps[step];
    const last = step === F.steps.length - 1;
    root.innerHTML = `
      <div class="gf-head"><span class="gf-kicker">קבוצה ${g + 1} · ${esc(GROUPS[g].lead)}</span>
        <ol class="gf-dots" aria-label="שלב ${step + 1} מתוך ${F.steps.length}">${F.steps.map((_, k) =>
          `<li class="${k < step ? "done" : k === step ? "on" : ""}"></li>`).join("")}</ol></div>
      ${PREP[g] ? `<p class="gf-q"><b>${esc(PREP[g].tagline)}:</b> ${esc(PREP[g].question)} <a href="group.html?g=${g + 1}">לחומר ההכנה</a></p>` : ""}
      <form class="gf-card" novalidate>
        <h2><i>${step + 1}</i>${esc(s.title)}</h2>${s.say ? `<p class="gf-say">${esc(s.say)}</p>` : ""}
        ${s.fields.map((f, k) => {
          const id = `f${k}`, v = esc(draft[f.label] ?? "");
          const title = `<span>${esc(f.label)}${f.required ? " <em>*</em>" : ""}</span>`;
          if (f.pick === "many") {
            const chosen = new Set((draft[f.label] ?? "").split(", "));
            return `<fieldset class="gf-field" id="${id}"><legend>${title}</legend><div class="gf-chips">${CADETS.map((c) =>
              `<label class="gf-chip"><input type="checkbox" value="${esc(c)}"${chosen.has(c) ? " checked" : ""}><span>${esc(c)}</span></label>`).join("")}</div></fieldset>`;
          }
          const input = f.pick === "one"
            ? `<select id="${id}"><option value="">בחרו מהרשימה</option>${CADETS.map((c) => `<option${draft[f.label] === c ? " selected" : ""}>${esc(c)}</option>`).join("")}</select>`
            : f.long ? `<textarea id="${id}" rows="3">${v}</textarea>` : `<input id="${id}" value="${v}" autocomplete="off">`;
          return `<label class="gf-field" for="${id}">${title}${input}</label>`;
        }).join("")}
        <p class="gf-err" hidden></p>
        <div class="gf-nav">
          ${step > 0 ? `<button class="btn ghost" type="button" data-act="back">חזרה</button>` : "<span></span>"}
          <button class="btn" type="submit">${last ? "שליחה למליאה" : "הבא"}</button>
        </div>
      </form>`;
    const form = root.querySelector("form")!;
    form.addEventListener("input", (e) => {
      const el = e.target as HTMLInputElement;
      const box = el.type === "checkbox" ? el.closest<HTMLElement>("fieldset") : el;
      const f = box ? s.fields[Number(box.id.slice(1))] : undefined;
      if (!f || !box) return;
      draft[f.label] = el.type === "checkbox"
        ? [...box.querySelectorAll<HTMLInputElement>("input:checked")].map((c) => c.value).join(", ")
        : el.value;
      saveDraft(g, draft);
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); void next(form); });
    (form.querySelector("input,textarea") as HTMLElement | null)?.focus({ preventScroll: true });
  };

  const next = async (form: HTMLFormElement) => {
    const s = F.steps[step];
    const err = form.querySelector<HTMLElement>(".gf-err")!;
    const missing = s.fields.filter((f) => f.required && !(draft[f.label] ?? "").trim());
    if (missing.length) { err.textContent = `חסר: ${missing.map((f) => f.label).join(", ")}`; err.hidden = false; return; }
    if (step < F.steps.length - 1) { step++; render(); scrollTo({ top: 0, behavior: "smooth" }); return; }
    const body = new URLSearchParams({ [F.group]: F.choices[g] });
    for (const st of F.steps) for (const f of st.fields) if (f.entry) body.set(f.entry, (draft[f.label] ?? "").trim());
    const btn = form.querySelector<HTMLButtonElement>("[type=submit]")!;
    btn.disabled = true; btn.textContent = "שולח...";
    try {
      // Google Forms answers without CORS headers, so the reply can't be read; a network error still throws.
      await fetch(F.action, { method: "POST", mode: "no-cors", body });
      render(true);
      scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      err.textContent = "לא הצלחנו לשלוח. בדקו את החיבור ונסו שוב, התשובות שמורות."; err.hidden = false;
      btn.disabled = false; btn.textContent = "שליחה למליאה";
    }
  };

  root.addEventListener("click", (e) => {
    const act = (e.target as HTMLElement).closest<HTMLElement>("[data-act]")?.dataset.act;
    if (act === "back") { step--; render(); }
    if (act === "edit") { step = 0; render(); }
  });
  render();
}
