"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// "Tradition & results" as a bahi-khata, the red-cloth Indian account book (user choice 2026-11-06).
// Desktop: the closed book (cloth cover, tied string) swings open as the section scrolls in; its inside
// is the left page. Entries are then inked in line by line, the result figures count up, the total is
// double-underlined and a wax seal is pressed. Phones get the two pages stacked, no 3D.
// Every entry is a fact already used on /v5; nothing is invented about the decades in between.

const dayBook = [
  { date: "1976", hi: "स्थापना", text: "Vajiram & Ravi begins preparing aspirants for the Civil Services." },
  { date: "1976 – 2026", hi: "हर वर्ष", text: "Prelims, Mains and the interview, every year. The method stays the same." },
  { date: "2025", hi: "प्रारंभिक", text: "59 questions in UPSC Prelims reflected from our Prelims Test Series." },
  { date: "2025", hi: "परिणाम", text: "UPSC CSE: All India Ranks 1 to 10 prepared with V&R." },
  { date: "2026", hi: "प्रवेश", text: "Admissions for 2027 open." },
];

const results = [
  { n: 50, unit: "years", hi: "५० वर्ष", text: "From the first class to the interview", src: "1976 – 2026" },
  { n: 59, unit: "questions", hi: "५९ प्रश्न", text: "In Prelims 2025, reflected from our test series", src: "Prelims Test Series" },
  { n: 9, unit: "of the top 10", hi: "१० में से ९", text: "CSE 2025 toppers took our interview programme", src: "Interview Guidance Programme" },
];

export default function RecipeLedger() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.classList.add("is-open");
      return;
    }
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const ink = () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.fromTo("[data-ink]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, stagger: 0.18, ease: "power1.inOut" })
          .fromTo("[data-ledger-photo]", { autoAlpha: 0, y: 30, rotate: 8 }, { autoAlpha: 1, y: 0, rotate: -4, duration: 0.6 }, "<0.3")
          .fromTo("[data-ledger-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.5 })
          .fromTo("[data-ledger-seal]", { scale: 2.2, autoAlpha: 0, rotate: -40 }, { scale: 1, autoAlpha: 1, rotate: -12, duration: 0.4, ease: "back.out(2)" });
        return tl;
      };
      // Count the figures up once the right page is in view.
      gsap.utils.toArray<HTMLElement>("[data-ledger-count]").forEach((el) => {
        const end = Number(el.dataset.ledgerCount);
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v))), scrollTrigger: { trigger: el, start: "top 80%" } });
      });

      mm.add("(min-width: 1024px)", () => {
        // the cover swings open (scrubbed), then the ink writes itself in
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-ledger-book]", start: "top 85%", end: "top 15%", scrub: 0.6 } });
        tl.fromTo("[data-ledger-cover]", { rotateY: 0 }, { rotateY: -180, ease: "power2.inOut", duration: 1 })
          .fromTo("[data-ledger-string]", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 0)
          .add(ink(), 0.85);
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.timeline({ scrollTrigger: { trigger: "[data-ledger-book]", start: "top 75%" } }).add(ink());
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="tradition" className="rs-grain relative overflow-hidden bg-[var(--rs-rust)] px-5 py-28 sm:px-7">
      <div className="relative mx-auto max-w-[var(--rs-max)]">
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <p data-pop="" className="rs-small text-[14px] opacity-80">
              <span className="l-en">Since 1976 · </span><span lang="hi" className="rs-hi normal-case">स्थापना १९७६ · बही-खाता</span>
            </p>
            <h2 data-pop="" className="rs-display mt-4 text-[clamp(56px,7.4vw,120px)]">
              Tradition
              <br />
              &amp; results
            </h2>
          </div>
          <p data-pop="" className="max-w-[480px] text-xl leading-snug text-[var(--rs-cream)]/85">
            Fifty years of accounts, kept the old way. Since 1976, Vajiram &amp; Ravi has prepared aspirants for every stage of the UPSC Civil Services Examination: Prelims, Mains and the interview.
          </p>
        </div>

        {/* ---------- the book ---------- */}
        <div data-ledger-book="" className="rs-ledger mx-auto mt-16 max-w-[1240px]">
          {/* left page: on desktop it is the inside of the cover */}
          <div className="rs-ledger-leftslot">
            <div data-ledger-cover="" className="rs-ledger-cover">
              {/* outside: red cloth, gold title, tied string */}
              <div className="rs-ledger-face rs-ledger-front">
                <div className="rs-ledger-cloth">
                  <p lang="hi" className="rs-hi text-[length:var(--rs-t2)] text-[#f3d27a]">
                    बही-खाता
                  </p>
                  <p className="rs-display mt-3 text-[length:var(--rs-t2)] text-[#f3d27a]">Vajiram &amp; Ravi</p>
                  <p className="rs-small mt-3 tracking-[0.3em] text-[#f3d27a]/80">Estd. 1976 · New Delhi</p>
                </div>
                <span data-ledger-string="" className="rs-ledger-string" aria-hidden />
              </div>
              {/* inside: the day book page */}
              <div className="rs-ledger-face rs-ledger-back">
                <LeftPage />
              </div>
            </div>
            {/* phones: the left page as a plain page */}
            <div className="rs-ledger-page rs-ledger-page--left rs-ledger-mobile-left">
              <LeftPage />
            </div>
          </div>

          {/* right page: results */}
          <div className="rs-ledger-page rs-ledger-page--right">
            <div className="rs-ledger-pagehead">
              <span lang="hi" className="rs-hi">
                खाता · परिणाम
              </span>
              <span className="rs-small text-[12px] tracking-[0.2em]">Results account</span>
            </div>
            <ul className="mt-2">
              {results.map((r) => (
                <li key={r.unit} className="rs-ledger-row rs-ledger-row--result">
                  <div data-ink="" className="min-w-0">
                    <p className="rs-ledger-hand text-[length:var(--rs-lead)] leading-tight">{r.text}</p>
                    <p className="rs-small mt-1 text-[12px] tracking-[0.14em] opacity-60">{r.src}</p>
                  </div>
                  <p className="rs-ledger-amount">
                    <span data-ledger-count={r.n} className="tabular-nums">
                      {r.n}
                    </span>
                    <small>
                      {r.unit}
                      <span lang="hi" className="rs-hi block text-[13px] opacity-70">
                        {r.hi}
                      </span>
                    </small>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-end justify-between gap-4 pt-6">
              <div className="flex-1">
                <span data-ledger-rule="" className="rs-ledger-double block origin-left" aria-hidden />
                <p data-ink="" className="rs-ledger-hand mt-2 text-[length:var(--rs-t3)]">
                  Carried forward to 2027: <u className="decoration-[var(--ledger-red)] decoration-2 underline-offset-4">your name</u>
                </p>
                <a href="#enrol" className="rs-small mt-3 inline-block border-b-2 border-current pb-0.5 text-[12px] tracking-[0.14em]">
                  Open your account · Enrol →
                </a>
              </div>
              <span data-ledger-seal="" className="rs-ledger-seal" aria-label="Seal: Vajiram and Ravi, 1976">
                <b>V&amp;R</b>
                <small>1976</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeftPage() {
  return (
    <div className="rs-ledger-inner">
      <div className="rs-ledger-pagehead">
        <span lang="hi" className="rs-hi">
          रोज़नामचा
        </span>
        <span className="rs-small text-[12px] tracking-[0.2em]">Day book</span>
      </div>
      <ul className="mt-2">
        {dayBook.map((e) => (
          <li key={e.text} className="rs-ledger-row">
            <span className="rs-ledger-date">
              {e.date}
              <span lang="hi" className="rs-hi block text-[12px] opacity-70">
                {e.hi}
              </span>
            </span>
            <p data-ink="" className="rs-ledger-hand text-[length:var(--rs-lead)] leading-snug">
              {e.text}
            </p>
          </li>
        ))}
      </ul>
      {/* the campus photo, pasted in with photo corners */}
      <figure data-ledger-photo="" className="rs-ledger-photo">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image src="/v3/images/gallery/campus.webp" alt="The Vajiram & Ravi campus building with students outside" fill sizes="(min-width: 1024px) 18vw, 50vw" className="object-cover" />
        </div>
        <figcaption className="rs-ledger-hand mt-1 text-center text-[16px]">The V&amp;R campus</figcaption>
      </figure>
    </div>
  );
}
