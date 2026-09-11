interface ClassItem {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  backDetail: string;
  tag: string;
}

const CLASSES: ClassItem[] = [
  {
    icon: "icon-pencil",
    iconBg: "#FDEAA0",
    title: "Drawing",
    description: "Shapes, faces and imagination on paper — the first step every young artist takes.",
    backDetail: "Pencils, shapes and imagination — kids learn to see the world stroke by stroke.",
    tag: "No experience needed",
  },
  {
    icon: "icon-pen",
    iconBg: "#C8ECC4",
    title: "Sketching",
    description: "Building an eye for line, light and proportion, one careful stroke at a time.",
    backDetail: "From light shading to steady lines — building real technique kids feel proud of.",
    tag: "Builds focus & patience",
  },
  {
    icon: "icon-crayon",
    iconBg: "#F9CFD3",
    title: "Coloring",
    description: "Learning how colors work together, from crayons to color pencils.",
    backDetail: "Color theory made fun — mixing, blending and picking palettes that pop.",
    tag: "Great for younger artists",
  },
  {
    icon: "icon-palette",
    iconBg: "#D9CCF2",
    title: "Painting",
    description: "Watercolors and poster paints — where kids make their boldest choices yet.",
    backDetail: "Watercolors, poster paints, and bold choices — where confidence really shows.",
    tag: "A favorite with ages 8+",
  },
];

function buildCard(item: ClassItem): HTMLElement {
  const card = document.createElement("article");
  card.className = "class-card";
  card.innerHTML = `
    <div class="class-card-flip">
      <div class="class-card-face class-card-front">
        <div class="class-icon" style="background:${item.iconBg}">
          <svg viewBox="0 0 48 48"><use href="#${item.icon}" /></svg>
        </div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="class-card-hint"
          ><span class="hint-hover">Hover to see more ↻</span><span class="hint-tap">Tap to see more ↻</span></span
        >
      </div>
      <div class="class-card-face class-card-back">
        <h3>${item.title}</h3>
        <p>${item.backDetail}</p>
        <span class="class-card-tag">${item.tag}</span>
      </div>
    </div>
  `;
  return card;
}

export function renderClasses(container: HTMLElement) {
  const fragment = document.createDocumentFragment();
  CLASSES.forEach((item) => fragment.appendChild(buildCard(item)));
  container.appendChild(fragment);
}
