import HeroV2 from "../components/HeroV2";
import HomePage from "../components/HomePage";
import SiteHeaderV2 from "../components/SiteHeaderV2";
import Toppers from "../components/Toppers";
import ToppersIntro from "../components/ToppersIntro";

// Iteration 2: header, hero, toppers statement under the hero, and topper portraits.
export default function HomeV2() {
  return (
    <HomePage
      header={<SiteHeaderV2 />}
      hero={<HeroV2 />}
      afterHero={<ToppersIntro />}
      toppers={<Toppers portraits />}
    />
  );
}
