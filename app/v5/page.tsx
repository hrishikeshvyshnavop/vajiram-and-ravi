import type { Metadata } from "next";
import RecipeStory from "../components/RecipeStory";
import { recipeFonts } from "./fonts";

export const metadata: Metadata = {
  title: "Vajiram & Ravi — UPSC Civil Services coaching since 1976",
  description: "UPSC coaching since 1976 for IAS, IPS, IFS and every Civil Service: classroom and online courses, test series and interview guidance for UPSC Prelims, Mains and the interview.",
};

// Iteration 10: a loud, packaging-style landing after eathungrytiger.com. The V&R study kit
// (a CSS 3D book) rides the pinned hero and spins to show "what's inside".
export default function V5() {
  return (
    <main className="flex flex-1 flex-col">
      <RecipeStory fontClass={recipeFonts} teamEntry="sweep" teamLook="collage" />
    </main>
  );
}
