// Sunset confetti: paper strips, sand grains and little suns in the site's palette, drawn on one
// canvas over the page. Under reduced motion it does nothing.
import { reducedMotion } from "../../core/scroll.ts";

const COLORS = ["#f2a531", "#f07a45", "#d4602c", "#ffb066", "#ffe1a0", "#9c3f1c"];
type Kind = "strip" | "grain" | "sun";
interface Bit { x: number; y: number; vx: number; vy: number; spin: number; turn: number; size: number; color: string; kind: Kind; life: number }

let canvas: HTMLCanvasElement | null = null;
let bits: Bit[] = [];
let running = false;

function ensureCanvas(): CanvasRenderingContext2D | null {
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.className = "confetti";
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
  }
  const dpr = Math.min(2, devicePixelRatio || 1);
  if (canvas.width !== innerWidth * dpr || canvas.height !== innerHeight * dpr) {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  }
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function draw(ctx: CanvasRenderingContext2D, b: Bit): void {
  ctx.save();
  ctx.globalAlpha = Math.min(1, b.life / 30);
  ctx.translate(b.x, b.y);
  ctx.rotate(b.spin);
  ctx.fillStyle = b.color;
  if (b.kind === "strip") {
    // Flutter: the strip's width follows its turn, like paper flipping in the air.
    ctx.fillRect(-b.size / 2, (-b.size / 4) * Math.cos(b.turn), b.size, (b.size / 2) * Math.cos(b.turn));
  } else if (b.kind === "grain") {
    ctx.beginPath(); ctx.arc(0, 0, b.size / 3, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(0, 0, b.size / 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = b.color; ctx.lineWidth = 1.6;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * b.size * 0.5, Math.sin(a) * b.size * 0.5);
      ctx.lineTo(Math.cos(a) * b.size * 0.75, Math.sin(a) * b.size * 0.75); ctx.stroke();
    }
  }
  ctx.restore();
}

function loop(): void {
  const ctx = ensureCanvas();
  if (!ctx) return;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  bits = bits.filter((b) => b.life > 0 && b.y < innerHeight + 40);
  for (const b of bits) {
    b.vy += 0.22; b.vx *= 0.985; b.vy *= 0.985;
    b.x += b.vx; b.y += b.vy; b.spin += b.vx * 0.02; b.turn += 0.18; b.life -= 1;
    draw(ctx, b);
  }
  if (bits.length) requestAnimationFrame(loop);
  else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

/** Throw `count` bits from (x, y) in client coordinates, fanned around `angle` (radians, 0 = up). */
export function burst(x: number, y: number, count = 40, power = 9, angle = 0, spread = 1.1): void {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const a = angle + (Math.random() - 0.5) * spread * 2;
    const v = power * (0.55 + Math.random() * 0.6);
    const r = Math.random();
    bits.push({
      x, y, vx: Math.sin(a) * v, vy: -Math.cos(a) * v,
      spin: Math.random() * 6, turn: Math.random() * 6,
      size: 7 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      kind: r < 0.62 ? "strip" : r < 0.9 ? "grain" : "sun",
      life: 150 + Math.random() * 60,
    });
  }
  if (!running) { running = true; requestAnimationFrame(loop); }
}

/** A small pop of confetti from an element, for a right answer. */
export function popFrom(el: Element): void {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 26, 7, 0, 1.3);
}

/** The finale: two cannons from the bottom corners, then a second wave. Stronger for a higher score. */
export function celebrate(strength: number): void {
  const n = Math.round(50 + 90 * strength);
  const fire = (): void => {
    burst(0, innerHeight, n / 2, 15 + 5 * strength, 0.55, 0.35);
    burst(innerWidth, innerHeight, n / 2, 15 + 5 * strength, -0.55, 0.35);
  };
  fire();
  if (strength > 0.5) setTimeout(fire, 450);
}
