/**
 * Cursor-tracked 3D tilt for card elements — the card rotates toward the
 * pointer within a perspective, like picking up a sticker off the page.
 * Fine-pointer only; a no-op (never wired up) under reduced motion.
 */
export function initTilt(selector: string, strength = 10) {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll<HTMLElement>(selector).forEach((card) => {
    const inner = card.querySelector<HTMLElement>("[data-tilt-inner]") || card;
    // Some cards (the scrapbook gallery) carry a static resting rotation via
    // --craft-rotate; blend it in so hover adds cursor-tilt on top instead
    // of snapping the card flat.
    const baseRotate = getComputedStyle(inner).getPropertyValue("--craft-rotate").trim() || "0deg";
    let raf = 0;

    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        inner.style.transform = `rotate(${baseRotate}) rotateY(${px * strength * 2}deg) rotateX(${-py * strength * 2}deg) translateZ(10px)`;
      });
    });

    card.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      inner.style.transform = "";
    });
  });
}
