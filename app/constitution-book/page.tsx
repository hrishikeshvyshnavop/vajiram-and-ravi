import HeroConstitution from "../components/HeroConstitution";
import HomePage from "../components/HomePage";
import SiteHeaderV2 from "../components/SiteHeaderV2";

// Iteration 8: the Constitution of India cover hero (after ten.375.studio). Scrolling opens the
// book and dives into the Preamble page; the rest of the site follows on the page's paper.
// The hero pins for 4.2 screens. The header stays hidden through the dive and slides in, already
// light, just before the paper fills the screen.
export default function ConstitutionBook() {
  return (
    <HomePage header={<SiteHeaderV2 lightAfter={3.9} hiddenUntil={3.9} lightCta />} hero={<HeroConstitution />} />
  );
}
