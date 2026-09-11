/**
 * A very light ambient background: a few dozen soft, translucent paint-drop
 * circles drifting slowly upward and swaying side to side. Plain 2D canvas
 * (no WebGL context, no shaders) — cheap enough to run on any phone, and
 * intentionally low-opacity/low-count so it never competes with the text
 * sitting on top of it. Respects prefers-reduced-motion and pauses when the
 * tab isn't visible.
 */

interface Drop {
  x: number;
  y: number;
  r: number;
  color: string;
  vy: number;
  swaySpeed: number;
  swayAmount: number;
  phase: number;
  alpha: number;
}

const PALETTE = ["#E8453C", "#F5A623", "#F7D51D", "#6FBE44", "#3E8FE0", "#B15FE0", "#F0699A"];

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export class Confetti {
  private ctx: CanvasRenderingContext2D | null;
  private drops: Drop[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private rafId = 0;
  private running = false;
  private lastTime = 0;
  private reducedMotion = prefersReducedMotion();
  private resizeTimer = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  private onResize = () => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.resize(), 150);
  };

  private onVisibility = () => {
    if (document.hidden) this.stop();
    else this.start();
  };

  private resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const targetCount = this.reducedMotion ? 0 : Math.min(34, Math.round((this.width * this.height) / 45000));
    this.drops = Array.from({ length: targetCount }, () => this.makeDrop(true));
  }

  private makeDrop(randomY: boolean): Drop {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20,
      r: 5 + Math.random() * 9,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      vy: 6 + Math.random() * 10, // px/sec upward
      swaySpeed: 0.3 + Math.random() * 0.5,
      swayAmount: 12 + Math.random() * 20,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.1 + Math.random() * 0.16,
    };
  }

  private tick = (now: number) => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.tick);
    if (!this.ctx) return;

    const dt = Math.min((now - (this.lastTime || now)) / 1000, 1 / 20);
    this.lastTime = now;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const d of this.drops) {
      d.y -= d.vy * dt;
      if (d.y < -20) {
        d.y = this.height + 20;
        d.x = Math.random() * this.width;
      }
      const x = d.x + Math.sin(now * 0.001 * d.swaySpeed + d.phase) * d.swayAmount;
      this.ctx.beginPath();
      this.ctx.fillStyle = d.color;
      this.ctx.globalAlpha = d.alpha;
      this.ctx.arc(x, d.y, d.r, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  };

  start() {
    if (this.running || this.reducedMotion) return;
    this.running = true;
    this.lastTime = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }
}
