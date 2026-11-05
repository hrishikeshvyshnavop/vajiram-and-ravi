"use client";

import { useState } from "react";

// FAQ for /v5. Answers use only facts from docs/research/VAJIRAM_RAVI_DOMAIN_OVERVIEW.md and copy
// already on the site; fees and dates are left to the counsellor because they change each cycle.

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

export default function RecipeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-7 pt-28 pb-10 text-[var(--rs-deep)]">
      <div className="relative mx-auto grid max-w-[1380px] gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="rs-small text-[14px] opacity-80">
            FAQ · <span lang="hi" className="rs-hi normal-case">अक्सर पूछे जाने वाले प्रश्न</span>
          </p>
          <h2 className="rs-display mt-4 text-[clamp(56px,7vw,112px)]">
            Questions,
            <br />
            answered
          </h2>
          <p className="mt-6 max-w-[400px] text-xl leading-snug text-[var(--rs-deep)]/80">
            What aspirants ask us most before they start. Still unsure? A counsellor will talk it through with you, free.
          </p>
          <a href="#enrol" className="rs-pill mt-8 !bg-[var(--rs-deep)] !text-[var(--rs-saffron)]">
            Ask a counsellor
          </a>
        </div>

        <ul className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const on = open === i;
            const id = `rs-faq-${i}`;
            return (
              <li key={f.q} className={`rounded-2xl transition-colors duration-300 ${on ? "bg-[var(--rs-deep)] text-[var(--rs-cream)] shadow-[0_24px_48px_-24px_rgba(45,32,29,.7)]" : "bg-[var(--rs-cream)]/45 ring-1 ring-[var(--rs-deep)]/15 backdrop-blur-[2px] hover:bg-[var(--rs-cream)]/70"}`}>
                <h3>
                  <button type="button" className="flex w-full items-start gap-5 p-6 text-left" aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? null : i)}>
                    <span className="rs-small mt-1.5 shrink-0 text-[12px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="block text-[clamp(18px,1.6vw,22px)] leading-snug font-semibold">{f.q}</span>
                      <span lang="hi" className="rs-hi mt-1 block text-[14px] opacity-60">
                        {f.hi}
                      </span>
                    </span>
                    <span className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full text-[18px] transition-transform duration-300 ${on ? "rotate-45 bg-[var(--rs-saffron)] text-[var(--rs-deep)]" : "bg-[var(--rs-deep)] text-[var(--rs-saffron)]"}`} aria-hidden>
                      +
                    </span>
                  </button>
                </h3>
                <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-400 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="max-w-[640px] px-6 pb-7 pl-[68px] text-[16px] leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
