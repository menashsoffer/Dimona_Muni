import { defineConfig } from "vite";

// Relative base so the same build works on GitHub Pages (/Dimona_Muni/) and as a claude.ai Artifact.
export default defineConfig({
  base: "./",
  build: {
    assetsDir: "static",
    rollupOptions: { input: { index: "index.html", people: "people.html", groups: "groups.html", quiz: "quiz.html" } },
  },
});
