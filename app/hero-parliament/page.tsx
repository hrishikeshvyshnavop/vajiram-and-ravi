import HeroParliament from "../components/HeroParliament";
import Preloader from "../components/Preloader";
import SiteFooter from "../components/SiteFooter";
import SiteHeaderV2 from "../components/SiteHeaderV2";
import SmoothScroll from "../components/SmoothScroll";
import ToppersIntro from "../components/ToppersIntro";

// Standalone review page for the scroll-story hero (after untillabs.com), Parliament mosaic,
// with the iteration 2 header and a preloader (after fixaplan.com) that waits for both photos.
// The story ends on the chamber, then hands off to the toppers section the way /scroll-demo does
// (the stage clips into a card, the year counts 1976 → 2026). More sections go between the toppers
// and the iteration 1 footer. The bar turns light once the card has pulled in off the top edge.
// GSAP ScrollSmoother around the sections; the preloader and header are fixed, so they stay outside it.
export default function HeroParliamentDemo() {
  return (
    <main className="bg-[#fbf8f3]">
      <Preloader images={["/hero/parliament-mosaic.jpg", "/hero/parliament-chamber.jpg"]} />
      <SiteHeaderV2 lightAfter={4.4} lightCta />
      <SmoothScroll>
        <HeroParliament />
        <ToppersIntro />
        {/* More sections go here (to be built). */}
        <SiteFooter />
      </SmoothScroll>
    </main>
  );
}
