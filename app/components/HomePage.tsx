import Aspirants from "./Aspirants";
import FinalCta from "./FinalCta";
import Outcomes from "./Outcomes";
import Programmes from "./Programmes";
import SiteFooter from "./SiteFooter";
import SmoothScroll from "./SmoothScroll";
import Toppers from "./Toppers";
import Trust from "./Trust";

// The full landing page; each iteration plugs its header and hero into the same sections,
// plus an optional section straight after the hero. `smoothScroll={false}` keeps native scrolling,
// so the footer wordmark reveal tracks the scroll 1:1 (as on /hero-parliament).
export default function HomePage({
  header,
  hero,
  afterHero,
  toppers = <Toppers />,
  smoothScroll = true,
}: {
  header: React.ReactNode;
  hero: React.ReactNode;
  afterHero?: React.ReactNode;
  toppers?: React.ReactNode;
  smoothScroll?: boolean;
}) {
  const sections = (
    <>
      {hero}
      {afterHero}
      {/* With no section of its own after the hero, the programmes section slides over it. */}
      <Programmes leading={!afterHero} />
      {toppers}
      <Aspirants />
      <Trust />
      <Outcomes />
      <FinalCta />
      <SiteFooter />
    </>
  );
  return (
    <main className="flex flex-1 flex-col">
      {header}
      {smoothScroll ? <SmoothScroll>{sections}</SmoothScroll> : sections}
    </main>
  );
}
