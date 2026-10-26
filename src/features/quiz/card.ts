// The result as a picture to share: a 1080×1350 sunset card (the site's sky, sun and dunes) with
// the score, the ending line and the event, drawn on a canvas in the site's fonts.
const W = 1080;
const H = 1350;

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((done) => {
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = () => done(null);
    img.src = src;
  });
}

/** Wrap `text` to lines no wider than `max`, for a right-to-left canvas. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export async function resultCard(score: number, total: number, ending: string): Promise<Blob | null> {
  await Promise.all([
    document.fonts.load('700 200px "Karantina"'),
    document.fonts.load('800 40px "Assistant"'),
    document.fonts.load('600 40px "Assistant"'),
  ]).catch(() => undefined);
  const [tz, dm] = await Promise.all([loadImage("assets/logo-tzoarim.png"), loadImage("assets/logo-dimona.png")]);

  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.direction = "rtl";

  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#ffe1a0"); sky.addColorStop(0.55, "#ffb066"); sky.addColorStop(1, "#f07a45");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  // Sun with its halo, low on the left, setting into the dunes.
  const sx = 250, sy = 1030;
  const halo = ctx.createRadialGradient(sx, sy, 40, sx, sy, 420);
  halo.addColorStop(0, "rgba(255,196,107,.75)"); halo.addColorStop(0.4, "rgba(255,154,77,.3)"); halo.addColorStop(1, "rgba(255,154,77,0)");
  ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
  const disc = ctx.createRadialGradient(sx, sy, 0, sx, sy, 130);
  disc.addColorStop(0, "#fff1c9"); disc.addColorStop(0.6, "#ffb25e"); disc.addColorStop(1, "#f2552a");
  ctx.fillStyle = disc; ctx.beginPath(); ctx.arc(sx, sy, 130, 0, Math.PI * 2); ctx.fill();

  // Dunes, the same curves as the site's hero.
  const dune = (path: string, fill: string, alpha = 1): void => {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = fill;
    ctx.translate(0, 960); ctx.scale(W / 600, 4); ctx.fill(new Path2D(path)); ctx.restore();
  };
  dune("M0 44 C120 12 220 66 340 38 S520 22 600 40 V220 H0Z", "#f07a45", 0.6);
  dune("M0 62 C140 40 260 78 400 56 S540 48 600 60 V220 H0Z", "#9c3f1c");

  // Logos on a glass strip, as on the site.
  ctx.fillStyle = "rgba(255,252,246,.62)";
  ctx.beginPath(); ctx.roundRect(60, 56, W - 120, 150, 36); ctx.fill();
  if (tz) { const h = 104, w = (tz.width / tz.height) * h; ctx.drawImage(tz, W - 100 - w, 79, w, h); }
  if (dm) { const h = 110, w = (dm.width / dm.height) * h; ctx.drawImage(dm, 100, 76, w, h); }

  const ink = "#3a1d0e";
  ctx.textAlign = "right";
  ctx.fillStyle = ink;
  ctx.font = '700 150px "Karantina", "Assistant", sans-serif';
  ctx.fillText("מכירים את דימונה?", W - 80, 380);

  // The score, big, with a smaller "/ 13" after it (drawn left to right).
  const big = '700 380px "Karantina", "Assistant", sans-serif';
  const small = '700 170px "Karantina", "Assistant", sans-serif';
  const of = ` / ${total}`;
  ctx.direction = "ltr";
  ctx.font = small;
  const ofW = ctx.measureText(of).width;
  ctx.fillStyle = "rgba(58,29,14,.55)";
  ctx.fillText(of, W - 80, 720);
  ctx.font = big;
  ctx.fillStyle = "#9c3f1c";
  ctx.fillText(String(score), W - 80 - ofW, 720);
  ctx.direction = "rtl";

  ctx.fillStyle = ink;
  ctx.font = '800 50px "Assistant", sans-serif';
  wrap(ctx, ending, W - 160).slice(0, 2).forEach((l, i) => ctx.fillText(l, W - 80, 820 + i * 66));

  // Event line on the dark dune.
  ctx.fillStyle = "#fff6e8";
  ctx.font = '800 46px "Assistant", sans-serif';
  ctx.fillText("מהפניה לתובנה · יום עיון", W - 80, 1228);
  ctx.font = '600 38px "Assistant", sans-serif';
  ctx.fillStyle = "#ffe1a0";
  ctx.fillText("15.11.2026 · עיריית דימונה · מי עוקף אותי?", W - 80, 1292);

  return new Promise((done) => c.toBlob(done, "image/png"));
}
