// The institute, straight under the hero (storyline: who are we). Layout after "The Performance Lab" section the user shared
// (2026-11-07): a near-black ground, a giant stacked headline on the left, and on the right a small mono-style eyebrow, a large lead,
// a paragraph, a small closing line and a boxed call-to-action with an arrow square.
// Copy uses only facts already on the current homepage (five decades, toppers, Old Rajinder Nagar, Chennai Egmore, classroom and
// LIVE-online). No rank or "#1" claim, because none is verified.

import Btn from "./RecipeButton";

/** A highlighted phrase that surfaces a related picture above it on hover or keyboard focus (and on tap, because it is focusable). */
function Peek({ src, alt, children }: { src: string; alt: string; children: React.ReactNode }) {
  return (
    <mark className="rs-peek" tabIndex={0}>
      {children}
      <span className="rs-peek-card" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative thumbnail, loaded lazily */}
        <img src={src} alt="" loading="lazy" decoding="async" width={240} height={160} />
      </span>
      <span className="sr-only"> (picture: {alt})</span>
    </mark>
  );
}

export default function RecipeAbout() {
  return (
    <section id="about" className="rs-ab" aria-labelledby="about-title">
      <div className="rs-ab-grid">
        <h2 id="about-title" data-pop="" className="rs-ab-title">
          Five decades
          <br />
          of UPSC
          <br />
          coaching
          <br />
          in Delhi
        </h2>

        <div className="rs-ab-side">
          <p data-pop="" className="rs-ab-eyebrow">
            The institute · <span lang="hi" className="rs-hi normal-case">हमारा संस्थान</span>
          </p>
          <p data-pop="" className="rs-ab-lead">
            Vajiram &amp; Ravi trains civil services aspirants with <Peek src="/v3/images/faculty/mukul-pathak.webp" alt="one of our faculty">subject specialists</Peek> for every paper, a steady record of <Peek src="/v3/images/toppers-bw/anuj-agnihotri.webp" alt="AIR 1 in CSE 2025">producing toppers</Peek>, and a plan built around you.
          </p>
          <p data-pop="" className="rs-ab-lead rs-ab-lead--2">
            Our campus is in <Peek src="/v3/images/map-new-delhi.webp" alt="map of our Delhi location">Old Rajinder Nagar</Peek>, the heart of UPSC preparation in Delhi, with a centre in Chennai. Study in the classroom or <Peek src="/hero/online.jpg" alt="a student studying online">LIVE online</Peek>, from foundation to interview.
          </p>

          <div className="rs-ab-foot">
            <p data-pop="" className="rs-ab-note">
              It&apos;s not a name on a signboard. It&apos;s a method, taught by specialists and measured in ranks.
            </p>
            <Btn href="#faculty" variant="ink">Meet the faculty</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
