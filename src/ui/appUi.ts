function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function initReveal() {
  const targets = document.querySelectorAll(".reveal-up, .class-card, .craft-card");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  targets.forEach((t) => io.observe(t));

  // Safety net: this reveal exists purely for a fade-up flourish, not to
  // gate real content — if the observer ever misses an element for any
  // reason (a fast fling-scroll, an odd embedding context, a browser
  // quirk), that content must not stay invisible forever. Force everything
  // visible a few seconds after load regardless of intersection state.
  window.setTimeout(() => {
    targets.forEach((t) => t.classList.add("is-visible"));
    io.disconnect();
  }, 2500);
}

function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

export function initAppUi() {
  document.documentElement.classList.add("js-ready");
  initNav();
  initReveal();
  initFooterYear();
}
