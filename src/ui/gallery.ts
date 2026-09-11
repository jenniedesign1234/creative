interface CraftPiece {
  title: string;
  description: string;
  background: string;
}

// These represent the art forms taught at the studio, rendered as pure CSS
// textures (no stock photography needed). Swap the `background` values for
// real photos of student work whenever they're available — see README.
const CRAFTS: CraftPiece[] = [
  {
    title: "Watercolor Painting",
    description: "Soft washes of color, blended wet-on-wet",
    background:
      "radial-gradient(38% 45% at 25% 20%, #8ecae6 0%, transparent 65%), radial-gradient(40% 45% at 75% 30%, #f4a6c1 0%, transparent 65%), radial-gradient(45% 50% at 50% 80%, #b7e4a1 0%, transparent 65%), #fffaf0",
  },
  {
    title: "Pencil Sketching",
    description: "Learning line, light and proportion",
    background:
      "repeating-linear-gradient(115deg, #7d7d8c 0px, #7d7d8c 1.5px, transparent 1.5px, transparent 9px), repeating-linear-gradient(25deg, #a9a9b8 0px, #a9a9b8 1px, transparent 1px, transparent 12px), #f1efe9",
  },
  {
    title: "Crayon Coloring",
    description: "Bold, bright, joyfully outside the lines",
    background:
      "repeating-linear-gradient(70deg, #e8453c 0 18px, #f5a623 18px 36px, #f7d51d 36px 54px, #6fbe44 54px 72px, #3e8fe0 72px 90px, #7b5ea7 90px 108px)",
  },
  {
    title: "Poster Art",
    description: "Flat bold color and confident shapes",
    background:
      "conic-gradient(from 45deg at 30% 35%, #f7d51d 0deg 90deg, #e8453c 90deg 180deg, #3e8fe0 180deg 270deg, #6fbe44 270deg 360deg)",
  },
];

// Alternating tilt + a washi-tape corner gives the grid a pinned-to-a-
// corkboard feel rather than a flat, uniform grid of photos.
const ROTATIONS = [-3, 2, -2, 3, -2.5, 2.5];

function buildCard(piece: CraftPiece, index: number): HTMLElement {
  const card = document.createElement("article");
  card.className = "craft-card";
  card.style.setProperty("--craft-rotate", `${ROTATIONS[index % ROTATIONS.length]}deg`);

  const inner = document.createElement("div");
  inner.className = "craft-card-inner";
  inner.dataset.tiltInner = "";

  const tape = document.createElement("span");
  tape.className = "craft-tape";
  tape.setAttribute("aria-hidden", "true");

  const art = document.createElement("div");
  art.className = "craft-art";
  art.style.setProperty("--craft-bg", piece.background);

  const scrim = document.createElement("div");
  scrim.className = "craft-scrim";
  scrim.innerHTML = `<h3>${piece.title}</h3><p>${piece.description}</p>`;

  inner.appendChild(tape);
  inner.appendChild(art);
  inner.appendChild(scrim);
  card.appendChild(inner);
  return card;
}

export function renderGallery(container: HTMLElement) {
  const fragment = document.createDocumentFragment();
  CRAFTS.forEach((piece, i) => fragment.appendChild(buildCard(piece, i)));
  container.appendChild(fragment);
}
