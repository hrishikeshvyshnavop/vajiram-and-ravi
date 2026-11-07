import type { Metadata } from "next";
import RecipeStory from "../components/RecipeStory";
import { recipeFonts } from "../v5/fonts";

export const metadata: Metadata = {
  title: "Vajiram & Ravi — UPSC coaching since 1976 (sweep variant)",
  description: "Variant of /v5: the team section sweeps in over the toppers paper with the same ragged edge it uses to hand off to the footer.",
};

// Variant of /v5 (2026-11-07): toppers -> team uses the same ragged-edge sweep as team -> footer. Everything else matches /v5.
export default function V5Sweep() {
  return (
    <main className="flex flex-1 flex-col">
      <RecipeStory fontClass={recipeFonts} teamEntry="sweep" teamLook="collage" />
    </main>
  );
}
