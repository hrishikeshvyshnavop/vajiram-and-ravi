"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import CoverImage from "./CoverImage";

// Topper results carousel, after primefold's testimonial slider: full-bleed photo slides
// that peek at the edges, looping endlessly. Facts come from the current V&R site;
// no quotes are attributed to toppers until the client supplies approved ones.

type Story = {
  eyebrow: { badge: string; color: string; label: string };
  headline: string;
  cta: string;
  name: string;
  detail: string;
  rank: string;
  // Atmosphere only: never a photo of a person who could be mistaken for the topper.
  image?: string;
  // The topper's own approved photo (e.g. /toppers/anuj-agnihotri.jpg). Until one is supplied
  // the portrait slot shows their initials; group slides have no portrait.
  portrait?: { initials: string; src?: string };
  brightness?: number;
  background: string;
};

const stories: Story[] = [
  {
    eyebrow: { badge: "25", color: "#e57512", label: "UPSC CSE 2025" },
    headline: "Ranks 1 to 10 all prepared with Vajiram & Ravi.",
    cta: "See all toppers",
    name: "AIR 1 to 10",
    detail: "Civil Services Examination 2025",
    rank: "Top 10",
    image: "/hero/classroom.jpg",
    background: "linear-gradient(135deg, #3a2a1b, #120f0c)",
  },
  {
    eyebrow: { badge: "IN", color: "#6c5ce7", label: "Interview Guidance Programme" },
    headline: "AIR 1 prepared for the Personality Test with our Interview Guidance Programme.",
    cta: "Explore IGP",
    name: "Anuj Agnihotri",
    detail: "AIR 1 · CSE 2025",
    rank: "AIR 1",
    portrait: { initials: "AA" },
    background:
      "radial-gradient(90% 120% at 85% 20%, #4b4a78 0%, #22213a 45%, #0c0c16 100%)",
  },
  {
    eyebrow: { badge: "PR", color: "#1f8a6b", label: "Test Series" },
    headline: "AIR 2 practised with our Prelims and Mains Test Series, then IGP.",
    cta: "Explore test series",
    name: "Rajeshwari Suve M",
    detail: "AIR 2 · CSE 2025",
    rank: "AIR 2",
    portrait: { initials: "RS" },
    background:
      "radial-gradient(90% 120% at 15% 80%, #1f5a4c 0%, #12302a 45%, #0b1210 100%)",
  },
  {
    eyebrow: { badge: "GS", color: "#d9771f", label: "GS Prelims cum Mains Classroom" },
    headline: "AIR 3 prepared in our GS Prelims-cum-Mains classroom programme.",
    cta: "Explore classroom GS",
    name: "Akansh Dhull",
    detail: "AIR 3 · CSE 2025",
    rank: "AIR 3",
    portrait: { initials: "AD" },
    image: "/hero/classroom-empty.jpg",
    brightness: 0.55,
    background: "linear-gradient(135deg, #3a2a1b, #140e09)",
  },
];

const N = stories.length;
const AUTOPLAY_MS = 6000;
const SLIDE_MS = 700;

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={dir === "prev" ? "-scale-x-100" : ""}>
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Portrait({ name, portrait, className = "" }: { name: string; portrait: NonNullable<Story["portrait"]>; className?: string }) {
  return (
    // Callers set the positioning (absolute card on desktop, relative avatar on mobile).
    <div className={`shrink-0 overflow-hidden bg-white/12 ring-1 ring-white/25 backdrop-blur-md ${className}`}>
      {portrait.src ? (
        <Image src={portrait.src} alt={name} fill sizes="(min-width: 768px) 280px, 64px" className="object-cover object-top" />
      ) : (
        <span aria-hidden className="font-headline absolute inset-0 flex items-center justify-center text-[0.28em] tracking-[0.04em] text-white/80">
          {portrait.initials}
        </span>
      )}
    </div>
  );
}

// `portraits` (iteration 2) adds each topper's photo to their slide.
export default function Toppers({ portraits = false }: { portraits?: boolean }) {
  // Slides render three times; `pos` indexes the long strip and is snapped back
  // into the middle copy after each move so the loop never runs out.
  const [pos, setPos] = useState(N);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((delta: number) => {
    setAnimate(true);
    setPos((p) => p + delta);
  }, []);

  useEffect(() => {
    if (paused || !inView) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [pos, paused, inView, go]);

  // Re-enable transitions on the frame after a silent jump.
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // Once a move lands outside the middle copy, jump silently back into it. A timer rather
  // than transitionend, which never fires if the tab is hidden mid-slide.
  useEffect(() => {
    if (pos >= N && pos < 2 * N) return;
    const id = setTimeout(() => {
      setAnimate(false);
      setPos(((pos % N) + N) % N + N);
    }, SLIDE_MS + 50);
    return () => clearTimeout(id);
  }, [pos]);

  const active = ((pos % N) + N) % N;
  const strip = [...stories, ...stories, ...stories];

  return (
    <section ref={sectionRef} className="cv-auto relative z-10 overflow-hidden bg-[#faf9f8] pb-24 md:pb-32">
      <div
        className="relative mx-auto w-full max-w-[1440px] px-5 md:px-[72px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          setPaused(false);
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <div
          className="flex gap-(--gap) [--gap:16px] md:[--gap:24px]"
          style={{
            transform: `translate3d(calc(${-pos} * (100% + var(--gap))), 0, 0)`,
            transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
          }}
        >
          {strip.map((s, i) => {
            const current = i === pos;
            return (
              <article
                key={i}
                aria-hidden={!current}
                className="relative isolate flex h-[560px] w-full shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-6 text-white md:h-[650px] md:p-16"
              >
                <div aria-hidden className="absolute inset-0 -z-10" style={{ background: s.background }}>
                  {s.image && (
                    <CoverImage src={s.image} sizes="(min-width: 1440px) 1296px, 100vw" brightness={s.brightness} />
                  )}
                </div>
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/5 to-black/55" />
                <div aria-hidden className="hero-grain absolute inset-0 -z-10 opacity-[0.06]" />

                <div className="max-w-[800px]">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className="flex size-5 items-center justify-center rounded text-[9px] font-semibold"
                      style={{ background: s.eyebrow.color }}
                    >
                      {s.eyebrow.badge}
                    </span>
                    {s.eyebrow.label}
                  </p>
                  <h2 className="font-headline mt-6 text-[28px] leading-[34px] tracking-[0.02em] md:text-[44px] md:leading-[48px]">
                    {s.headline}
                  </h2>
                  <a
                    href="#"
                    tabIndex={current ? 0 : -1}
                    className="mt-8 inline-flex rounded-full bg-white px-3.5 py-2 font-medium text-[#1a1814] transition hover:bg-white/90"
                  >
                    {s.cta}
                  </a>
                </div>

                {portraits && s.portrait && (
                  <Portrait
                    name={s.name}
                    portrait={s.portrait}
                    className="absolute top-16 right-16 hidden aspect-[4/5] w-[min(280px,24%)] rounded-2xl text-[280px] md:block"
                  />
                )}

                <div className="flex items-end justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {portraits && s.portrait && (
                      <Portrait name={s.name} portrait={s.portrait} className="relative size-16 rounded-full text-[64px] md:hidden" />
                    )}
                    <div>
                      <p className="text-lg font-medium leading-6">{s.name}</p>
                      <p className="leading-6 text-white/85">{s.detail}</p>
                    </div>
                  </div>
                  <p className="font-headline shrink-0 whitespace-nowrap text-3xl leading-none tracking-[0.02em] text-white/90 md:text-[56px]">
                    {s.rank}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="absolute top-1/2 left-[52px] hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1814] shadow-sm transition hover:scale-105 md:flex"
        >
          <Arrow dir="prev" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          className="absolute top-1/2 right-[52px] hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1814] shadow-sm transition hover:scale-105 md:flex"
        >
          <Arrow dir="next" />
        </button>

        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
          {stories.map((s, i) => (
            <button
              key={s.name}
              type="button"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => go(i - active)}
              className={`size-2 rounded-full transition-colors duration-300 ${
                i === active ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
