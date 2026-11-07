import type { Metadata } from "next";
import ManifestoView from "./ManifestoView";

export const metadata: Metadata = {
  title: "Vajiram & Ravi — Manifesto",
  description: "Read the nation. Write with conviction. Serve with integrity. Five decades of shaping India's civil servants.",
};

// Iteration 11: a scroll-film manifesto after manifesto.blandina.org — preloader, Read / Write / Serve
// timeline hero, horizontal tracks, stacked value cards, gallery, poem and a breathing footer.
// Source lives in apps/manifesto (static HTML/CSS/JS); see its README and ASSETS.md.
export default function Manifesto() {
  return <ManifestoView />;
}
