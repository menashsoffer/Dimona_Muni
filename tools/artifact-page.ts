// Turns the built site (dist/) into a page for the claude.ai Artifact.
// The Artifact host adds its own <!doctype>, <html>, <head> and <body>, so the published page
// keeps only what is inside them. Everything else in dist/ is published unchanged next to it.
// Usage: npm run artifact  →  writes dist-artifact/index.html
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("dist/index.html", "utf8");
const pick = (tag: string): string => src.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";

const head = pick("head").replace(/<meta (charset|name="viewport")[^>]*>\n?/g, "");
// The host's <html> has no lang/dir, so set them from the page.
const lang = `<script>document.documentElement.lang="he";document.documentElement.dir="rtl";</script>`;

mkdirSync("dist-artifact", { recursive: true });
writeFileSync("dist-artifact/index.html", `${head.trim()}\n${lang}\n${pick("body").trim()}\n`);
console.log("wrote dist-artifact/index.html");
