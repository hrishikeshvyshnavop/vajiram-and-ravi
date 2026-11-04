"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CoverImage from "./CoverImage";
import Logo from "./Logo";
import PrimaryCta from "./PrimaryCta";

type Slide = {
  tab: string;
  badge?: { label: string; color: string };
  title: [string, string];
  subtitle: string;
  primary: string;
  primaryIcon: "phone" | "arrow";
  secondary: string;
  // Photo in /public/hero; the gradient shows underneath until the file exists.
  image: string;
  // Tones down bright photos so the white copy stays readable (1 = untouched).
  brightness?: number;
  // Pushes a centred subject right (percent of width) and fades the photo's left edge into
  // the dark background, so the headline sits on a clear area instead of over a face.
  shift?: number;
  background: string;
};

gsap.registerPlugin(ScrollTrigger);

const SLIDE_MS = 7000;

const slides: Slide[] = [
  {
    tab: "Vajiram & Ravi",
    title: ["Crack UPSC with", "the right guidance."],
    subtitle:
      "Classroom teaching, study material, test series and mentorship, all under one roof for every stage of the exam.",
    primary: "Talk to a counsellor",
    primaryIcon: "phone",
    secondary: "Find your course",
    image: "/hero/classroom.jpg",
    background:
      "radial-gradient(120% 90% at 70% 30%, #6b5a45 0%, #2d261f 45%, #120f0c 100%)",
  },
  {
    tab: "Prelims",
    badge: { label: "PR", color: "#1f8a6b" },
    title: ["Practise Prelims", "until it's routine."],
    subtitle: "Topic-wise and full-length tests with detailed explanations.",
    primary: "View Prelims tests",
    primaryIcon: "arrow",
    secondary: "Talk to a counsellor",
    image: "/hero/prelims.jpg",
    brightness: 0.85,
    background:
      "radial-gradient(110% 90% at 30% 40%, #3f6b5d 0%, #1b2f29 50%, #0b1210 100%)",
  },
  {
    tab: "Mains",
    badge: { label: "MN", color: "#d9771f" },
    title: ["Write answers", "that score."],
    subtitle: "Answer copies evaluated by faculty, with feedback you can act on.",
    primary: "Explore answer writing",
    primaryIcon: "arrow",
    secondary: "Talk to a counsellor",
    image: "/hero/mains.jpg",
    brightness: 0.75,
    shift: 28,
    background:
      "radial-gradient(110% 90% at 65% 55%, #8a6a44 0%, #3a2a1b 50%, #140e09 100%)",
  },
  {
    tab: "Interview",
    badge: { label: "IN", color: "#6c5ce7" },
    title: ["Prepare for the", "final conversation."],
    subtitle: "Mock interviews and guidance for the Personality Test.",
    primary: "Know more",
    primaryIcon: "arrow",
    secondary: "Talk to a counsellor",
    image: "/hero/interview.jpg",
    shift: 26,
    background:
      "radial-gradient(110% 90% at 50% 35%, #4b4a78 0%, #22213a 50%, #0c0c16 100%)",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  // Covered: the next section has slid fully over the pinned hero, so it can rest.
  const [covered, setCovered] = useState(false);
  // Slides 2-4 fetch their photos only once the page has loaded, after the LCP image.
  const [loadRest, setLoadRest] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (covered) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, covered]);

  useEffect(() => {
    const start = () => setTimeout(() => setLoadRest(true), 300);
    if (document.readyState === "complete") {
      const id = start();
      return () => clearTimeout(id);
    }
    let id: ReturnType<typeof setTimeout>;
    const onLoad = () => (id = start());
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(id);
    };
  }, []);

  // Keep the active tab visible when the row overflows on small screens.
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.children[active] as HTMLElement | undefined;
    if (row && tab) row.scrollTo({ left: tab.offsetLeft - row.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  // Pin the hero for one hero-height of scroll while the next section slides over it.
  // Progress (0 → 1) drives the content drift and dimming; once the pin ends the hero is
  // fully covered and stops painting and autoplaying.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${el.offsetHeight}`,
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => el.style.setProperty("--hero-p", self.progress.toFixed(3)),
        onLeave: () => setCovered(true),
        onEnterBack: () => setCovered(false),
      });
    });
    return () => ctx.revert();
  }, []);

  // The wrapper gives React a stable node to remove; GSAP re-parents the section into a pin spacer.
  return (
    <div>
    <section
      ref={sectionRef}
      data-covered={covered || undefined}
      className="hero relative z-0 isolate flex h-svh min-h-[640px] w-full flex-col overflow-hidden bg-[#120f0c] text-white"
    >
      {/* Backgrounds */}
      <div className="hero-drift absolute inset-0 -z-10">
        {slides.map((s, i) => (
          <div
            key={s.tab}
            aria-hidden
            className={`absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-out ${
              i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
            style={{ background: s.background }}
          >
            {(i === 0 || loadRest) && (
              <div
                className="absolute inset-y-0"
                style={
                  s.shift
                    ? {
                        left: `${s.shift}%`,
                        right: `-${s.shift}%`,
                        maskImage: "linear-gradient(to right, transparent, black 35%)",
                      }
                    : { left: 0, right: 0 }
                }
              >
                <CoverImage
                  src={s.image}
                  sizes="100vw"
                  brightness={s.brightness}
                  preload={i === 0}
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : "low"}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/10 to-black/55"
      />
      {/* Left scrim keeps the copy readable over bright photos */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/25 to-transparent md:via-35%"
      />
      <div aria-hidden className="hero-grain absolute inset-0 -z-10 opacity-[0.07]" />
      <div aria-hidden className="hero-dim pointer-events-none absolute inset-0 z-10 bg-black" />

      {/* Space for the fixed header */}
      <div className="h-[72px] shrink-0" />

      <div className="hero-content flex flex-1 flex-col">
        {/* Copy */}
        <div className="relative mx-auto w-full max-w-[1440px] flex-1 px-5 md:px-[72px]">
          {slides.map((s, i) => (
            <div
              key={s.tab}
              aria-hidden={i !== active}
              className={`absolute inset-x-5 top-[8vh] transition-all duration-700 ease-out md:inset-x-[72px] md:top-[9vh] ${
                i === active
                  ? "translate-y-0 opacity-100 delay-200"
                  : "pointer-events-none translate-y-4 opacity-0"
              }`}
            >
              <h1 className="font-headline text-[40px] leading-[1.1] tracking-[0.02em] md:text-[64px] md:leading-[72px]">
                {s.title[0]}
                <br />
                {s.title[1]}
              </h1>
              <p className="mt-6 max-w-[620px] text-base leading-6 text-white/90 md:text-lg">
                {s.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <PrimaryCta size="lg" icon={s.primaryIcon} tabIndex={i === active ? 0 : -1}>
                  {s.primary}
                </PrimaryCta>
                <a href="#" tabIndex={i === active ? 0 : -1} className="glass-pill inline-flex h-14 items-center rounded-full px-6 font-display text-[18px] font-semibold transition hover:bg-white/30">
                  {s.secondary}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Slide tabs */}
        <div ref={tabsRef} className="no-scrollbar mx-auto flex w-full max-w-[1440px] gap-3 overflow-x-auto px-5 pb-6 md:px-[72px] md:pb-8" role="tablist">
          {slides.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.tab}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={`relative flex h-[102px] w-[215px] shrink-0 flex-col justify-between overflow-hidden rounded-lg border p-5 text-left text-[15px] backdrop-blur-[3.5px] transition-colors duration-500 ${
                  on
                    ? "border-white/40 bg-white text-[#1a1814]"
                    : "border-white/15 bg-white/12 text-white hover:bg-white/20"
                }`}
              >
                {s.badge ? (
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-semibold text-white"
                    style={{ background: s.badge.color }}
                  >
                    {s.badge.label}
                  </span>
                ) : (
                  <Logo />
                )}
                <span className="truncate">{s.tab}</span>
                {on && (
                  <span
                    key={active}
                    className="hero-progress absolute bottom-0 left-0 h-[3px] bg-[#1a1814]"
                    style={{ animationDuration: `${SLIDE_MS}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
    </div>
  );
}
