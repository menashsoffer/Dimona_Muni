// Reads the group form's answers from the public CSV of its Google Sheet.
import { GROUPS } from "../../content/people.ts";

export interface Answers {
  group: number; // index into GROUPS
  presenter: string;
  members: string;
  role: string;
  project: string;
  surprise: string;
  learned: string[];
  take: string;
  open: string;
  request: string;
  insight: string;
}

// Which form question fills which field: a phrase from the question's title.
const FIELDS: Record<Exclude<keyof Answers, "group" | "learned">, string> = {
  presenter: "מי מציג",
  members: "חברי הקבוצה",
  role: "התפקיד שלו",
  project: "פרויקט או אתגר",
  surprise: "שהפתיע",
  take: "רעיון או כלי",
  open: "נשארה פתוחה",
  request: "פניה של תושב",
  insight: "התובנה",
};

/** Minimal CSV parser: quoted cells, doubled quotes and line breaks inside cells. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

/** The latest answers of each group, by group index. Later rows (newer, or edited) win. */
export function toAnswers(rows: string[][]): Map<number, Answers> {
  const [head = [], ...body] = rows;
  const col = (phrase: string) => head.findIndex((h) => h.includes(phrase));
  const groupCol = col("עם מי ישבנו");
  const learnedCols = ["(א)", "(ב)", "(ג)"].map((x) => col("למדנו " + x));
  const out = new Map<number, Answers>();
  for (const r of body) {
    const choice = (r[groupCol] ?? "").trim();
    const group = GROUPS.findIndex((g) => choice.startsWith(g.lead));
    if (group < 0) continue;
    const a = { group, learned: learnedCols.map((i) => (r[i] ?? "").trim()).filter(Boolean) } as Answers;
    for (const [key, phrase] of Object.entries(FIELDS)) {
      const i = col(phrase);
      (a as unknown as Record<string, string>)[key] = i < 0 ? "" : (r[i] ?? "").trim();
    }
    out.set(group, a);
  }
  return out;
}

export async function loadAnswers(sheetId: string): Promise<Map<number, Answers>> {
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?tqx=out:csv&t=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`sheet ${res.status}`);
  return toAnswers(parseCsv(await res.text()));
}
