/**
 * Shows the sticky "Enrol Now" bar once the hero has scrolled out of view,
 * and hides it again once the footer (which already has the phone number
 * and address) scrolls into view — so it's never competing with the hero's
 * own CTA, and never overlapping the footer. Two IntersectionObservers
 * instead of a scroll listener, since it only needs to react at two
 * boundaries, not track continuous position.
 *
 * While the bar is visible, the floating WhatsApp button steps aside too,
 * so there's never two overlapping WhatsApp affordances on screen.
 */
export function initEnrolBar() {
  const bar = document.getElementById("enrol-bar");
  const hero = document.getElementById("top");
  const footer = document.querySelector(".site-footer");
  const fab = document.querySelector<HTMLElement>(".whatsapp-fab");
  if (!bar || !hero || !footer) return;

  let heroVisible = true;
  let footerVisible = false;

  const sync = () => {
    const show = !heroVisible && !footerVisible;
    bar.classList.toggle("is-visible", show);
    fab?.classList.toggle("is-hidden", show);
  };

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
      sync();
    },
    { threshold: 0 }
  );

  const footerObserver = new IntersectionObserver(
    ([entry]) => {
      footerVisible = entry.isIntersecting;
      sync();
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );

  heroObserver.observe(hero);
  footerObserver.observe(footer);
}
