import HeroScrollDemo from "../components/HeroScrollDemo";
import SiteHeaderV2 from "../components/SiteHeaderV2";
import ToppersIntro from "../components/ToppersIntro";

// Standalone review page for the hero → toppers scroll hand-off (docs/design/SCROLL_PLAN_HERO.md),
// with the iteration 2 navigation header.
export default function ScrollDemo() {
  return (
    <main className="bg-[#fbf8f3]">
      <SiteHeaderV2 />
      <HeroScrollDemo />
      <ToppersIntro />
    </main>
  );
}
