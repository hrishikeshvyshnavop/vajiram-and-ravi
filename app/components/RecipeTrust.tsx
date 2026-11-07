"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// "Why aspirants trust us" as a Prelims OMR answer sheet (user choice 2026-11-06, replacing the
// postage stamps). Six questions, one per reason; as the sheet scrolls past, a pencil travels to the
// correct bubble of each, shades it, and the answer prints beside the question. The roll number is
// bubbled 1-9-7-6, a signature draws itself and a red "Score 6/6" stamp lands at the end.
// Only the correct answers are ever shown: the other bubbles stay blank, no distractor text.

const LETTERS = ["A", "B", "C", "D"] as const;

const questions = [
  { q: "Since when has Vajiram & Ravi prepared aspirants?", a: 2, answer: "Since 1976: over 50 years.", hi: "1976 से 50+ वर्ष" },
  { q: "Who teaches each paper?", a: 0, answer: "Subject experts, paper by paper.", hi: "विषय विशेषज्ञ" },
  { q: "How can you attend?", a: 1, answer: "In the classroom or LIVE-online.", hi: "कक्षा एवं लाइव ऑनलाइन" },
  { q: "In which medium?", a: 3, answer: "English and Hindi medium.", hi: "हिंदी माध्यम" },
  { q: "Where are the classes?", a: 1, answer: "Old Rajinder Nagar, New Delhi, and Chennai.", hi: "ओल्ड राजिंदर नगर" },
  { q: "What does the first call cost?", a: 0, answer: "Nothing: counselling is free.", hi: "निःशुल्क परामर्श" },
];

const ROLL = [1, 9, 7, 6];

export default function RecipeTrust() {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sheet = sheetRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sig = sheet.querySelector<SVGPathElement>("[data-omr-sig]")!;
    const len = sig.getTotalLength();
    sig.style.strokeDasharray = `${len}`;

    if (reduce) {
      sheet.classList.add("is-done");
      sig.style.strokeDashoffset = "0";
      return;
    }

    const ctx = gsap.context(() => {
      const pencil = sheet.querySelector<HTMLElement>("[data-omr-pencil]")!;
      const marks = gsap.utils.toArray<HTMLElement>("[data-omr-mark]", sheet);
      const answers = gsap.utils.toArray<HTMLElement>("[data-omr-answer]", sheet);
      const rolls = gsap.utils.toArray<HTMLElement>("[data-omr-roll]", sheet);
      // Pencil tip position for a bubble, relative to the sheet (recomputed on refresh).
      const at = (el: HTMLElement) => () => {
        const s = sheet.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        return { x: b.left - s.left + b.width / 2, y: b.top - s.top + b.height / 2 };
      };

      gsap.set(marks, { scale: 0 });
      gsap.set(answers, { autoAlpha: 0, y: 8 });
      gsap.set(rolls, { scale: 0 });
      gsap.set(sig, { strokeDashoffset: len });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: sheet, start: "top 70%", end: "bottom 75%", scrub: 0.6, invalidateOnRefresh: true },
      });
      tl.set(pencil, { autoAlpha: 1 });
      // roll number first, quickly
      rolls.forEach((r) => {
        const p = at(r);
        tl.to(pencil, { x: () => p().x, y: () => p().y, duration: 0.35 }).to(r, { scale: 1, duration: 0.25 });
      });
      // then each question: travel, shade with a little scribble, print the answer
      marks.forEach((m, i) => {
        const p = at(m);
        tl.to(pencil, { x: () => p().x, y: () => p().y, duration: 0.6 })
          .to(pencil, { x: "+=4", y: "-=3", duration: 0.08, repeat: 3, yoyo: true, ease: "none" })
          .to(m, { scale: 1, duration: 0.35 }, "<")
          .to(answers[i], { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.1");
      });
      // sign, then the pencil leaves and the score is stamped
      const s = at(sig as unknown as HTMLElement);
      tl.to(pencil, { x: () => s().x - 60, y: () => s().y, duration: 0.5 })
        .to(sig, { strokeDashoffset: 0, duration: 0.9, ease: "none" })
        .to(pencil, { x: () => s().x + 70, y: () => s().y - 10, duration: 0.9, ease: "none" }, "<")
        .to(pencil, { autoAlpha: 0, y: "-=60", duration: 0.3 })
        .fromTo("[data-omr-score]", { scale: 2.4, rotate: -30, autoAlpha: 0 }, { scale: 1, rotate: -12, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" });
    }, sheet);

    return () => ctx.revert();
  }, []);

  return (
    <section id="trust" className="rs-grain relative overflow-hidden bg-[var(--rs-rust)] px-5 py-28 sm:px-7">
      <div className="relative mx-auto max-w-[var(--rs-max)]">
        <div className="text-center">
          <p data-pop="" className="rs-small text-[14px] opacity-80">
            The V&amp;R difference · <span lang="hi" className="rs-hi normal-case">वी एंड आर की पहचान</span>
          </p>
          <h2 data-pop="" className="rs-display mt-4 text-[clamp(52px,7vw,116px)]">
            Why aspirants
            <br />
            <span className="text-[var(--rs-cream)]">trust us</span>
          </h2>
          <p data-pop="" className="mx-auto mt-6 max-w-[520px] text-xl leading-snug text-[var(--rs-cream)]/85">
            Six questions every aspirant asks. Here is the answer sheet.
          </p>
        </div>

        <div ref={sheetRef} className="rs-omr relative mx-auto mt-14 max-w-[1120px] rotate-[-0.6deg]">
          {/* header strip */}
          <div className="rs-omr-head">
            <div>
              <p className="rs-omr-title">OMR Answer Sheet</p>
              <p className="rs-omr-sub">
                Civil Services aspirants · Paper: <b>Why Vajiram &amp; Ravi?</b> ·{" "}
                <span lang="hi" className="rs-hi">
                  उत्तर पत्रक
                </span>
              </p>
            </div>
            <p className="rs-omr-note">Use HB pencil only · Darken the circle completely</p>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[220px_1fr] md:gap-8">
            {/* left panel: roll number grid, booklet series, instructions */}
            <aside className="flex flex-row flex-wrap gap-6 md:flex-col">
              <div>
                <p className="rs-omr-label">Roll number</p>
                <div className="rs-omr-roll mt-2">
                  {ROLL.map((digit, col) => (
                    <div key={col} className="flex flex-col items-center gap-[3px]">
                      <span className="rs-omr-rollbox">{digit}</span>
                      {Array.from({ length: 10 }, (_, d) => (
                        <span key={d} className="rs-omr-bubble rs-omr-bubble--sm">
                          <i>{d}</i>
                          {d === digit && <b data-omr-roll="" className="rs-omr-fill" />}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="rs-omr-label">Booklet series</p>
                  <p className="rs-omr-series mt-2">A</p>
                </div>
                <div className="rs-omr-instr">
                  <p className="rs-omr-label">Instructions</p>
                  <ol className="mt-1 list-decimal pl-4">
                    <li>One answer per question.</li>
                    <li>No negative marking here.</li>
                    <li>Every answer is checked.</li>
                  </ol>
                </div>
              </div>
            </aside>

            {/* questions */}
            <ol className="rs-omr-qs">
              {questions.map((item, i) => (
                <li key={item.q} className="rs-omr-q">
                  <span className="rs-omr-qno">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <p className="rs-omr-qtext">{item.q}</p>
                    <p data-omr-answer="" className="rs-omr-answer">
                      <span className="rs-omr-answer-en">{item.answer}</span>{" "}
                      <span lang="hi" className="rs-hi rs-omr-answer-hi">
                        {item.hi}
                      </span>
                    </p>
                  </div>
                  <div className="rs-omr-opts" aria-label={`Answer: option ${LETTERS[item.a]}`}>
                    {LETTERS.map((l, k) => (
                      <span key={l} className="rs-omr-bubble">
                        <i>{l}</i>
                        {k === item.a && <b data-omr-mark="" className="rs-omr-fill" />}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* footer: signature + office use + score */}
          <div className="rs-omr-foot">
            <div className="relative">
              <svg viewBox="0 0 260 60" className="h-[52px] w-[230px]" aria-hidden>
                <path
                  data-omr-sig=""
                  d="M6 44c10-22 18-30 22-24s-8 26-2 26 14-30 20-30-4 28 4 26 10-22 16-22 2 18 8 18 10-14 16-14 0 14 6 14 14-20 22-20-6 22 4 22 18-16 30-18 16 4 30-2 26-10 40-10"
                  fill="none"
                  stroke="#2b2b2b"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="rs-omr-label border-t border-dashed border-current pt-1">Signature of candidate</p>
            </div>
            <div className="rs-omr-office">
              <p className="rs-omr-label">For office use only</p>
              <p className="mt-1 text-[13px]">Checked by: V&amp;R evaluation desk</p>
            </div>
            <span data-omr-score="" className="rs-omr-score">
              Score
              <b>6/6</b>
            </span>
          </div>

          {/* the pencil (tip at the element's origin) */}
          <span data-omr-pencil="" className="rs-omr-pencil" aria-hidden>
            <svg viewBox="0 0 40 200" width="22" height="110">
              <path d="M20 0 L28 26 H12 Z" fill="#e9c9a0" />
              <path d="M20 0 L23 10 H17 Z" fill="#2b2b2b" />
              <rect x="12" y="26" width="16" height="140" fill="#fcb033" />
              <rect x="12" y="26" width="5" height="140" fill="#e09a1e" />
              <rect x="12" y="166" width="16" height="12" fill="#b8b8b8" />
              <rect x="12" y="178" width="16" height="20" rx="3" fill="#e46b7a" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
