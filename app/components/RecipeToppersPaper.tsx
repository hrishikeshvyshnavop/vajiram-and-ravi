import Image from "next/image";
import Btn from "./RecipeButton";
import { Roll } from "./Roll";

// "Meet the toppers" as an old newspaper front page (user request 2026-11-06).
// An aged broadsheet blown in over the hero (no desk band): blackletter masthead, dateline, banner headline,
// AIR 1 as the halftone lead photo with the story in columns, an "In numbers" box, a classified
// ad for admissions and AIR 2-10 as a row of halftone portraits. Facts only from the toppers list.
// Motion (wired in RecipeStory's effect): the sheet settles from a tilt as it scrolls in
// ([data-paper], desktop only), nothing inside the sheet is revealed or faded in (user 2026-11-07: no reveal animation on the text or elements).

export type Topper = { air: number; name: string; img: string; took: readonly string[] };

const igpCount = (list: readonly Topper[]) => list.filter((t) => t.took.some((p) => /IGP|Interview Guidance/.test(p))).length;

export default function RecipeToppersPaper({ toppers }: { toppers: readonly Topper[] }) {
  const lead = toppers[0];
  const rest = toppers.slice(1);
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
      <div className="rs-paper-sheet relative px-5 pt-6 pb-10 sm:px-10 sm:pt-8 sm:pb-12">
        {/* printer's registration marks */}
        <span className="rs-paper-reg top-3 left-3" aria-hidden />
        <span className="rs-paper-reg top-3 right-3" aria-hidden />
        <span className="rs-paper-reg bottom-3 left-3" aria-hidden />
        <span className="rs-paper-reg right-3 bottom-3" aria-hidden />

        {/* ---------- folio line ---------- */}
        <div className="rs-paper-folio relative mb-4">
          <span>Page 1</span>
          <span className="hidden sm:inline">Front page · मुख पृष्ठ</span>
          <span>Late city edition</span>
        </div>

        {/* ---------- masthead ---------- */}
        <header className="relative">
          <div className="flex items-start justify-between gap-4">
            <p className="rs-paper-ear hidden sm:block">
              UPSC CSE 2025
              <br />
              <b>Final result edition</b>
            </p>
            <div className="flex-1 text-center">
              <p className="rs-paper-mast text-[clamp(38px,7.4vw,108px)] leading-[0.95]">The Aspirant&apos;s Chronicle</p>
              <p lang="hi" className="rs-hi mt-1 text-[clamp(14px,1.4vw,19px)] opacity-80">
                अभ्यर्थी समाचार · सिविल सेवा परिणाम विशेषांक
              </p>
            </div>
            <p className="rs-paper-ear hidden text-right sm:block">
              Price
              <br />
              <b>One free counselling call</b>
            </p>
          </div>
          <div className="rs-paper-dateline mt-4">
            <span>Vol. L · Estd. 1976</span>
            <span className="hidden md:inline">New Delhi · नई दिल्ली</span>
            <span className="hidden md:inline">Special result edition</span>
            <span>Vajiram &amp; Ravi</span>
          </div>
        </header>

        {/* ---------- banner headline ---------- */}
        <div className="mt-6 text-center">
          <h2 className="rs-paper-head text-[clamp(52px,10.5vw,168px)] leading-[0.86] tracking-[-0.01em] uppercase">
            Meet the toppers
          </h2>
          <p className="rs-paper-deck mx-auto mt-4 max-w-[900px] text-[clamp(18px,1.9vw,28px)]">
            All India Ranks 1 to 10 in the Civil Services Examination 2025, every one of them prepared with Vajiram &amp; Ravi
          </p>
          <div className="rs-paper-rule mt-6" />
        </div>

        {/* ---------- lead: story · AIR 1 photo · numbers + ad ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.55fr_0.95fr] lg:gap-0">
          {/* story */}
          <article className="rs-paper-col lg:pr-6">
            <h3 className="rs-paper-head text-[clamp(24px,2vw,32px)] leading-[1.02]">
              Nine of the top ten trained for the interview board at V&amp;R
            </h3>
            <p className="rs-paper-by mt-2">From our correspondent · New Delhi</p>
            <div className="rs-paper-body mt-3">
              <p className="rs-paper-drop">
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

          {/* AIR 1 */}
          <figure className="rs-paper-col lg:px-6">
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
              <Image src={`/v3/images/toppers-bw/${lead.img}.webp`} alt={`${lead.name}, AIR 1 in CSE 2025`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-top" />
              <span className="rs-halftone-dots" aria-hidden />
              {/* AIR 1 as a flat 2D seal: a scalloped red disc with ring lettering */}
              <svg viewBox="0 0 120 120" className="rs-seal absolute top-4 right-4" role="img" aria-label="Seal: All India Rank 1">
                <polygon points="60.0,0.0 66.0,6.3 73.4,1.5 77.8,9.0 86.0,5.9 88.7,14.3 97.4,13.1 98.2,21.8 106.9,22.6 105.7,31.3 114.1,34.0 111.0,42.2 118.5,46.6 113.7,54.0 120.0,60.0 113.7,66.0 118.5,73.4 111.0,77.8 114.1,86.0 105.7,88.7 106.9,97.4 98.2,98.2 97.4,106.9 88.7,105.7 86.0,114.1 77.8,111.0 73.4,118.5 66.0,113.7 60.0,120.0 54.0,113.7 46.6,118.5 42.2,111.0 34.0,114.1 31.3,105.7 22.6,106.9 21.8,98.2 13.1,97.4 14.3,88.7 5.9,86.0 9.0,77.8 1.5,73.4 6.3,66.0 0.0,60.0 6.3,54.0 1.5,46.6 9.0,42.2 5.9,34.0 14.3,31.3 13.1,22.6 21.8,21.8 22.6,13.1 31.3,14.3 34.0,5.9 42.2,9.0 46.6,1.5 54.0,6.3" fill="#b3261e" />
                <circle cx="60" cy="60" r="44" fill="none" stroke="#fbf3e0" strokeWidth="1.6" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="#fbf3e0" strokeWidth="0.8" />
                <text x="60" y="45" textAnchor="middle" className="rs-seal-small">AIR</text>
                <text x="60" y="80" textAnchor="middle" className="rs-seal-big">1</text>
                <text x="60" y="92" textAnchor="middle" className="rs-seal-tiny">CSE 2025</text>
              </svg>
            </div>
            <figcaption className="rs-paper-caption mt-2">
              <b>{lead.name}</b>, All India Rank 1, CSE 2025. Prepared with the {lead.took.join(", ")}.
            </figcaption>
            <p className="rs-paper-head mt-4 text-center text-[clamp(30px,3.2vw,52px)] leading-[0.95] uppercase">{lead.name}</p>
            <p className="rs-paper-by mt-1 text-center">All India Rank 1 · UPSC Civil Services Examination 2025</p>
          </figure>

          {/* numbers + classified */}
          <aside className="rs-paper-col flex flex-col gap-6 lg:pl-6">
            <div className="rs-paper-box">
              <p className="rs-paper-kicker">In numbers</p>
              <dl className="mt-2">
                <div className="rs-paper-stat">
                  <dt className="rs-paper-head text-[52px] leading-none">10/10</dt>
                  <dd>of the top ten All India Ranks prepared with V&amp;R</dd>
                </div>
                <div className="rs-paper-stat">
                  <dt className="rs-paper-head text-[52px] leading-none">{igp}</dt>
                  <dd>of the ten took the Interview Guidance Programme</dd>
                </div>
                <div className="rs-paper-stat">
                  <dt className="rs-paper-head text-[52px] leading-none">1976</dt>
                  <dd>the year Vajiram &amp; Ravi began preparing aspirants</dd>
                </div>
              </dl>
            </div>

            <a href="#enrol" className="rs-paper-ad group">
              <span className="rs-paper-kicker">Classified · Admissions</span>
              <span className="rs-paper-head mt-2 block text-[30px] leading-[0.95] uppercase">Admissions open for 2027</span>
              <span className="rs-paper-body mt-2 block">Classroom &amp; online GS Prelims cum Mains. English and Hindi medium. New Delhi · Chennai.</span>
              <Btn as="span" variant="ink" className="mt-4">Book a free counselling call</Btn>
            </a>
          </aside>
        </div>

        {/* ---------- AIR 2-10 ---------- */}
        <div className="rs-paper-rule mt-8" />
        <p className="rs-paper-kicker mt-3 text-center">The rest of the top ten · AIR 2 to 10</p>
        <ul className="mt-5 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5 lg:grid-cols-9 lg:gap-0">
          {rest.map((t) => (
            <li key={t.air} className="rs-paper-col lg:px-3">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={`/v3/images/toppers-bw/${t.img}.webp`} alt={`${t.name}, AIR ${t.air} in CSE 2025`} fill sizes="(min-width: 1024px) 12vw, 30vw" className="object-cover object-top" />
                <span className="rs-halftone-dots" aria-hidden />
              </div>
              <p className="rs-paper-head mt-2 text-[22px] leading-none">AIR {t.air}</p>
              <p className="rs-paper-caption mt-1">
                <b>{t.name}</b>
                <br />
                <i>{t.took.join(" · ")}</i>
              </p>
            </li>
          ))}
        </ul>

        {/* ---------- in brief: four short items, facts only (domain overview / site copy) ---------- */}
        <div className="rs-paper-rule mt-8" />
        <p className="rs-paper-kicker mt-3 text-center">In brief · संक्षेप में</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <article className="rs-paper-col rs-paper-brief lg:pr-5">
            <h4>One exam, three stages</h4>
            <p>The UPSC Civil Services Examination is taken in three stages: the objective Prelims, the written Mains and the Interview, the Personality Test. One preparation serves the IAS, IPS, IFS and every other Civil Service.</p>
          </article>
          <article className="rs-paper-col rs-paper-brief lg:px-5">
            <h4>Classes in Hindi as well</h4>
            <p>Vajiram &amp; Ravi teaches in English and Hindi, with Hindi-medium mentorship and a Mains Test Series in Hindi.</p>
          </article>
          <article className="rs-paper-col rs-paper-brief lg:px-5">
            <h4>Two centres, and online</h4>
            <p>Classrooms in New Delhi, on Pusa Road in Old Rajinder Nagar, and in Chennai. Live online and recorded classes carry the same faculty and plan to aspirants anywhere.</p>
          </article>
          <article className="rs-paper-col rs-paper-brief lg:pl-5">
            <h4>Optional subjects covered</h4>
            <p>Optional coaching runs for 20 to 30 weeks in subjects including Geography, History, Sociology, Psychology, Economics and Political Science, with an Optional Test Series alongside.</p>
          </article>
        </div>

        <div className="rs-paper-rule mt-8" />
        <div className="mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6">
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
