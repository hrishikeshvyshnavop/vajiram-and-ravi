"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowCircle from "./ArrowCircle";
import CoverImage from "./CoverImage";

gsap.registerPlugin(ScrollTrigger);

// Iteration 2: one full-bleed scene instead of a slider. Big two-line headline top-left,
// feature list bottom-left, sub-heading and a single CTA bottom-right.
const headline = ["Preparing civil servants", "since 1976."];

const features = [
  {
    title: "New Delhi, Chennai & Online",
    text: "Classrooms at Old Rajinder Nagar and Egmore, or the same classes live from home.",
    icon: "book",
  },
  {
    title: "English & Hindi Medium",
    text: "Classes, study material and test series in the medium you write the exam in.",
    icon: "check",
  },
  {
    title: "Prelims to Personality Test",
    text: "Foundation courses, test series and interview guidance under one roof.",
    icon: "mic",
  },
] as const;

function FeatureIcon({ name }: { name: (typeof features)[number]["icon"] }) {
  const paths = {
    book: "M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.83-.67-1.5-1.5-1.5H13v16h5.5c.83 0 1.5-.67 1.5-1.5v-13Z",
    check: "M5 12.5 9.5 17 19 7.5",
    mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM6 11a6 6 0 0 0 12 0M12 17v4",
  };
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 max-[767px]:size-11">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function HeroV2() {
  const [covered, setCovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Letters rise into place line by line, then the bottom row fades up.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".h2-char", { yPercent: 110, duration: 0.9, stagger: 0.025, clearProps: "transform" })
        .from(".h2-reveal", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.5");
    }, el);
    return () => ctx.revert();
  }, []);

  // Same pin-and-cover behaviour as iteration 1, so the sections below work unchanged. Unlike
  // iteration 1 it writes transforms straight onto the three moving layers instead of a CSS
  // variable on the section, which made every element in the hero recalc style each frame.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const contentY = gsap.quickSetter(".hero-content", "y", "px");
      const contentOpacity = gsap.quickSetter(".hero-content", "opacity");
      const driftScale = gsap.quickSetter(".hero-drift", "scale");
      const dimOpacity = gsap.quickSetter(".hero-dim", "opacity");
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${el.offsetHeight}`,
        pin: true,
        pinSpacing: false,
        onUpdate: ({ progress: p }) => {
          if (!reduce) {
            contentY(p * -120);
            driftScale(1 + p * 0.06);
          }
          contentOpacity(1 - p * 0.6);
          dimOpacity(p * 0.45);
        },
        onLeave: () => setCovered(true),
        onEnterBack: () => setCovered(false),
      });
    }, el);
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
      {/* Background: slow push-in on a single photo */}
      {/* Own compositor layers, and no CSS filter on the photo, so the zoom and scroll scale
          move a cached bitmap instead of repainting a 3000px image every frame. */}
      <div className="hero-drift absolute inset-0 -z-10 will-change-transform">
        {/* Mirrored so the bright sleeve sits right, away from the headline */}
        <div className="hero-v2-zoom absolute inset-0 -scale-x-100 will-change-transform">
          <CoverImage src="/hero/exam-writing.jpg" sizes="100vw" position="60% 50%" preload fetchPriority="high" />
        </div>
      </div>
      {/* Darkens the photo (was brightness 0.55) plus the old 15% wash */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/55" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-black/45 to-transparent" />
      <div aria-hidden className="hero-dim pointer-events-none absolute inset-0 z-10 bg-black opacity-0" />

      <div className="hero-content flex w-full flex-1 flex-col pb-[42px] pl-[29px] pr-[32px] pt-[6vw] max-[991px]:px-[24px] max-[991px]:pb-[32px] max-[991px]:pt-[13vw] max-[767px]:px-[20px] max-[767px]:pb-[24px] max-[767px]:pt-[16vw] max-[479px]:px-[16px] max-[479px]:pb-[26vw] max-[479px]:pt-[24vw]">
        {/* Type scales with the viewport (1em = 1vw), stepped at 991 / 767 / 479px */}
        <h1 aria-label={headline.join(" ")} className="font-headline text-[5vw] leading-[1.05] tracking-[-0.02em] max-[991px]:text-[7vw] max-[767px]:text-[9vw] max-[479px]:text-[11.5vw]">
          {headline.map((line) => (
            <span key={line} aria-hidden className="block overflow-hidden pb-[0.06em]">
              {Array.from(line).map((ch, i) => (
                <span key={i} className="h2-char inline-block whitespace-pre">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mt-auto flex items-end max-[767px]:flex-col max-[767px]:items-start">
          <ul className="flex flex-col gap-8 max-[767px]:mb-[42px] max-[767px]:gap-6 max-[479px]:hidden">
            {features.map((f) => (
              <li key={f.title} className="h2-reveal flex items-center gap-5">
                <FeatureIcon name={f.icon} />
                <div className="flex flex-col gap-2">
                  <span className="text-[1.05vw] font-medium leading-none max-[991px]:text-[2vw] max-[767px]:text-[2.5vw]">{f.title}</span>
                  <span className="w-[36ch] text-[0.85vw] leading-[1.2] tracking-[0.03em] text-white/75 max-[991px]:text-[1.5vw] max-[767px]:w-[34ch] max-[767px]:text-[2.25vw] max-[767px]:leading-[1.3]">
                    {f.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex w-[48%] flex-col items-start max-[767px]:ml-0 max-[767px]:w-full">
            <h2 className="h2-reveal font-headline text-[3vw] leading-[1.1] tracking-[-0.02em] max-[991px]:text-[3.6vw] max-[767px]:text-[5vw] max-[479px]:text-[7.2vw] max-[479px]:leading-[1.2]">
              Five decades of UPSC preparation.
              <br className="max-[767px]:hidden" /> One conversation to find your course.
            </h2>
            <a
              href="#"
              className="h2-reveal group/cta mt-6 flex h-[52px] items-center gap-[52px] rounded-full bg-[#f1f1f1] py-1 pl-5 pr-1 text-[0.85vw] font-medium tracking-[0.015em] text-[#1f1f1f] max-[991px]:mt-4 max-[991px]:text-[1.5vw] max-[767px]:justify-between max-[767px]:pl-6 max-[767px]:text-[2.15vw] max-[479px]:w-full max-[479px]:pl-5 max-[479px]:text-[4vw]"
            >
              <span>Talk to a counsellor</span>
              <ArrowCircle className="size-[46px] bg-[#1f1f1f] text-[#f1f1f1]" />
            </a>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
