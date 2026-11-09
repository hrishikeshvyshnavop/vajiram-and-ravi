"use client";

import Btn from "./RecipeButton";
import { useMemo, useState } from "react";

// FAQ for /v5. Answers use only facts from docs/research/VAJIRAM_RAVI_DOMAIN_OVERVIEW.md and copy
// already on the site; fees and dates are left to the counsellor because they change each cycle.
//
// Layout (user 2026-11-09: "FAQ does not look like a FAQ, need another idea"): a classic help-centre page on cream, which is what people
// recognise as an FAQ. Left: the plain title "Frequently asked questions", a search box, category filters and a "still have a question?" card.
// Right: the questions as rows with a Q badge and a + that opens the answer under an A badge. The OMR answer-sheet version is in
// apps/my-app/backup/removed-sections/RecipeFaq.omr.tsx.bak.

const faqs: { q: string; hi: string; a: React.ReactNode }[] = [
  {
    q: "Which services does the UPSC Civil Services Examination recruit for?",
    hi: "किन सेवाओं के लिए?",
    a: "One examination, the UPSC CSE, recruits for the IAS, IPS, IFS and the other Civil Services. The preparation is the same whichever service you aim for; your rank and preferences decide the service.",
  },
  {
    q: "What are the stages of the exam?",
    hi: "परीक्षा के चरण",
    a: "Three stages. Prelims is objective: GS Paper I counts toward the cut-off and CSAT (Paper II) is qualifying, with 33% needed. Mains is written: the Essay, GS I to GS IV, two optional papers and two qualifying language papers. The last stage is the Interview, the Personality Test.",
  },
  {
    q: "When should I start preparing, and which course fits me?",
    hi: "कब शुरू करें?",
    a: "Most aspirants prepare for one to three years. Graduates usually start with GS Prelims cum Mains (11 months). Final-year college students can take the slower 2-Year PCM Fledgling Programme. If you have already attempted, test series and StepUp Mentorship focus on practice and correction.",
  },
  {
    q: "Can I prepare online or while working full-time?",
    hi: "ऑनलाइन या नौकरी के साथ?",
    a: "Yes. Classes run in the classroom, live online and recorded, with the same faculty and plan. Working aspirants often take the online GS programme with a test series and watch recorded classes at their own pace.",
  },
  {
    q: "Is Hindi medium available?",
    hi: "हिंदी माध्यम",
    a: "Yes. Vajiram & Ravi teaches in English and Hindi, with Hindi-medium mentorship and a Mains Test Series in Hindi.",
  },
  {
    q: "Do you coach for the optional subject?",
    hi: "वैकल्पिक विषय",
    a: "Yes. Optional coaching runs for 20 to 30 weeks in subjects including Agriculture, Economics, Geography, History, Law, Mathematics, Philosophy, Political Science, Psychology and Sociology, with an Optional Test Series alongside.",
  },
  {
    q: "What are the fees?",
    hi: "शुल्क",
    a: "Fees depend on the programme and the mode (classroom or online). A counsellor will give you the current fee for the course that fits you; book a free session below or call 080-6220-6330.",
  },
  {
    q: "Where are the centres?",
    hi: "केंद्र कहाँ हैं?",
    a: "New Delhi: 1-B/7, Pusa Road, Old Rajinder Nagar, next to Gate 5, Karol Bagh Metro. Chennai: Egmore. Online classes are open to aspirants anywhere.",
  },
];


// which group each question belongs to, by position in the list above
const GROUPS = ["The exam", "Courses and study", "Fees and centres"] as const;
type Group = (typeof GROUPS)[number];
const GROUP_OF: Group[] = ["The exam", "The exam", "Courses and study", "Courses and study", "Courses and study", "Courses and study", "Fees and centres", "Fees and centres"];

export default function RecipeFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const [group, setGroup] = useState<Group | "All">("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs
      .map((f, i) => ({ f, i }))
      .filter(({ f, i }) => (group === "All" || GROUP_OF[i] === group) && (!q || `${f.q} ${f.hi} ${String(f.a)}`.toLowerCase().includes(q)));
  }, [group, query]);

  const count = (g: Group | "All") => (g === "All" ? faqs.length : GROUP_OF.filter((x) => x === g).length);

  return (
    <section id="faq" className="rs-fq" aria-labelledby="faq-title">
      <div className="rs-fq-wrap">
        <div className="rs-fq-side">
          <p className="rs-fq-eyebrow">
            <span className="l-en">FAQ · </span><span lang="hi" className="rs-hi normal-case">अक्सर पूछे जाने वाले प्रश्न</span>
          </p>
          <h2 id="faq-title" className="rs-fq-title">Frequently asked questions</h2>
          <p className="rs-fq-lead">Quick answers about the exam, the courses and the centres. Can&apos;t find yours? Ask a counsellor, it&apos;s free.</p>

          <div className="rs-fq-search">
            <label htmlFor="fq-search" className="sr-only">Search the questions</label>
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="M13 13l4.5 4.5" />
            </svg>
            <input id="fq-search" type="search" placeholder="Search the questions" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(null); }} />
          </div>

          <div role="group" aria-label="Filter questions by topic" className="rs-fq-cats">
            {(["All", ...GROUPS] as const).map((g) => (
              <button key={g} type="button" aria-pressed={g === group} className={g === group ? "is-on" : ""} onClick={() => { setGroup(g); setOpen(null); }}>
                {g}
                <span>{count(g)}</span>
              </button>
            ))}
          </div>

          <div className="rs-fq-ask">
            <p>Still have a question?</p>
            <span>A counsellor will talk it through with you, free. Or call 080-6220-6330.</span>
            <Btn href="#enrol" variant="ink" size="sm">Ask a counsellor</Btn>
          </div>
        </div>

        <div className="rs-fq-main">
          <ul className="rs-fq-list" aria-live="polite">
            {shown.map(({ f, i }) => {
              const on = open === i;
              const id = `rs-fq-${i}`;
              return (
                <li key={f.q} className={`rs-fq-item ${on ? "is-open" : ""}`}>
                  <h3>
                    <button type="button" className="rs-fq-btn" aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? null : i)}>
                      <span className="rs-fq-badge" aria-hidden>Q</span>
                      <span className="rs-fq-q">
                        {f.q}
                        <span lang="hi" className="rs-hi rs-fq-hi">{f.hi}</span>
                      </span>
                      <span className="rs-fq-plus" aria-hidden><i /><i /></span>
                    </button>
                  </h3>
                  <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="rs-fq-a">
                        <span className="rs-fq-badge is-a" aria-hidden>A</span>
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {shown.length === 0 && (
            <p className="rs-fq-empty">
              No question matches &ldquo;{query}&rdquo;. <a href="#enrol">Ask a counsellor</a> and we&apos;ll answer it.
            </p>
          )}
          <p className="rs-fq-note">Fees and dates change each cycle. A counsellor gives the current ones.</p>
        </div>
      </div>
    </section>
  );
}
