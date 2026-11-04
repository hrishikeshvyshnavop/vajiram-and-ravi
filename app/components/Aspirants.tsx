"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CoverImage from "./CoverImage";
import BrailleSpinner from "./BrailleSpinner";

// "Built for every aspirant": a horizontally scrolling row of photo cards that runs off the
// right edge, with arrow pills, after primefold's Solutions section.

gsap.registerPlugin(ScrollTrigger);

type Card = {
  title: string;
  description: string;
  cta: string;
  image: string;
  position?: string;
};

const cards: Card[] = [
  {
    title: "First-time aspirant",
    description: "Start from the basics with a full General Studies foundation, in class or online.",
    cta: "Explore GS PCM",
    image: "/hero/classroom.jpg",
  },
  {
    title: "Preparing from home",
    description: "Follow the same programme online, at a pace that fits around your day.",
    cta: "Explore Online GS",
    image: "/hero/online.jpg",
  },
  {
    title: "Prelims-focused",
    description: "Build speed and accuracy with topic-wise and full-length tests.",
    cta: "Explore test series",
    image: "/hero/prelims.jpg",
  },
  {
    title: "Mains answer writer",
    description: "Write answers regularly and get them evaluated, with feedback to act on.",
    cta: "Explore Mains tests",
    image: "/hero/mains.jpg",
    position: "40% center",
  },
  {
    title: "Interview candidate",
    description: "Prepare for the Personality Test with mock interviews and guidance.",
    cta: "Explore IGP",
    image: "/hero/interview.jpg",
  },
];

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={dir === "prev" ? "-scale-x-100" : ""}>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Aspirants() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    setEdges({
      start: row.scrollLeft <= 2,
      end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  // Like primefold, the row drifts left as the section passes through the viewport
  // (desktop only; phones swipe the row instead).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        row,
        { x: 16 },
        {
          x: -212,
          ease: "none",
          scrollTrigger: { trigger: row.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  const scroll = (dir: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.firstElementChild as HTMLElement | null;
    if (!row || !card) return;
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    row.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section className="cv-auto relative z-10 bg-[#faf9f8] pb-24 text-[#212121] md:pb-32">
      <div className="mx-auto flex w-full max-w-[1440px] items-end justify-between gap-6 px-5 md:px-[72px]">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-[#616161]">
            <BrailleSpinner /> Programmes
          </p>
          <h2 className="font-headline mt-3 text-[34px] leading-[1.15] tracking-[0.02em] md:text-5xl md:leading-[56px]">
            Built for every aspirant.
          </h2>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir < 0 ? "Previous cards" : "Next cards"}
              disabled={dir < 0 ? edges.start : edges.end}
              onClick={() => scroll(dir)}
              className="flex h-10 w-14 items-center justify-center rounded-full bg-white text-[#131313] shadow-[0_0_0_1px_rgba(38,57,90,0.16),0_1px_2px_rgba(38,57,91,0.1)] transition-[opacity,scale] hover:shadow-[0_0_0_1px_rgba(38,57,90,0.28),0_1px_2px_rgba(38,57,91,0.1)] active:scale-90 disabled:pointer-events-none disabled:opacity-40"
            >
              <Arrow dir={dir < 0 ? "prev" : "next"} />
            </button>
          ))}
        </div>
      </div>

      {/* The row bleeds to the viewport edge; padding lines the first card up with the content column. */}
      <div
        ref={rowRef}
        onScroll={updateEdges}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 [scroll-padding-inline:20px] md:gap-6 md:px-[max(72px,calc((100vw-1440px)/2+72px))] md:[scroll-padding-inline:max(72px,calc((100vw-1440px)/2+72px))]"
      >
        {cards.map((c) => (
          <a
            key={c.title}
            href="#"
            className="group relative isolate flex h-[420px] w-[82vw] max-w-[465px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl p-6 text-white md:h-[488px] md:w-[465px]"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            >
              <CoverImage src={c.image} sizes="(min-width: 768px) 465px, 82vw" position={c.position} />
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <h3 className="font-headline text-xl leading-7 tracking-[0.01em]">{c.title}</h3>
            <p className="mt-2 max-w-[400px] text-sm leading-5 text-white/90">{c.description}</p>
            <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-colors group-hover:bg-white/30">
              {c.cta}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
                <path d="M3.5 2 6.5 5l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
