import Image from "next/image";
import Btn from "./RecipeButton";

// "Meet the toppers" as a modern newspaper front page (user request 2026-11-06; restyled modern and re-laid-out 2026-11-07).
// A clean white sheet blown in over the hero (no desk band). Layout, top to bottom: masthead with a section nav, the banner headline,
// THE TOP THREE (AIR 1 larger, AIR 2 and 3 beside it, each a full portrait card), the story + an "In numbers" box and the admissions
// ad, AIR 4 to 10 as a row of portrait cards, "In brief", and a closing call. Facts only from the toppers list.
// Motion (wired in RecipeStory's effect): the sheet settles from a tilt as it scrolls in ([data-paper], desktop only), nothing inside
// the sheet is revealed or faded in (user 2026-11-07: no reveal animation on the text or elements).
// The earlier layout (centred masthead, three columns, row of nine) is in apps/my-app/backup/removed-sections/RecipeToppersPaper.vintage.tsx.bak;
// the South India Times style front page is in RecipeToppersPaper.southindiatimes.tsx.bak (with its .css.bak).

export type Topper = { air: number; name: string; img: string; took: readonly string[] };

const igpCount = (list: readonly Topper[]) => list.filter((t) => t.took.some((p) => /IGP|Interview Guidance/.test(p))).length;

const photo = (t: Topper) => `/v3/images/toppers-bw/${t.img}.webp`;

export default function RecipeToppersPaper({ toppers }: { toppers: readonly Topper[] }) {
  const top3 = toppers.slice(0, 3);
  const rest = toppers.slice(3);
  const lead = toppers[0];
  const igp = igpCount(toppers);

  return (
    <section
      id="toppers"
      // Transparent: the paper is blown in over the held hero (see RecipeStory), so only the sheet covers it.
      // z-[1] keeps it above the pinned hero.
      className="relative z-[1] px-4 pt-6 pb-24 [overflow:clip_visible] sm:px-7 sm:pt-10 sm:pb-28"
      // overflow clip on x only: the flying sheet goes above the section's top edge while it arrives
    >
      {/* Rust backdrop that fades in as the paper lands (RecipeStory), so the near-black held hero never shows around or below the sheet. */}
      <span data-toppers-bg="" className="rs-toppers-bg" aria-hidden />
      {/* Outer wrapper takes the scroll rise (GSAP); the sheet inside is static (no wind sway, for performance). */}
      <div data-paper="" className="relative mx-auto max-w-[1320px]">
      <div className="rs-paper-sheet rs-np relative px-5 pt-6 pb-10 sm:px-10 sm:pt-8 sm:pb-12">
        {/* ---------- masthead: left-aligned, with a section nav ---------- */}
        <header className="rs-np-mast">
          <div className="rs-paper-folio">
            <span>Results · CSE 2025</span>
            <span className="hidden sm:inline">Front page · मुख पृष्ठ</span>
            <span>Estd. 1976 · New Delhi</span>
          </div>
          <div className="rs-np-title">
            <p className="rs-paper-mast text-[clamp(34px,5.6vw,84px)] leading-[0.95]">The Aspirant&apos;s Chronicle</p>
            <p lang="hi" className="rs-hi text-[clamp(14px,1.3vw,18px)] opacity-70">
              अभ्यर्थी समाचार · सिविल सेवा परिणाम विशेषांक
            </p>
          </div>
          <nav className="rs-np-nav" aria-label="In this edition">
            <a href="#np-top3">The top three</a>
            <a href="#np-story">The story</a>
            <a href="#np-rest">AIR 4 to 10</a>
            <a href="#np-brief">In brief</a>
            <a href="#enrol" className="is-cta">Admissions 2027</a>
          </nav>
        </header>

        {/* ---------- banner headline ---------- */}
        <div className="rs-np-banner">
          <h2 className="rs-paper-head text-[clamp(48px,8.6vw,136px)] leading-[0.9]">Meet the toppers</h2>
          <p className="rs-paper-deck text-[clamp(18px,1.7vw,26px)]">
            All India Ranks 1 to 10 in the Civil Services Examination 2025, every one of them prepared with Vajiram &amp; Ravi
          </p>
        </div>

        {/* ---------- the top three: AIR 1 larger, AIR 2 and 3 beside it ---------- */}
        <div id="np-top3" className="rs-np-top3" role="list" aria-label="All India Ranks 1, 2 and 3">
          {top3.map((t, i) => (
            <figure key={t.air} role="listitem" className={`rs-np-hero ${i === 0 ? "is-first" : ""}`}>
              <div className="rs-np-hero-photo">
                <Image
                  src={photo(t)}
                  alt={`${t.name}, AIR ${t.air} in CSE 2025`}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 42vw, 90vw" : "(min-width: 1024px) 28vw, 90vw"}
                  className="object-cover object-top"
                  priority={i === 0}
                />
                <span className="rs-paper-badge" role="img" aria-label={`All India Rank ${t.air}`}>
                  AIR<b>{t.air}</b>
                </span>
              </div>
              <figcaption className="rs-np-hero-cap">
                <p className="rs-paper-kicker">{i === 0 ? "All India Rank 1" : `All India Rank ${t.air}`}</p>
                <p className="rs-np-hero-name">{t.name}</p>
                <p className="rs-paper-caption">Prepared with the {t.took.join(", ")}.</p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* ---------- the story, with numbers and the admissions ad in a side rail ---------- */}
        <div id="np-story" className="rs-np-story">
          <article className="rs-np-article">
            <p className="rs-paper-kicker">The story</p>
            <h3 className="rs-paper-head text-[clamp(28px,3vw,46px)] leading-[1.02]">Nine of the top ten trained for the interview board at V&amp;R</h3>
            <p className="rs-paper-by mt-3">Vajiram &amp; Ravi · New Delhi</p>
            <div className="rs-paper-body rs-np-cols mt-4">
              <p className="rs-np-lede">
                The final result of the UPSC Civil Services Examination 2025 places all ten of the top All India Ranks with aspirants who prepared at Vajiram &amp; Ravi.
              </p>
              <p>
                {lead.name} heads the list at AIR 1, having prepared for the Personality Test with the institute&apos;s Interview Guidance Programme (IGP).
              </p>
              <p>
                {igp} of the ten went through IGP before facing the board. {toppers[2]?.name}, AIR 3, came through the classroom GS Prelims cum Mains programme.
              </p>
              <p>Their programmes ranged from the PowerUp Prelims and Mains test series to Sociology optional coaching and the GS Ethics module.</p>
            </div>
          </article>

          <aside className="rs-np-rail">
            <div className="rs-paper-box">
              <p className="rs-paper-kicker">In numbers</p>
              <dl className="mt-2">
                <div className="rs-paper-stat">
                  <dt className="rs-paper-head text-[48px] leading-none">10/10</dt>
                  <dd>of the top ten All India Ranks prepared with V&amp;R</dd>
                </div>
                <div className="rs-paper-stat">
                  <dt className="rs-paper-head text-[48px] leading-none">{igp}</dt>
                  <dd>of the ten took the Interview Guidance Programme</dd>
                </div>
                <div className="rs-paper-stat">
                  <dt className="rs-paper-head text-[48px] leading-none">1976</dt>
                  <dd>the year Vajiram &amp; Ravi began preparing aspirants</dd>
                </div>
              </dl>
            </div>

            <a href="#enrol" className="rs-paper-ad group">
              <span className="rs-paper-kicker">Admissions</span>
              <span className="rs-paper-head mt-2 block text-[28px] leading-[1]">Admissions open for 2027</span>
              <span className="rs-paper-body mt-2 block">Classroom &amp; online GS Prelims cum Mains. English and Hindi medium. New Delhi · Chennai.</span>
              <Btn as="span" variant="ink" className="mt-4">Book a free counselling call</Btn>
            </a>
          </aside>
        </div>

        {/* ---------- AIR 4-10 ---------- */}
        <div id="np-rest" className="rs-np-sec">
          <p className="rs-paper-kicker">The rest of the top ten</p>
          <p className="rs-np-sec-sub">AIR 4 to 10</p>
        </div>
        <ul className="rs-np-rest">
          {rest.map((t) => (
            <li key={t.air} className="rs-np-card">
              <div className="rs-np-card-photo">
                <Image src={photo(t)} alt={`${t.name}, AIR ${t.air} in CSE 2025`} fill sizes="(min-width: 1024px) 14vw, 44vw" className="object-cover object-top" />
              </div>
              <p className="rs-np-card-air">AIR {t.air}</p>
              <p className="rs-paper-caption">
                <b>{t.name}</b>
                <br />
                {t.took.join(" · ")}
              </p>
            </li>
          ))}
        </ul>

        {/* ---------- in brief: four short items, facts only (domain overview / site copy) ---------- */}
        <div id="np-brief" className="rs-np-sec">
          <p className="rs-paper-kicker">In brief</p>
          <p lang="hi" className="rs-hi rs-np-sec-sub">संक्षेप में</p>
        </div>
        <ol className="rs-np-brief">
          <li className="rs-paper-brief">
            <span aria-hidden>01</span>
            <h4>One exam, three stages</h4>
            <p>The UPSC Civil Services Examination is taken in three stages: the objective Prelims, the written Mains and the Interview, the Personality Test. One preparation serves the IAS, IPS, IFS and every other Civil Service.</p>
          </li>
          <li className="rs-paper-brief">
            <span aria-hidden>02</span>
            <h4>Classes in Hindi as well</h4>
            <p>Vajiram &amp; Ravi teaches in English and Hindi, with Hindi-medium mentorship and a Mains Test Series in Hindi.</p>
          </li>
          <li className="rs-paper-brief">
            <span aria-hidden>03</span>
            <h4>Two centres, and online</h4>
            <p>Classrooms in New Delhi, on Pusa Road in Old Rajinder Nagar, and in Chennai. Live online and recorded classes carry the same faculty and plan to aspirants anywhere.</p>
          </li>
          <li className="rs-paper-brief">
            <span aria-hidden>04</span>
            <h4>Optional subjects covered</h4>
            <p>Optional coaching runs for 20 to 30 weeks in subjects including Geography, History, Sociology, Psychology, Economics and Political Science, with an Optional Test Series alongside.</p>
          </li>
        </ol>

        <div className="rs-np-end">
          <p className="rs-paper-by">
            Continued on page 2: <i>your name.</i>
          </p>
          <Btn href="#enrol" variant="ink">Admissions for 2027 are open</Btn>
        </div>
        {/* darkens the paper (only the sheet, so nothing around it goes black) while the team sweeps in; opacity 0 unless driven */}
        <span className="rs-paper-veil" aria-hidden />
        <p className="rs-paper-imprint mt-6 text-center">Published by Vajiram &amp; Ravi · 1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi 110060 · Since 1976</p>
      </div>
      </div>
    </section>
  );
}
