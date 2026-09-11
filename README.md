# Creative Club — Keeping Art Alive

Website for Creative Club, a kids' art studio in Ranchi teaching Drawing,
Sketching, Coloring and Painting to children aged 5–15. Built to match the
studio's own flyer: warm, bright, and unmistakably for kids — no dark
"tech" aesthetic, no heavy 3D.

## Stack

- **Vite + TypeScript**, no UI framework — the whole site ships as ~3 KB of
  gzipped JS, so it loads instantly even on a slow phone connection.
- **Plain CSS** — palette, layout and animation in `src/style.css`, no
  Tailwind/utility framework.
- A lightweight 2D `<canvas>` background (`src/decor/confetti.ts`) draws a
  few dozen soft, drifting paint-drop circles. It's plain Canvas 2D, not
  WebGL — there's no GPU/shader cost, so it's safe on any device.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, then outputs to dist/
npm run preview   # serve the production build locally
```

## Content that's real vs. placeholder

**Real, from the studio's flyer:**
- Brand name, tagline ("Keeping Art Alive"), and the four disciplines taught
- Age range (5–15)
- Address (HLCCS, Harmu Argora By-pass Road, Puran Vihar, Ranchi,
  Jharkhand 834002) — wired into an embedded Google Map in `index.html`
- WhatsApp / phone number (91530-83959) — wired into the `wa.me` links,
  the `tel:` links, and the floating WhatsApp button

**Placeholder, meant to be swapped:**
- The "What your child will create" gallery (`src/ui/gallery.ts`) uses
  CSS-generated textures standing in for each medium (watercolor, pencil,
  crayon, poster). Replace `background` in each `CraftPiece` with a real
  photo of student work once available.
- The "Why Creative Club" value props and class descriptions are
  reasonable studio-voice marketing copy, not sourced from the studio —
  review and adjust wording to taste.
- No class timings or fees are stated anywhere (the CTA points people to
  WhatsApp for that) since none were provided.

## Structure

```
src/
  main.ts              entry point — boots the confetti background + UI
  style.css              design tokens, layout, all styling
  decor/
    confetti.ts           lightweight 2D canvas paint-drop background
  ui/
    appUi.ts               nav (incl. mobile menu), scroll-reveal
    classes.ts              the four class cards (Drawing/Sketching/Coloring/Painting)
    gallery.ts               "what your child will create" medium cards
```

## Performance & accessibility notes

- No WebGL, no particle shaders, one small JS bundle — this was a deliberate
  simplification for the audience (parents checking a class listing on a
  phone), not a scaled-down version of something bigger.
- `prefers-reduced-motion` disables the confetti background and cuts all
  animation durations.
- Every anchor-nav target has `scroll-margin-top` so the sticky header
  never covers a section heading when you jump to it.
- The mobile menu, WhatsApp deep links, and `tel:` links are all real and
  tested (`wa.me/919153083959`, `tel:+919153083959`).
