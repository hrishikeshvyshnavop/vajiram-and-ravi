import type { Metadata } from "next";
import BrandStory from "../components/BrandStory";
import { brandStoryFonts } from "./fonts";

export const metadata: Metadata = {
  title: "Vajiram & Ravi — A brand story",
  description: "Five decades of preparing civil servants, told as an editorial horizontal scroll.",
};

// Iteration 9: the V&R brand story in the style of CANALS (canals-amsterdam.com). Loader, a fixed
// left rail and one horizontal track of chapters (Origin 1976, Method, Results 2025, Reach 2026),
// ending on a credits page. No site header or sales sections on this route (user decision).
export default function V4() {
  return (
    <main className="flex flex-1 flex-col">
      <BrandStory fontClass={brandStoryFonts} />
    </main>
  );
}
