import Announcements from "./sections/Announcements";
import Batches from "./sections/Batches";
import ClosingCta from "./sections/ClosingCta";
import Contact from "./sections/Contact";
import Courses from "./sections/Courses";
import Educators from "./sections/Educators";
import Faq from "./sections/Faq";
import Flagship from "./sections/Flagship";
import Footer from "./sections/Footer";
import Header from "./sections/Header";
import Help from "./sections/Help";
import Hero from "./sections/Hero";
import Locations from "./sections/Locations";
import Resources from "./sections/Resources";
import Stories from "./sections/Stories";
import Toast from "./sections/Toast";
import TopBar from "./sections/TopBar";
import Toppers from "./sections/Toppers";
import WhyChoose from "./sections/WhyChoose";
import V3Behaviors from "./V3Behaviors";

// Iteration 3: the current Vajiram & Ravi site (kevin-vajiram.netlify.app), ported section by
// section with its own markup, tokens (scoped by .v3 in globals.css) and images (/v3/images).
export default function HomeV3() {
  return (
    <div className="v3 flex flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <TopBar />
      <Header />
      <Announcements />
      <main id="main">
        <span id="top" />
        <Hero />
        <Toppers />
        <WhyChoose />
        <Courses />
        <Flagship />
        <Educators />
        <Batches />
        <Contact />
        <Stories />
        <Resources />
        <Faq />
        <Help />
        <Locations />
        <ClosingCta />
      </main>
      <Footer />
      <Toast />
      <V3Behaviors />
    </div>
  );
}
