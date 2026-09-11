/**
 * Cursor-parallax for the hero's decorative layer: each floating element
 * carries a `data-depth` multiplier, and moves a fraction of the pointer's
 * offset from center scaled by that depth — nearer/"closer" elements move
 * further, giving a real sense of layered 3D space from pure 2D transforms.
 * Fine-pointer only (no persistent hover on touch); respects
 * prefers-reduced-motion by never starting at all.
 */
export function initParallax() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const hero = document.querySelector<HTMLElement>(".hero");
  const layers = document.querySelectorAll<HTMLElement>(".hero-decor .parallax-layer");
  if (!hero || !layers.length) return;

  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let raf = 0;
  let running = false;

  hero.addEventListener(
    "pointermove",
    (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    },
    { passive: true }
  );

  hero.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  });

  const loop = () => {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;

    layers.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "1");
      el.style.setProperty("--parallax-x", `${(curX * depth * 14).toFixed(2)}px`);
      el.style.setProperty("--parallax-y", `${(curY * depth * 10).toFixed(2)}px`);
    });

    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();
}
