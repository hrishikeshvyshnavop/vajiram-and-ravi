"use client";

import { useEffect, useRef, useState } from "react";
import BrailleSpinner from "./BrailleSpinner";

// What a counsellor weighs before recommending a course (domain overview, section 7).
const sources = ["First attempt", "Works full-time", "English medium", "Targeting 2027", "No optional yet", "CSAT: confident"];

const steps: { text: string; strong?: boolean }[] = [
  { text: "Profile: working professional, first attempt" },
  { text: "Checked 2027 batches, live and recorded" },
  { text: "Start with GS Prelims cum Mains 2027 in online mode, then add a Prelims test series.", strong: true },
  { text: "Optional subject to be chosen before Mains" },
  { text: "Shared batch details and next steps" },
];

// Stage coordinates for the desktop diagram (card is 1280 x 520).
const PILL_X = 48;
const PILL_W = 200;
const PILL_Y0 = 78;
const PILL_GAP = 64;
const CHAT = { x: 395, y: 62, w: 338, h: 396 };
const RESULT = { x: 894, y: 96, w: 337 };
const HIGHLIGHT = 1; // "Works full-time" decides the online recommendation

// Animation timeline: one tick per source, then each step, then the result.
const TICK_MS = 550;
const RESULT_TICK = sources.length + steps.length + 1;
const LAST_TICK = RESULT_TICK + 8;

function Check({ on }: { on: boolean }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full transition-all duration-300 ${
        on ? "scale-100 bg-[#3dd6b5] opacity-100" : "scale-50 opacity-0"
      }`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="m2 5.2 2 2L8 3" stroke="#0b0b0c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="2.5" y="1.5" width="9" height="11" rx="1.5" stroke="currentColor" />
      <path d="M5 5h4M5 7.5h4M5 10h2" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function Pill({ label, done, highlight }: { label: string; done: boolean; highlight: boolean }) {
  return (
    <div
      className={`flex h-11 w-[200px] items-center gap-2 rounded-[22px] border bg-white/[0.06] pl-2 pr-2.5 transition-colors duration-500 ${
        highlight ? "border-[#d9925b] shadow-[0_0_0_3px_rgba(217,146,91,0.18)]" : done ? "border-[#3dd6b5]/40" : "border-white/10"
      }`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/70">
        <DocIcon />
      </span>
      <p className="flex-1 truncate whitespace-nowrap text-sm font-medium tracking-[-0.006em] text-[#f0eeea]">{label}</p>
      <Check on={done} />
    </div>
  );
}

function ChatPanel({ tick }: { tick: number }) {
  const shown = tick - sources.length;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#3dd6b5]/30 bg-[#141414]/90 p-3.5 text-[12.5px] text-white/80 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-white">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3 17V11a7 7 0 0 1 14 0v6M7 17v-6a3 3 0 0 1 6 0v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Free Expert Counselling
      </div>
      <div className="mt-4 ml-auto max-w-[78%] rounded-xl bg-white/10 px-3 py-2 text-white">
        I work full-time and I&apos;m targeting UPSC 2027. Where do I start?
      </div>
      <p className={`mt-4 text-white/50 transition-opacity duration-300 ${shown > 0 ? "opacity-100" : "opacity-0"}`}>
        Your counsellor&apos;s notes
      </p>
      <ul className="mt-2 space-y-1.5 rounded-xl bg-white/[0.04] p-2.5">
        {steps.map((s, i) => (
          <li
            key={s.text}
            className={`flex items-start gap-2 transition-all duration-300 ${
              i < shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            } ${s.strong ? "font-medium text-white" : ""}`}
          >
            {!s.strong && <span className="mt-[3px] text-white/50"><DocIcon /></span>}
            {s.text}
          </li>
        ))}
      </ul>
      <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-white/40">
        Ask a counsellor…
        <div className="mt-2 flex justify-between">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10">+</span>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/20 text-white">↑</span>
        </div>
      </div>
    </div>
  );
}

// Recommended path for this profile, following the funnel in the domain overview.
const path = [
  { stage: "Foundation", programme: "GS Prelims cum Mains 2027", detail: "Online · 11 months" },
  { stage: "Prelims", programme: "PowerUp Prelims Test Series", detail: "Closer to the exam" },
  { stage: "Mains", programme: "Sure Shot Mains Programme", detail: "After Prelims" },
  { stage: "Interview", programme: "Interview Guidance Programme", detail: "After Mains" },
];

function ResultPanel({ visible }: { visible: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#141414]/90 p-3.5 text-[12.5px] text-white/80 backdrop-blur transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <p className="text-[13px] text-white">Your preparation path, from foundation to interview.</p>
      <ol className="relative mt-3 space-y-2 rounded-xl bg-white/[0.04] p-3">
        {path.map((step, i) => (
          <li
            key={step.stage}
            className={`flex items-start gap-3 transition-all duration-500 ${visible ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
            style={{ transitionDelay: visible ? `${200 + i * 120}ms` : "0ms" }}
          >
            <span
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                i === 0 ? "bg-[#e57512] text-white" : "border border-white/20 text-white/60"
              }`}
            >
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-white/50">{step.stage}</span>
              <span className={`block ${i === 0 ? "font-medium text-white" : "text-white/85"}`}>{step.programme}</span>
              <span className="block text-white/45">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Online mode", "English medium", "Target 2027"].map((c, i) => (
          <span
            key={c}
            className={`rounded-md border px-2 py-0.5 ${i === 0 ? "border-[#d9925b] text-white" : "border-white/10 text-white/60"}`}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-white">
        → Book a free counselling call
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setTick((t) => (t >= LAST_TICK ? 0 : t + 1)), TICK_MS);
    return () => clearTimeout(id);
  }, [running, tick]);

  const resultVisible = tick >= RESULT_TICK;

  return (
    // Own GPU layer: its animated items otherwise each got a separate layer while overlapping
    // the pinned hero, which stalled scrolling as the section came into view.
    <section ref={ref} className="relative z-10 rounded-t-2xl bg-[#faf9f8] py-24 text-[#212121] will-change-transform md:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-[72px]">
        <p className="flex items-center gap-1.5 text-xs text-[#212121]/70">
          <BrailleSpinner /> Counsel. Plan. Prepare.
        </p>
        <h2 className="font-headline mt-3 text-[34px] leading-[1.15] tracking-[0.02em] md:text-5xl md:leading-[56px]">
          From one counselling call
          <br />
          to your full UPSC plan.
        </h2>
        <p className="mt-4 max-w-[460px] text-sm leading-5 text-[#545454]">
          Tell us where you are in your preparation. A counsellor recommends the programmes that fit, in the order
          you&apos;ll need them.
        </p>

        <div className="relative mt-14 overflow-hidden rounded-2xl bg-[#0b0b0c]">
          {/* Glow */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(45% 70% at 8% 75%, rgba(32,140,120,0.55), transparent 70%), radial-gradient(50% 80% at 85% 10%, rgba(150,80,45,0.55), transparent 70%)",
            }}
          />
          <div aria-hidden className="hero-grain absolute inset-0 opacity-[0.08]" />

          {/* Desktop diagram */}
          <div className="relative mx-auto hidden h-[520px] w-[1280px] max-w-full xl:block">
            <svg className="absolute inset-0" width="1280" height="520" fill="none" aria-hidden>
              {sources.map((_, i) => {
                const y = PILL_Y0 + i * PILL_GAP + 22;
                const elbow = 300 + i * 10;
                const target = 210 + i * 16;
                const on = tick > i;
                return (
                  <path
                    key={i}
                    d={`M${PILL_X + PILL_W} ${y} H${elbow} V${target} H${CHAT.x}`}
                    stroke={i === HIGHLIGHT && on ? "#d9925b" : on ? "rgba(61,214,181,0.55)" : "rgba(255,255,255,0.12)"}
                    strokeWidth="1"
                    className="transition-[stroke] duration-500"
                  />
                );
              })}
              <path
                d={`M${CHAT.x + CHAT.w} 250 H${RESULT.x}`}
                stroke={resultVisible ? "#d9925b" : "rgba(255,255,255,0.12)"}
                strokeWidth="1"
                className="transition-[stroke] duration-500"
              />
            </svg>

            {sources.map((s, i) => (
              <div key={s} className="absolute" style={{ left: PILL_X, top: PILL_Y0 + i * PILL_GAP }}>
                <Pill label={s} done={tick > i} highlight={i === HIGHLIGHT && resultVisible} />
              </div>
            ))}

            <div className="absolute" style={{ left: CHAT.x, top: CHAT.y, width: CHAT.w, height: CHAT.h }}>
              <ChatPanel tick={tick} />
            </div>

            <div className="absolute" style={{ left: RESULT.x, top: RESULT.y, width: RESULT.w }}>
              <ResultPanel visible={resultVisible} />
            </div>
          </div>

          {/* Stacked layout below xl */}
          <div className="relative flex flex-col gap-5 p-5 md:p-8 xl:hidden">
            <div className="flex flex-wrap gap-2.5">
              {sources.map((s, i) => (
                <Pill key={s} label={s} done={tick > i} highlight={i === HIGHLIGHT && resultVisible} />
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="h-[396px]">
                <ChatPanel tick={tick} />
              </div>
              <ResultPanel visible={resultVisible} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
