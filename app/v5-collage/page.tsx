import type { Metadata } from "next";
import RecipeStory from "../components/RecipeStory";
import { recipeFonts } from "../v5/fonts";

export const metadata: Metadata = {
  title: "Vajiram & Ravi — UPSC coaching since 1976 (collage hero)",
  description: "Backup of /v5 with its original hero: copy on the left and the team's India collage on the right.",
};

// Backup of /v5 before its hero was replaced by the toppers face-off (2026-11-06). Same page and
// sections as /v5; only the hero differs (copy + the team's India collage, mouse parallax).
export default function V5Collage() {
  return (
    <main className="flex flex-1 flex-col">
      <RecipeStory fontClass={recipeFonts} hero="collage" />
    </main>
  );
}
