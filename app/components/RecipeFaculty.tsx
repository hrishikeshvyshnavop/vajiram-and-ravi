"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// "Learn from the specialists" as faculty ID cards on lanyards (user choice 2026-11-06, replacing the
// saffron photo cards). Each card hangs from the top of the row on a printed V&R lanyard. They drop
// in one after another as the section scrolls in and swing to rest; the cursor tugs them and they
// swing back with simple pendulum physics (angle + angular velocity, spring + damping).

export type Specialist = { name: string; subject: string; detail: string; img: string };

// Lanyard lengths vary a little so the row hangs naturally (px, wide screens).
const DROPS = [120, 170, 140, 190, 128, 158];

// A deterministic barcode from the name: bar widths 1-3, gaps 1-2.
function bars(seed: string) {
  const out: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; x < 120; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    const w = (c % 3) + 1;
    out.push({ x, w });
    x += w + ((c >> 2) % 2) + 1;
  }
  return out;
}

export default function RecipeFaculty({ specialists }: { specialists: readonly Specialist[] }) {
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const row = rowRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hangers = Array.from(row.querySelectorAll<HTMLElement>("[data-hanger]"));
    if (reduce) return;

    // pendulum state per card: angle (deg) and angular velocity
    const ps = hangers.map((el) => ({ el, a: 0, v: 0 }));
    let raf = 0;
    let running = false;
    const step = () => {
      let moving = false;
      ps.forEach((p) => {
        p.v = (p.v - p.a * 0.035) * 0.965; // spring back + damping
        p.a = Math.max(-28, Math.min(28, p.a + p.v));
        if (Math.abs(p.v) > 0.01 || Math.abs(p.a) > 0.02) moving = true;
        p.el.style.rotate = `${p.a.toFixed(2)}deg`;
      });
      if (moving) raf = requestAnimationFrame(step);
      else running = false;
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    const ctx = gsap.context(() => {
      // drop in, one after another, each with a little swing on landing
      gsap.from(hangers, {
        yPercent: -120,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.2)",
        stagger: 0.12,
        scrollTrigger: { trigger: row, start: "top 80%" },
        onComplete: () => {
          ps.forEach((p, i) => (p.v += i % 2 ? -1.6 : 1.6));
          kick();
        },
      });
    }, row);

    // the cursor tugs the cards it brushes against
    let lastX: number | null = null;
    const onMove = (e: PointerEvent) => {
      const dx = lastX === null ? 0 : e.clientX - lastX;
      lastX = e.clientX;
      ps.forEach((p) => {
        const card = p.el.querySelector<HTMLElement>("[data-card]")!;
        const b = card.getBoundingClientRect();
        if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) return;
        p.v += Math.max(-3, Math.min(3, dx * 0.12));
      });
      kick();
    };
    const onLeave = () => {
      lastX = null;
    };
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      row.addEventListener("pointermove", onMove);
      row.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section id="faculty" className="rs-grain relative overflow-hidden bg-[var(--rs-rust)] pt-28 pb-24">
      <div className="relative mx-auto max-w-[calc(var(--rs-max)+56px)] px-7">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p data-pop="" className="rs-small text-[14px] opacity-80">
              <span className="l-en">Faculty · </span><span lang="hi" className="rs-hi normal-case">विषय विशेषज्ञ</span>
            </p>
            <h2 data-pop="" className="rs-display mt-4 text-[clamp(44px,5.4vw,96px)]">
              Learn from the
              <br />
              specialists
            </h2>
          </div>
          <div data-pop="">
            <p className="max-w-[460px] text-xl leading-snug text-[var(--rs-cream)]/85">
              Subject specialists for every GS paper, the essay, the optionals and the interview. Every subject is taught by faculty who know the UPSC syllabus inside out.
            </p>
            <p className="rs-small mt-5 text-[12px] opacity-70 [@media(hover:none)]:hidden">Move your cursor across the cards</p>
          </div>
        </div>
      </div>

      {/* the rail the lanyards hang from */}
      <div className="rs-rail relative mx-auto mt-14 max-w-[calc(var(--rs-max)+56px)] px-7">
        <ul ref={rowRef} className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-6">
          {specialists.map((f, i) => (
            <li key={f.name} className="flex justify-center">
              <div data-hanger="" className="rs-hanger" style={{ "--drop": `${DROPS[i % DROPS.length]}px` } as React.CSSProperties}>
                <span className="rs-lanyard" aria-hidden>
                  <span>VAJIRAM &amp; RAVI · VAJIRAM &amp; RAVI · VAJIRAM &amp; RAVI · VAJIRAM &amp; RAVI</span>
                </span>
                <span className="rs-clip" aria-hidden />
                <article data-card="" className="rs-idcard">
                  <span className="rs-idcard-slot" aria-hidden />
                  <header className="rs-idcard-head">
                    <span className="rs-display text-[16px] leading-none">Vajiram &amp; Ravi</span>
                    <span className="rs-small text-[12px] tracking-[0.2em] opacity-80">Faculty</span>
                  </header>
                  <div className="relative mx-auto mt-3 aspect-square w-[72%] overflow-hidden rounded-md bg-[var(--rs-cream)] ring-2 ring-[var(--rs-rust)]">
                    <Image src={`/v3/images/faculty/${f.img}.webp`} alt={`${f.name}, ${f.subject} faculty at Vajiram & Ravi`} fill sizes="(min-width: 1280px) 12vw, 30vw" className="object-cover object-top" />
                  </div>
                  <h3 className="rs-display mt-3 px-2 text-center text-[length:var(--rs-lead)] leading-[1.02]">{f.name}</h3>
                  <p className="mt-1 text-center text-[13px] font-semibold">{f.subject}</p>
                  <p className="text-center text-[12px] opacity-70">{f.detail}</p>
                  <p lang="hi" className="rs-hi mt-1 text-center text-[12px] opacity-70">
                    विषय विशेषज्ञ
                  </p>
                  <footer className="rs-idcard-foot">
                    <svg viewBox="0 0 120 22" className="h-[20px] w-full" preserveAspectRatio="none" aria-hidden>
                      {bars(f.name).map((b) => (
                        <rect key={b.x} x={b.x} y="0" width={b.w} height="22" fill="currentColor" />
                      ))}
                    </svg>
                    <span className="mt-1 block text-center font-mono text-[12px] tracking-[0.18em]">VR-1976-{String(i + 1).padStart(3, "0")}</span>
                  </footer>
                </article>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
