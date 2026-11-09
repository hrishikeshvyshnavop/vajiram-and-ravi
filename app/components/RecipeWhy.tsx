// Why choose Vajiram & Ravi (storyline section 3: docs/STORYLINE_HOMEPAGE.md), straight under the institute section.
//   Q2 "Why them and not another coaching?"  ->  six plain reasons (headline reworded 2026-11-09 from "Six reasons, each one a method.").
// Layout (user 2026-11-09, after the Tines "With you every step of your intelligent workflow journey" section they shared): a cream page
// (the faint hairline grid was removed 2026-11-09 on request); on the left a large light headline and, under it, a tinted rounded card holding an illustration; on the
// right the reasons as two staggered columns of a bold title and a few lines, separated by hairlines. We have six reasons (the reference
// has five), so they sit 2 x 3. The illustration is our own, in the page palette: a tiered temple-style tower with a flag on top
// (the climb to the rank). The earlier centred three-column version is in git history / the .rs-why-* rules, left in recipe-story.css.
// Reasons are the six on the current homepage (apps/Vajiram-ravi data/home.ts).

const reasons: { title: string; text: string }[] = [
  { title: "Proven record", text: "Five decades of experience and a steady record of producing UPSC toppers." },
  { title: "Expert faculty", text: "Learn from subject specialists for every GS paper, optional and the essay." },
  { title: "Personal guidance", text: "A preparation plan shaped around your strengths and weak areas." },
  { title: "Complete material", text: "Detailed notes, test series and interview prep for every stage of the exam." },
  { title: "Prime location", text: "Study at our campus in Old Rajinder Nagar, the heart of UPSC preparation in Delhi." },
  { title: "Classroom or online", text: "Choose classroom or LIVE-online for any course, and learn from anywhere." },
];

const C = { deep: "#2a1710", rust: "#8d2e13", orange: "#d1570e", saffron: "#fcb033", peach: "#f8a06b", cream: "#fef8ec" };
const S = { stroke: C.deep, strokeWidth: 1.8, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** A tiered temple-style tower with a flag on top and a dotted path winding up it: the climb to the rank. */
function Tower() {
  return (
    <svg viewBox="0 0 280 300" className="rs-wy-art" aria-hidden>
      {/* the winding path, behind the tower */}
      <path d="M52 262C14 240 36 206 92 200S214 176 200 142S112 116 150 84" fill="none" stroke={C.rust} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="1 8" />
      <ellipse cx="140" cy="270" rx="100" ry="14" fill={C.peach} {...S} />
      <rect x="65" y="212" width="150" height="52" rx="6" fill={C.rust} {...S} />
      <rect x="82" y="164" width="116" height="50" rx="6" fill={C.orange} {...S} />
      <rect x="98" y="118" width="84" height="48" rx="6" fill={C.saffron} {...S} />
      <rect x="112" y="76" width="56" height="44" rx="6" fill={C.peach} {...S} />
      <path d="M77 228H203M77 248H203M94 180H186M94 198H186M110 134H170M110 152H170" stroke={C.cream} strokeWidth={2} strokeLinecap="round" opacity="0.85" />
      <path d="M128 264V244a12 12 0 0 1 24 0V264Z" fill={C.deep} />
      <circle cx="140" cy="66" r="10" fill={C.cream} {...S} />
      <path d="M140 56V16" {...S} />
      <path d="M140 16L174 26L140 36Z" fill={C.orange} {...S} />
    </svg>
  );
}

export default function RecipeWhy() {
  return (
    <section id="why" className="rs-why rs-wy" aria-labelledby="why-title">
      <div className="rs-wy-wrap">
        <div className="rs-wy-left">
          <p data-pop="" className="rs-why-eyebrow">
            <span className="l-en">Why Vajiram &amp; Ravi · </span><span lang="hi" className="rs-hi normal-case">हमें क्यों चुनें</span>
          </p>
          <h2 id="why-title" data-pop="" className="rs-wy-title">
            Six reasons aspirants choose Vajiram &amp; Ravi.
          </h2>
          <p data-pop="" className="rs-wy-lead">
            Ranks are the result. Here is what you get along the way: the faculty, the guidance, the study material and the choice of how you learn.
          </p>
          <div data-pop="" className="rs-wy-card">
            <Tower />
          </div>
        </div>

        <ol className="rs-wy-grid">
          {reasons.map((r) => (
            <li key={r.title} data-pop="" className="rs-wy-item">
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
