// Sources the quiz answers were checked against.
import type { Source } from "./types.ts";

export const SRC = {
  wiki: { label: "ויקיפדיה: Dimona", url: "https://en.wikipedia.org/wiki/Dimona" },
  jvl: { label: "Jewish Virtual Library: Dimona", url: "https://www.jewishvirtuallibrary.org/dimona" },
  britannica: { label: "אנציקלופדיה בריטניקה: Dimona", url: "https://www.britannica.com/place/Dimona" },
  nli: { label: "הספרייה הלאומית: The Black Hebrew Exodus, 50 Years On", url: "https://blog.nli.org.il/en/?p=67765" },
  unesco: { label: "אונסק\"ו: Incense Route, Desert Cities in the Negev", url: "https://whc.unesco.org/en/list/1107" },
  mampsis: { label: "ויקיפדיה: Mampsis", url: "https://en.wikipedia.org/wiki/Mampsis" },
  indianJews: { label: "ויקיפדיה: Indian Jews in Israel", url: "https://en.wikipedia.org/wiki/Indian_Jews_in_Israel" },
  muni2023: { label: "עיריית דימונה: דבר ראש העיר, תוכנית העבודה 2023", url: "https://www.dimona.muni.il/uploads/n/1726051096.5904.pdf" },
} satisfies Record<string, Source>;
