// Courses (storyline: the programme catalogue), under "Our how". Layout after the Tines "What are you looking to learn?" section
// the user shared (2026-11-07): a headline between two thin rules, then a grid of cards, 2 large + 3 + 3. Each card is a tinted
// frame with a small illustration standing on its inner panel and poking out above it, a centred title, a short description,
// a small-caps meta line, and a footer with small chips and (on the two large cards) a round arrow button.
// The eight courses are the eight on the current homepage (apps/Vajiram-ravi data/programmes.ts). Descriptions are drafted from
// wording already on the site; no module counts, hours or prices (none are verified). The illustrations are our own, in the
// page palette, instead of the stock-style course images (those are teal-green and clash with the brand).

import SectionMotif from "./SectionMotifs";

type Art = "granth" | "books" | "grid" | "arch" | "compass" | "pen" | "omr" | "clock";
type Tint = "rust" | "orange" | "saffron" | "deep";

const courses: { title: string; text: string; meta: string; art: Art; tint: Tint }[] = [
  { title: "GS Foundation Course (PCM)", text: "The full General Studies syllabus for Prelims and Mains, with study material and regular tests.", meta: "Foundation · 11 months", art: "granth", tint: "rust" },
  { title: "Optional Subject Programme", text: "Learn your optional paper from subject specialists, from the syllabus to answer writing.", meta: "Mains · Optional", art: "books", tint: "orange" },
  { title: "CSAT Course", text: "Classes and practice for the qualifying CSAT paper, so it stays a qualifier, not a hurdle.", meta: "Prelims · CSAT", art: "grid", tint: "saffron" },
  { title: "Interview Guidance Programme", text: "Mock interviews that feel like the real Personality Test, with honest, specific feedback.", meta: "Interview · IGP", art: "arch", tint: "deep" },
  { title: "Mentorship Programme", text: "A plan shaped around your strengths and weak areas, with a mentor who reviews your progress.", meta: "All stages", art: "compass", tint: "rust" },
  { title: "Mains Test Series", text: "Answer-writing tests with detailed evaluation, so you see where marks are being lost.", meta: "Mains · Test series", art: "pen", tint: "orange" },
  { title: "Prelims Test Series", text: "Topic-wise and full-length tests with detailed explanations.", meta: "Prelims · Test series", art: "omr", tint: "saffron" },
  { title: "Optional Test Series", text: "Tests for your optional subject, written under exam conditions and reviewed.", meta: "Mains · Optional", art: "clock", tint: "deep" },
];

const C = { deep: "#2a1710", rust: "#8d2e13", orange: "#d1570e", saffron: "#fcb033", peach: "#f8a06b", cream: "#fef8ec" };
const S = { stroke: C.deep, strokeWidth: 1.8, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/* Indian motif pieces, drawn on the 160 x 84 stage (same shapes as IndianArt.tsx / SectionMotifs.tsx) */
function LotusMark({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M0 0C-22 2-38-10-44-22C-28-24-10-16 0 0Z" fill={C.peach} {...S} />
      <path d="M0 0C22 2 38-10 44-22C28-24 10-16 0 0Z" fill={C.peach} {...S} />
      <path d="M0-2C-20-8-28-26-24-40C-10-34-2-18 0-2Z" fill={C.saffron} {...S} />
      <path d="M0-2C20-8 28-26 24-40C10-34 2-18 0-2Z" fill={C.saffron} {...S} />
      <path d="M0-52C12-34 12-14 0-2C-12-14-12-34 0-52Z" fill={C.orange} {...S} />
    </g>
  );
}
function PaisleyMark({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M60 112C25 112 10 85 15 60C20 35 45 15 72 12C88 10 92 28 80 32C72 35 68 26 74 22C90 50 95 75 85 95C78 107 70 112 60 112Z" fill={C.orange} {...S} />
      <path d="M58 100C35 100 26 82 29 64C32 46 48 34 66 34C80 40 84 62 78 80C74 92 67 100 58 100Z" fill={C.saffron} {...S} />
      <path d="M56 88C44 88 39 76 42 66C45 56 54 50 64 52C70 60 70 74 66 82C63 86 60 88 56 88Z" fill={C.cream} {...S} />
      <circle cx="55" cy="70" r="3.5" fill={C.rust} />
    </g>
  );
}

/** A small standing illustration (160 x 84), drawn on a ground line at y = 84, built from the site's Indian motifs. */
function Illus({ art }: { art: Art }) {
  const spokes = Array.from({ length: 24 }, (_, i) => (i * Math.PI) / 12);
  const petals = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
  return (
    <svg viewBox="0 0 160 84" className="rs-cs-art" aria-hidden>
      {art === "granth" && (
        <>
          {/* pothi: palm-leaf manuscript pages with string holes, a lotus rising from it */}
          <rect x="22" y="56" width="116" height="22" rx="4" fill={C.cream} {...S} />
          <rect x="16" y="42" width="116" height="22" rx="4" fill={C.saffron} {...S} />
          <circle cx="44" cy="53" r="3" fill={C.cream} {...S} />
          <circle cx="104" cy="53" r="3" fill={C.cream} {...S} />
          <path d="M58 49H90M58 56H84" stroke={C.rust} strokeWidth={1.8} strokeLinecap="round" />
          <LotusMark x={74} y={42} k={0.62} />
        </>
      )}
      {art === "books" && (
        <>
          <rect x="12" y="58" width="84" height="22" rx="3" fill={C.rust} {...S} />
          <rect x="20" y="36" width="70" height="22" rx="3" fill={C.saffron} {...S} />
          <rect x="10" y="14" width="76" height="22" rx="3" fill={C.cream} {...S} />
          <path d="M22 69H58M30 47H62M20 25H52" stroke={C.cream} strokeWidth={1.8} strokeLinecap="round" opacity="0.9" />
          <path d="M20 25H52" stroke={C.rust} strokeWidth={1.8} strokeLinecap="round" />
          <PaisleyMark x={104} y={28} k={0.46} />
          <path d="M98 80H150" {...S} />
        </>
      )}
      {art === "grid" && (
        <>
          {/* jaali window: a screened arch with a lattice of rounds */}
          <path d="M38 80V40A42 34 0 0 1 122 40V80Z" fill={C.cream} {...S} />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2, 3].map((c) => (
              <circle key={`${r}${c}`} cx={(r % 2 ? 62 : 52) + c * 20 + (r % 2 ? 0 : 6)} cy={38 + r * 15} r="8.5" fill={(r + c) % 2 ? C.saffron : "none"} stroke={C.rust} strokeWidth={1.6} />
            )),
          )}
          <path d="M80 4V10" {...S} />
        </>
      )}
      {art === "arch" && (
        <>
          {/* mehrab: a cusped arch like a durbar doorway, a lotus bud above */}
          <path d="M30 80V44Q30 34 44 28Q64 20 80 6Q96 20 116 28Q130 34 130 44V80Z" fill={C.saffron} {...S} />
          <path d="M50 80V52Q52 42 66 36Q74 32 80 24Q86 32 94 36Q108 42 110 52V80Z" fill={C.cream} {...S} />
          <path d="M80 80V56" stroke={C.rust} strokeWidth={1.8} strokeLinecap="round" strokeDasharray="1 5" />
          <circle cx="80" cy="46" r="4" fill={C.orange} {...S} />
          <path d="M20 80H140" {...S} />
        </>
      )}
      {art === "compass" && (
        <>
          {/* Ashoka chakra: 24 spokes */}
          <circle cx="80" cy="44" r="36" fill={C.cream} {...S} />
          <circle cx="80" cy="44" r="29" fill="none" stroke={C.rust} strokeWidth={1.4} />
          {spokes.map((a, i) => (
            <path key={i} d={`M${80 + Math.cos(a) * 9} ${44 + Math.sin(a) * 9}L${80 + Math.cos(a) * 27} ${44 + Math.sin(a) * 27}`} stroke={C.rust} strokeWidth={1.5} strokeLinecap="round" />
          ))}
          {spokes.map((a, i) => (
            <circle key={`d${i}`} cx={80 + Math.cos(a + Math.PI / 24) * 32.5} cy={44 + Math.sin(a + Math.PI / 24) * 32.5} r="1.3" fill={C.deep} />
          ))}
          <circle cx="80" cy="44" r="7" fill={C.saffron} {...S} />
        </>
      )}
      {art === "pen" && (
        <>
          <rect x="30" y="20" width="86" height="60" rx="4" fill={C.cream} {...S} />
          <rect x="37" y="27" width="72" height="46" rx="2" fill="none" stroke={C.orange} strokeWidth={1.4} strokeDasharray="2 3" />
          <path d="M46 40H100M46 51H100M46 62H82" stroke={C.rust} strokeWidth={1.8} strokeLinecap="round" opacity="0.7" />
          <path d="M138 8L100 56L96 72L110 64L148 16Z" fill={C.saffron} {...S} />
          <path d="M96 72L100 56L110 64Z" fill={C.deep} {...S} />
        </>
      )}
      {art === "omr" && (
        <>
          <rect x="30" y="12" width="82" height="68" rx="5" fill={C.cream} {...S} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => <circle key={`${r}${c}`} cx={47 + c * 16} cy={30 + r * 18} r="5.5" fill={(r * 3 + c) % 5 === 1 ? C.rust : "none"} stroke={C.deep} strokeWidth={1.6} />),
          )}
          {/* marigold */}
          <g transform="translate(128 36)">
            {petals.map((a, i) => (
              <circle key={i} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="6.5" fill={i % 2 ? C.saffron : C.orange} {...S} />
            ))}
            <circle r="7" fill={C.rust} {...S} />
          </g>
          <path d="M128 50V80" stroke={C.rust} strokeWidth={1.8} strokeLinecap="round" />
        </>
      )}
      {art === "clock" && (
        <>
          {/* ghadi with a scalloped rangoli rim */}
          {petals.map((a, i) => (
            <circle key={i} cx={80 + Math.cos(a) * 31} cy={44 + Math.sin(a) * 31} r="7" fill={i % 2 ? C.saffron : C.peach} {...S} />
          ))}
          <circle cx="80" cy="44" r="27" fill={C.cream} {...S} />
          <path d="M80 44V27M80 44L92 51" {...S} />
          <circle cx="80" cy="44" r="3" fill={C.rust} />
        </>
      )}
    </svg>
  );
}

export default function RecipeCourses() {
  return (
    <section id="courses" className="rs-cs" aria-labelledby="cs-title">
      <SectionMotif variant="buti" className="!text-black/[0.06]" />
      <div className="rs-cs-wrap relative">
        <p data-pop="" className="rs-cs-eyebrow">
          Courses · <span lang="hi" className="rs-hi normal-case">पाठ्यक्रम</span>
        </p>
        <div data-pop="" className="rs-cs-head">
          <span aria-hidden />
          <h2 id="cs-title">What are you preparing for?</h2>
          <span aria-hidden />
        </div>

        <ul className="rs-cs-grid">
          {courses.map((c, i) => {
            const big = i < 2;
            return (
              <li key={c.title} data-pop="" className={`rs-cs-card rs-cs-card--${c.tint} ${big ? "is-big" : ""}`}>
                <Illus art={c.art} />
                <div className="rs-cs-in">
                  <h3 className="rs-cs-name">{c.title}</h3>
                  <p className="rs-cs-text">{c.text}</p>
                  <p className="rs-cs-meta">{c.meta}</p>
                  <div className="rs-cs-foot">
                    <span className="rs-cs-chips">
                      <span>Classroom</span>
                      <span>LIVE online</span>
                    </span>
                    {big && (
                      <a href="#enrol" className="rs-cs-go" aria-label={`Ask about ${c.title}`}>
                        <svg viewBox="0 0 16 16" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" aria-hidden>
                          <path d="M2 8h11M9 4l4 4-4 4" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="rs-cs-note">
          Not sure which one is yours? <a href="#enrol" className="rs-bt-ask">Ask a counsellor</a>
        </p>
      </div>
    </section>
  );
}
