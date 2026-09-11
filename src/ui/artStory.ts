/**
 * Drives the pinned "pencil draws, brush paints" scroll story. Progress
 * (0..1) is derived from how far the tall wrapper section has scrolled
 * past the viewport, and mapped onto a few overlapping phases:
 *
 *   pencil pops in -> line gets "drawn" via stroke-dashoffset, pencil
 *   travels along a few hand-picked waypoints roughly tracing the curve
 *   -> paint blobs pop in one by one, a brush icon hopping to each ->
 *   caption settles in.
 *
 * Everything here is either a transform, an opacity, or an SVG
 * stroke-dashoffset — no layout-triggering properties — so it's cheap to
 * update every scroll frame even on modest hardware.
 */

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function remap(v: number, a: number, b: number): number {
  return clamp01((v - a) / (b - a));
}

// Rough waypoints (in % of the easel's width/height) tracing the sketch
// line's general shape, for the pencil icon to travel along.
const PENCIL_PATH: [number, number][] = [
  [18.75, 57.7],
  [31.25, 26.9],
  [50, 42.3],
  [68.75, 57.7],
  [81.25, 30.8],
];

function lerpAlong(points: [number, number][], t: number): [number, number] {
  const segCount = points.length - 1;
  const scaled = Math.min(t, 0.999) * segCount;
  const i = Math.floor(scaled);
  const localT = scaled - i;
  const [x1, y1] = points[i];
  const [x2, y2] = points[Math.min(i + 1, segCount)];
  return [x1 + (x2 - x1) * localT, y1 + (y2 - y1) * localT];
}

export function initArtStory() {
  const section = document.getElementById("art-story");
  const path = document.getElementById("art-story-line") as SVGPathElement | null;
  if (!section || !path) return;

  const pencil = section.querySelector<HTMLElement>(".art-story-pencil");
  const brush = section.querySelector<HTMLElement>(".art-story-brush");
  const blobs = Array.from(section.querySelectorAll<HTMLElement>(".art-story-blob"));
  const caption = section.querySelector<HTMLElement>(".art-story-caption");
  const scrollCue = section.querySelector<HTMLElement>(".art-story-scrollcue");
  if (!pencil || !brush || !caption) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    section.classList.add("is-static");
    return;
  }

  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = `${pathLength}`;

  const setTool = (el: HTMLElement, xPct: number, yPct: number, rotDeg: number, visible: boolean) => {
    el.style.left = `${xPct}%`;
    el.style.top = `${yPct}%`;
    el.style.setProperty("--tool-rot", `${rotDeg}deg`);
    el.classList.toggle("is-visible", visible);
  };

  const render = (progress: number) => {
    const popIn = remap(progress, 0, 0.08);
    const draw = remap(progress, 0.12, 0.5);
    const paint = remap(progress, 0.52, 0.9);

    path.style.strokeDashoffset = `${pathLength * (1 - draw)}`;

    const drawingNow = progress < 0.52;
    if (drawingNow) {
      const [px, py] = lerpAlong(PENCIL_PATH, draw);
      setTool(pencil, px, py, -35, popIn > 0);
    } else {
      pencil.classList.remove("is-visible");
    }

    // A plain for loop (rather than .forEach) so TypeScript can track the
    // reassignment of lastActive through linear control flow instead of
    // across a nested closure boundary.
    let lastActiveX = -1;
    let lastActiveY = -1;
    for (let i = 0; i < blobs.length; i++) {
      const blob = blobs[i];
      const threshold = (i + 1) / (blobs.length + 1);
      const active = paint >= threshold;
      blob.classList.toggle("is-in", active);
      if (active) {
        lastActiveX = parseFloat(blob.dataset.x || "50");
        lastActiveY = parseFloat(blob.dataset.y || "50");
      }
    }

    if (lastActiveX >= 0 && !drawingNow) {
      setTool(brush, lastActiveX, lastActiveY, 18, paint > 0);
    } else {
      brush.classList.remove("is-visible");
    }

    caption.classList.toggle("is-visible", progress > 0.05);
    scrollCue?.classList.toggle("is-visible", progress < 0.03);
  };

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;
      render(progress);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}
