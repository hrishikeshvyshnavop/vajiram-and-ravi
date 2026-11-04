"use client";

import { useEffect, useRef, useState } from "react";
import BrailleSpinner from "./BrailleSpinner";

// "Trust, built over five decades": three pillars on a progress rail beside a stack of
// isometric layers, after primefold's Trust section (their WebGL scene is replaced by CSS 3D).

const CYCLE_MS = 5000;

const pillars = [
  {
    label: "Faculty",
    title: "Experienced faculty",
    description: "Every subject is taught by faculty who know the UPSC syllabus inside out.",
  },
  {
    label: "Method",
    title: "A structured method",
    description: "Classes, study material and tests follow one plan, from the first class to the interview.",
  },
  {
    label: "Guidance",
    title: "Honest guidance",
    description: "Counsellors and mentors tell you where you stand and what to work on next.",
  },
];

function LayerIcon({ i }: { i: number }) {
  const paths = [
    "M8 2 1.5 5 8 8l6.5-3L8 2ZM4 6.5v3c0 1 1.8 2 4 2s4-1 4-2v-3",
    "M3 3h10v10H3zM3 6.5h10M6.5 6.5V13",
    "M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM10.5 5.5 9 9l-3.5 1.5L7 7l3.5-1.5Z",
  ];
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d={paths[i]} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LayerStack({ active }: { active: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
      <div className="relative size-[170px] translate-y-12 [--layer-gap:72px] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-42deg)] md:size-[240px] md:translate-y-14 md:[--layer-gap:110px]">
        {pillars.map((p, i) => {
          const on = i === active;
          // Bottom layer first; the active layer lifts a little out of the stack.
          const z = `calc(${i} * var(--layer-gap) + ${on ? 28 : 0}px)`;
          return (
            <div
              key={p.label}
              className={`absolute inset-0 flex flex-col justify-between rounded-[28px] border p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                on
                  ? "border-[#e57512]/50 bg-white shadow-[0_30px_60px_-20px_rgba(229,117,18,0.45)]"
                  : "border-black/[0.08] bg-white/60 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)] backdrop-blur-sm"
              }`}
              style={{ transform: `translateZ(${z})` }}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-xl transition-colors duration-500 ${
                  on ? "bg-[#e57512] text-white" : "bg-black/[0.04] text-[#545454]"
                }`}
              >
                <LayerIcon i={i} />
              </span>
              <span className={`text-lg font-medium transition-colors duration-500 ${on ? "text-[#1a1814]" : "text-[#9a9895]"}`}>
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Trust() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % pillars.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [active, inView]);

  return (
    <section ref={ref} className="cv-auto relative z-10 bg-white py-24 text-[#212121] md:py-32">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 md:px-[72px] lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col justify-between gap-12">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-[#616161]">
              <BrailleSpinner /> Why Vajiram &amp; Ravi
            </p>
            <h2 className="font-headline mt-3 text-[34px] leading-[1.15] tracking-[0.02em] md:text-5xl md:leading-[56px]">
              Trust, built over five decades.
            </h2>
            <p className="mt-4 max-w-[420px] text-sm leading-5 text-[#545454]">
              Aspirants have trusted us to take them from their first class to the interview.
            </p>
          </div>

          <ul className="relative max-w-[516px] border-l border-[#ededed]" role="tablist">
            {pillars.map((p, i) => {
              const on = i === active;
              return (
                <li key={p.title} className="relative">
                  {on && (
                    <span
                      key={`${active}-${inView}`}
                      aria-hidden
                      className="trust-progress absolute -left-px top-0 w-px bg-[#1a1814]"
                      style={{ animationDuration: `${CYCLE_MS}ms`, animationPlayState: inView ? "running" : "paused" }}
                    />
                  )}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(i)}
                    className="block w-full py-3 pl-8 text-left"
                  >
                    <span className={`block font-medium transition-colors duration-500 ${on ? "text-[#212121]" : "text-[#212121]/45"}`}>
                      {p.title}
                    </span>
                    <span
                      className={`mt-1.5 block text-sm leading-5 transition-colors duration-500 ${
                        on ? "text-[#545454]" : "text-[#545454]/50"
                      }`}
                    >
                      {p.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative h-[380px] overflow-hidden rounded-2xl bg-[#faf9f8] md:h-[588px]">
          <LayerStack active={active} />
        </div>
      </div>
    </section>
  );
}
