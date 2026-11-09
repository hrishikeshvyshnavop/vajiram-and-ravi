// The institute, straight under the hero (storyline: who are we). Layout after "The Performance Lab" section the user shared
// (2026-11-07): a near-black ground, a giant stacked headline on the left, and on the right a small mono-style eyebrow, a large lead,
// a paragraph, a small closing line and a boxed call-to-action with an arrow square.
// Copy uses only facts already on the current homepage (five decades, toppers, Old Rajinder Nagar, Chennai Egmore, classroom and
// LIVE-online). No rank or "#1" claim, because none is verified.

import Btn from "./RecipeButton";
import AboutMotion from "./AboutMotion";

/** A highlighted phrase that surfaces a related picture above it on hover or keyboard focus (and on tap, because it is focusable).
 *  With `href` the phrase is also a real link (opens in a new tab), and the link itself is the focus target. */
function Peek({ src, alt, href, children }: { src: string; alt: string; href?: string; children: React.ReactNode }) {
  return (
    <mark className="rs-peek" tabIndex={href ? undefined : 0}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="rs-peek-link">
          {children}
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </a>
      ) : (
        children
      )}
      <span className="rs-peek-card" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative thumbnail, loaded lazily */}
        <img src={src} alt="" loading="lazy" decoding="async" width={240} height={160} />
      </span>
      <span className="sr-only"> (picture: {alt})</span>
    </mark>
  );
}

// Google Maps search for the Delhi campus (same link as the Contact section)
const DELHI_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060";

const stats = [
  { n: 50, suffix: "+", label: "Years of experience since 1976" },
  { n: 10, suffix: "/10", label: "Top rankers from V&R courses" },
  { n: 59, suffix: "", label: "Questions reflected in Prelims" },
  { n: 36, suffix: "/50", label: "CSE 2025 rankers from V&R" },
] as const;

export default function RecipeAbout() {
  return (
    <section id="about" className="rs-ab" aria-labelledby="about-title">
      <AboutMotion />
      <div className="rs-ab-grid">
        <h2 id="about-title" className="rs-ab-title">
          {["Five Decades", "of UPSC", "Coaching", "in Delhi"].map((l) => (
            <span key={l} className="rs-ab-line">
              <span>{l}</span>
            </span>
          ))}
        </h2>

        <div className="rs-ab-side">
          <p className="rs-ab-eyebrow">
            <span className="l-en">The institute · </span><span lang="hi" className="rs-hi normal-case">हमारा संस्थान</span>
          </p>
          <p className="rs-ab-lead">
            Vajiram &amp; Ravi trains civil services aspirants with <Peek src="/v3/images/faculty/mukul-pathak.webp" alt="one of our faculty">subject specialists</Peek> for every paper, a steady record of <Peek src="/v3/images/toppers-bw/anuj-agnihotri.webp" alt="AIR 1 in CSE 2025">producing toppers</Peek>, and a plan built around you.
          </p>
          <p className="rs-ab-lead rs-ab-lead--2">
            Our campus is in <Peek src="/v3/images/map-new-delhi.webp" alt="map of our Delhi location" href={DELHI_MAPS}>Old Rajinder Nagar</Peek>, the heart of UPSC preparation in Delhi, with a centre in Chennai. Study in the classroom or <Peek src="/hero/online.jpg" alt="a student studying online">LIVE online</Peek>, from foundation to interview.
          </p>

          <div className="rs-ab-foot">
            <Btn href="#faculty" variant="ink">Meet the faculty</Btn>
          </div>
        </div>

        <ul className="rs-ab-stats" aria-label="Vajiram & Ravi in numbers">
          {stats.map((x) => (
            <li key={x.label}>
              <b><span data-ab-count={x.n}>{x.n}</span>{x.suffix}</b>
              <span>{x.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
