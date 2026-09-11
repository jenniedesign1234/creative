import "./style.css";
import { Confetti } from "./decor/confetti";
import { initConfettiBurstOn } from "./decor/confettiBurst";
import { initAppUi } from "./ui/appUi";
import { initArtStory } from "./ui/artStory";
import { renderClasses } from "./ui/classes";
import { initEnrolBar } from "./ui/enrolBar";
import { initFlipCards } from "./ui/flipCard";
import { renderGallery } from "./ui/gallery";
import { initParallax } from "./ui/parallax";
import { initTilt } from "./ui/tilt";

function boot() {
  const classesGrid = document.getElementById("classes-grid");
  if (classesGrid) renderClasses(classesGrid);

  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid) renderGallery(galleryGrid);

  const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement | null;
  if (canvas) {
    try {
      const confetti = new Confetti(canvas);
      confetti.start();
    } catch (err) {
      console.warn("[creative-club] decorative background disabled:", err);
    }
  }

  initAppUi();
  initParallax();
  initArtStory();
  initTilt(".craft-card", 10);
  initFlipCards(".class-card");
  initEnrolBar();
  initConfettiBurstOn(".btn-whatsapp, .nav-whatsapp, .whatsapp-fab");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
