/**
 * A short, celebratory confetti burst fired from a click point — the
 * payoff for tapping a WhatsApp CTA. One shared full-viewport canvas,
 * created lazily on first use and reused after; each burst is a fixed
 * batch of particles with gravity, so the effect self-terminates in
 * about a second with no ongoing cost. No-op under reduced motion.
 */

const PALETTE = ["#E8453C", "#F5A623", "#F7D51D", "#6FBE44", "#3E8FE0", "#B15FE0", "#F0699A"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vrot: number;
  life: number; // 0..1, counts down
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let pieces: Piece[] = [];
let rafId = 0;
let dpr = 1;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "300";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize, { passive: true });
}

function resize() {
  if (!canvas || !ctx) return;
  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function tick() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  let alive = false;
  for (const p of pieces) {
    if (p.life <= 0) continue;
    alive = true;
    p.vy += 0.55; // gravity
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;
    p.life -= 0.016;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }

  if (alive) {
    rafId = requestAnimationFrame(tick);
  } else {
    pieces = [];
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    rafId = 0;
  }
}

export function burstConfettiAt(x: number, y: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ensureCanvas();

  const count = 28;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = 4 + Math.random() * 6;
    pieces.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3, // initial upward kick
      size: 6 + Math.random() * 6,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.4,
      life: 1,
    });
  }

  if (!rafId) rafId = requestAnimationFrame(tick);
}

/** Wire a burst-on-click to every element matching selector, originating
 *  from the click point. Does not interfere with the element's default
 *  action (e.g. a WhatsApp link still opens normally). */
export function initConfettiBurstOn(selector: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.addEventListener("click", (e) => {
      burstConfettiAt(e.clientX, e.clientY);
    });
  });
}
