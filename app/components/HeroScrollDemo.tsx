"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowCircle from "./ArrowCircle";
import CoverImage from "./CoverImage";

gsap.registerPlugin(ScrollTrigger);

// Demo of the hero → toppers scroll hand-off (docs/design/SCROLL_PLAN_HERO.md). The hero pins for
// two screens: the bottom row clears, the full-bleed photo clips into a card on the page column,
// and a year counter runs 1976 → 2026 before the next section scrolls in. Scrubbed, so scrolling
// back reverses it. With reduced motion it is a plain static hero.
const features = [
  { title: "New Delhi, Chennai & Online", text: "Classrooms at Old Rajinder Nagar and Egmore, or the same classes live from home." },
  { title: "English & Hindi Medium", text: "Classes, study material and test series in the medium you write the exam in." },
  { title: "Prelims to Personality Test", text: "Foundation courses, test series and interview guidance under one roof." },
];

export default function HeroScrollDemo() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = el.querySelector<HTMLElement>(".hs-frame")!;
    const year = el.querySelector<HTMLElement>(".hs-year")!;
    const state = { y: 0, x: 0, r: 0, year: 1976 };
    const apply = () => {
      frame.style.clipPath = `inset(${state.y}px ${state.x}px ${state.y}px ${state.x}px round ${state.r}px)`;
      year.textContent = String(Math.round(state.year));
    };

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          onUpdate: apply,
          scrollTrigger: { trigger: el, start: "top top", end: "+=200%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
        })
        .to(".hs-bottom", { y: 60, opacity: 0, duration: 0.25 }, 0)
        .to(state, { y: () => window.innerHeight * 0.12, x: () => (window.innerWidth >= 768 ? 72 : 20), r: 24, duration: 0.6 }, 0.15)
        .fromTo(".hs-photo", { scale: 1.15 }, { scale: 1, duration: 0.6 }, 0.15)
        // The headline travels down with the card's top edge so it is never clipped.
        .to(".hs-headline", { y: 48, duration: 0.6 }, 0.15)
        .fromTo(".hs-years", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 }, 0.5)
        .to(state, { year: 2026, duration: 0.35, ease: "power1.inOut" }, 0.55);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div>
      <section ref={ref} className="relative h-svh min-h-[640px] w-full overflow-hidden bg-[#fbf8f3] text-white">
        <div className="hs-frame absolute inset-0 overflow-hidden bg-[#120f0c]">
          <div className="hs-photo absolute inset-0 -scale-x-100 will-change-transform">
            <CoverImage src="/hero/exam-writing.jpg" sizes="100vw" position="60% 50%" preload fetchPriority="high" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-black/55" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="relative flex h-full flex-col px-5 pb-10 pt-[12vh] md:px-[104px] md:pb-[calc(12vh+40px)]">
            <h1 className="hs-headline font-headline text-[11vw] leading-[1.05] tracking-[-0.02em] md:text-[5vw]">
              Preparing civil servants
              <br />
              since 1976.
            </h1>

            {/* Revealed during the hand-off */}
            <div className="hs-years mt-auto opacity-0">
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/70">Years of UPSC preparation</p>
              <p className="hs-year font-headline text-[18vw] leading-none tracking-[-0.03em] tabular-nums md:text-[9vw]">1976</p>
              <p className="mt-3 max-w-[40ch] text-sm leading-5 text-white/80">
                Five decades of preparing aspirants for Prelims, Mains and the interview.
              </p>
            </div>

            {/* Cleared first */}
            <div className="hs-bottom absolute inset-x-5 bottom-10 flex items-end justify-between gap-8 md:inset-x-[104px]">
              <ul className="hidden flex-col gap-6 md:flex">
                {features.map((f) => (
                  <li key={f.title} className="flex flex-col gap-1.5">
                    <span className="text-[15px] font-medium leading-none">{f.title}</span>
                    <span className="w-[36ch] text-xs leading-[1.25] tracking-[0.03em] text-white/75">{f.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-start">
                <p className="font-headline text-[7vw] leading-[1.1] tracking-[-0.02em] md:text-[2.6vw]">
                  Five decades of UPSC preparation.
                  <br />
                  One conversation to find your course.
                </p>
                <a href="#" className="group/cta mt-6 flex h-[52px] items-center gap-12 rounded-full bg-[#f1f1f1] py-1 pl-5 pr-1 text-sm font-medium text-[#1f1f1f]">
                  <span>Talk to a counsellor</span>
                  <ArrowCircle className="size-[44px] bg-[#1f1f1f] text-[#f1f1f1]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
