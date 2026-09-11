/**
 * The class cards flip via CSS :hover on devices with a real pointer
 * (see .class-card:hover in style.css). Touch devices have no hover, so
 * this wires a tap to toggle the same flipped state via a class instead.
 */
export function initFlipCards(selector: string) {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouch) return;

  document.querySelectorAll<HTMLElement>(selector).forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });
}
