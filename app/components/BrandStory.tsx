"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import SmoothScroll from "./SmoothScroll";
import "./brand-story.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Iteration 9 (/v4): the Vajiram & Ravi brand story, after CANALS (canals-amsterdam.com, by Marcus
// Brown & Aristide Benoist). Same structure: a loader counter, a fixed left rail (menu, vertical
// title, progress line, emblem) that takes the color of the panel under it, and one long horizontal
// track of colored panels with giant numerals, three-line captions, circles, masked line reveals,
// SVG lines drawn on scroll and parallax photos. Vertical scrolling drives the track.
// All copy and figures come from the current site copy already in this app; nothing is invented.


const chapters = [
  { id: "bs-intro", no: "00", title: "Vajiram & Ravi" },
  { id: "bs-origin", no: "1976", title: "Origin" },
  { id: "bs-method", no: "02", title: "Method" },
  { id: "bs-results", no: "2025", title: "Results" },
  { id: "bs-reach", no: "2026", title: "Reach" },
  { id: "bs-credits", no: "—", title: "Credits" },
];

const pillars = [
  { title: "Experienced faculty", text: "Every subject is taught by faculty who know the UPSC syllabus inside out.", cir: "bs-cir-brand" },
  { title: "A structured method", text: "Classes, study material and tests follow one plan, from the first class to the interview.", cir: "bs-cir-ink" },
  { title: "Honest guidance", text: "Counsellors and mentors tell you where you stand and what to work on next.", cir: "bs-cir-line" },
];

const faculty = [
  { name: "SK Manocha", subject: "General Studies · Polity & Governance", img: "sk-manocha" },
  { name: "Brijender Singh", subject: "Essay", img: "brijender-singh" },
  { name: "Md. Rizwan", subject: "Geography optional", img: "md-rizwan" },
  { name: "Md. Tarique", subject: "History optional", img: "md-tarique" },
  { name: "Mukul Pathak", subject: "Psychology optional", img: "mukul-pathak" },
  { name: "Shyam Sundar", subject: "Economics optional", img: "shyam-sundar" },
];

const stats = [
  { value: "10", label: "Top 10", text: "Ranks 1 to 10 in UPSC CSE 2025 all prepared with Vajiram & Ravi.", cir: "bs-cir-brand" },
  { value: "59", label: "Prelims Test Series", text: "Questions in UPSC Prelims 2025 reflected from our Prelims Test Series.", cir: "bs-cir-paper" },
  { value: "9/10", label: "Interview Guidance", text: "Of the CSE 2025 top 10 took our Interview Guidance Programme.", cir: "bs-cir-line" },
];

const toppers = [
  { rank: "AIR 1 · CSE 2025", name: "Anuj Agnihotri", text: "Prepared for the Personality Test with our Interview Guidance Programme.", img: "anuj-agnihotri" },
  { rank: "AIR 2 · CSE 2025", name: "Rajeshwari Suve M", text: "Practised with our Prelims and Mains Test Series, then IGP.", img: "rajeshwari-suve-m" },
  { rank: "AIR 3 · CSE 2025", name: "Akansh Dhull", text: "Prepared in our GS Prelims-cum-Mains classroom programme.", img: "akansh-dhull" },
];

// Map frame for the Reach chapter: India's latitude/longitude box, plotted to scale.
const MAP = { lonMin: 68, lonMax: 98, latMin: 6, latMax: 37, w: 600, h: 620 };
const px = (lon: number) => ((lon - MAP.lonMin) / (MAP.lonMax - MAP.lonMin)) * MAP.w;
const py = (lat: number) => ((MAP.latMax - lat) / (MAP.latMax - MAP.latMin)) * MAP.h;
const centres = [
  { city: "New Delhi", area: "Old Rajinder Nagar / Pusa Road", lat: 28.64, lon: 77.18 },
  { city: "Chennai", area: "Egmore", lat: 13.08, lon: 80.26 },
];

/* ---------- small building blocks ---------- */

function Lines({ lines, className = "", hero = false }: { lines: string[]; className?: string; hero?: boolean }) {
  return (
    <div className={className}>
      {lines.map((l, i) => (
        <span key={i} className="bs-mask">
          <span data-reveal={hero ? undefined : ""} data-hero={hero ? "" : undefined}>
            {l}
          </span>
        </span>
      ))}
    </div>
  );
}

function Cap({ lines, className = "", style, hero = false }: { lines: [string, string, string]; className?: string; style?: React.CSSProperties; hero?: boolean }) {
  return (
    <div className={`bs-cap ${className}`} style={style}>
      {lines.map((l, i) => (
        <div key={i}>
          <span data-reveal={hero ? undefined : ""} data-hero={hero ? "" : undefined}>
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}

function Photo({ src, alt, className = "", style, sizes = "100vw", priority = false }: { src: string; alt: string; className?: string; style?: React.CSSProperties; sizes?: string; priority?: boolean }) {
  return (
    <div className={`bs-photo ${className}`} style={style}>
      <div className="bs-photo-in" data-parallax="">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      </div>
    </div>
  );
}

const u = (n: number) => `calc(var(--u) * ${n})`;

/* ---------- the horizontal story (inside the smoother) ---------- */

type TrackApi = { goTo: (id: string) => void };

function Track({
  railRef,
  progRef,
  countRef,
  loaderRef,
  apiRef,
}: {
  railRef: React.RefObject<HTMLDivElement | null>;
  progRef: React.RefObject<HTMLDivElement | null>;
  countRef: React.RefObject<HTMLSpanElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  apiRef: React.RefObject<TrackApi | null>;
}) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Plain effect, so the ScrollSmoother (created in SmoothScroll's layout effect) already exists.
  useEffect(() => {
    const pin = pinRef.current!;
    const track = trackRef.current!;
    const rail = railRef.current!;
    const loader = loaderRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoother = ScrollSmoother.get();
    const distance = () => track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      /* Vertical scroll -> horizontal track. */
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          pin: true,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: reduce ? true : 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progRef.current) progRef.current.style.transform = `scaleY(${self.progress})`;
          },
        },
      });

      apiRef.current = {
        goTo: (id) => {
          const el = document.getElementById(id);
          const st = tween.scrollTrigger;
          if (!el || !st) return;
          // Panel's left edge lined up with the rail: its offset in the track minus the rail padding.
          const offset = Math.min(el.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), distance());
          const y = st.start + (Math.max(0, offset) / distance()) * (st.end - st.start);
          if (smoother) smoother.scrollTo(y, !reduce);
          else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
        },
      };

      /* The rail takes the color of the panel at the screen's left edge; the counter shows the chapter. */
      gsap.utils.toArray<HTMLElement>("[data-panel]", track).forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: "left 5%",
          end: "right 5%",
          onToggle: (self) => {
            if (!self.isActive) return;
            rail.dataset.theme = panel.dataset.theme!;
            if (panel.dataset.chapter && countRef.current) countRef.current.textContent = panel.dataset.chapter;
          },
        });
      });

      if (reduce) return;

      /* Masked lines slide up as they enter from the right. */
      gsap.utils.toArray<HTMLElement>("[data-reveal]", track).forEach((el) => {
        gsap.set(el, { y: 0, yPercent: 102 }); // same start as the CSS, now owned by GSAP
        gsap.to(el, {
          yPercent: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 88%", toggleActions: "play none none reverse" },
        });
      });

      /* Circles pop in, numbers inside count up. */
      gsap.utils.toArray<HTMLElement>(".bs-cir", track).forEach((el, i) => {
        gsap.to(el, {
          scale: 1,
          duration: 1.1,
          ease: "back.out(1.6)",
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 90%", toggleActions: "play none none reverse" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-count]", track).forEach((el) => {
        const end = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 90%", toggleActions: "play none none none" },
        });
      });

      /* Hairlines and SVG lines draw with the scroll. */
      gsap.utils.toArray<HTMLElement>("[data-vline]", track).forEach((el) => {
        gsap.to(el, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 95%", end: "left 40%", scrub: true } });
      });
      gsap.utils.toArray<SVGElement>("[data-draw-group]", track).forEach((group) => {
        const paths = group.querySelectorAll<SVGPathElement>(".bs-draw");
        gsap.to(paths, {
          strokeDashoffset: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: { trigger: group, containerAnimation: tween, start: "left 85%", end: "right 60%", scrub: true },
        });
      });

      /* Photos drift inside their frames (CANALS parallax). */
      gsap.utils.toArray<HTMLElement>("[data-parallax]", track).forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -6 },
          { xPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
        );
      });
    }, pin);

    /* ---------- loader: count to 100 while the first photos load, then open on the hero ---------- */
    const counter = loader.querySelector<HTMLElement>("[data-loader-no]")!;
    const line = loader.querySelector<HTMLElement>("[data-loader-line]")!;
    const heroLines = pin.querySelectorAll<HTMLElement>("[data-hero]");
    const heroHuge = pin.querySelector<HTMLElement>("[data-hero-huge]");
    const heroVline = pin.querySelectorAll<HTMLElement>("[data-hero-vline]");
    smoother?.paused(true);
    window.scrollTo(0, 0);

    const imgs = Array.from(pin.querySelectorAll<HTMLImageElement>("img")).slice(0, 3);
    const ready = Promise.race([
      Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined)))),
      new Promise((r) => setTimeout(r, 4000)),
    ]);

    const loaderTl = gsap.timeline();
    const open = () => {
      const tl = gsap.timeline({ onComplete: () => smoother?.paused(false) });
      tl.to([counter.firstElementChild, line.firstElementChild], { yPercent: -102, duration: 0.8, ease: "expo.in", stagger: 0.05 })
        .to(loader, { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "-=0.1")
        .fromTo(heroHuge, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: "expo.out" }, "-=0.55")
        .to(heroLines, { yPercent: 0, y: 0, duration: 1.4, ease: "expo.out", stagger: 0.06 }, "<0.1")
        .to(heroVline, { scaleY: 1, duration: 1.6, ease: "expo.inOut" }, "<");
      loaderTl.add(tl);
    };

    if (reduce) {
      gsap.set(loader, { autoAlpha: 0 });
      smoother?.paused(false);
    } else {
      gsap.set(heroLines, { yPercent: 102 });
      const n = { v: 0 };
      loaderTl
        .set([counter.firstElementChild, line.firstElementChild], { y: 0, yPercent: 102 })
        .to([counter.firstElementChild, line.firstElementChild], { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.08 })
        .to(n, { v: 100, duration: 2.2, ease: "power2.inOut", onUpdate: () => (counter.firstElementChild!.textContent = String(Math.round(n.v))) }, 0.2)
        .add(() => {
          loaderTl.pause();
          ready.then(() => {
            loaderTl.resume();
            open();
          });
        });
    }

    return () => {
      loaderTl.kill();
      ctx.revert();
      apiRef.current = null;
    };
  }, [railRef, progRef, countRef, loaderRef, apiRef]);

  return (
    <div ref={pinRef} className="bs-pin">
      <div ref={trackRef} className="bs-track">
        {/* 00 — Intro (brand) */}
        <section id="bs-intro" data-panel="" data-theme="brand" data-chapter="00" className="bs-panel" style={{ width: u(170) }} aria-label="Vajiram & Ravi">
          <div className="absolute" style={{ left: u(8), top: u(4.5), width: u(76), height: u(91) }}>
            <p className="bs-huge" data-hero-huge="" style={{ marginLeft: u(-1) }} aria-label="50 years">
              50
            </p>
            <Lines hero className="bs-serif mt-[calc(var(--u)*2)]" lines={["years of preparing", "civil servants"]} />
          </div>
          <a href="#bs-origin" className="bs-serif absolute flex items-center gap-[calc(var(--u)*1.5)]" style={{ left: u(8), bottom: u(3.9) }}>
            <span className="bs-mask">
              <span data-hero="">Scroll →</span>
            </span>
          </a>
          <div className="bs-vline" data-hero-vline="" style={{ left: u(88), opacity: 0.6 }} />
          <div className="absolute" style={{ left: u(103), top: u(4.9), width: u(56) }}>
            <Lines
              hero
              className="bs-serif bs-indent"
              lines={["Since 1976, Vajiram", "& Ravi has prepared", "aspirants for every", "stage of the UPSC Civil", "Services Examination:", "Prelims, Mains and", "the interview."]}
            />
          </div>
          <Cap hero className="absolute" style={{ left: u(103), bottom: u(30) }} lines={["New Delhi · Chennai", "Since 1976", "UPSC Civil Services coaching"]} />
          <h1 className="bs-wide absolute" style={{ left: u(103), bottom: u(4.8), fontSize: u(9.4), lineHeight: 0.92 }}>
            <span className="bs-mask">
              <span data-hero="">Vajiram</span>
            </span>
            <span className="bs-mask">
              <span data-hero="">&amp; Ravi</span>
            </span>
          </h1>
        </section>

        {/* Photo — campus */}
        <section data-panel="" data-theme="image" data-chapter="00" className="bs-panel" style={{ width: u(153) }} aria-label="The campus">
          <Photo src="/v3/images/gallery/campus.webp" alt="The Vajiram & Ravi campus building with students walking outside" className="bs-photo-full" sizes="(min-aspect-ratio: 1/1) 153vh, 100vw" priority />
          <Cap className="bs-photo-cap" lines={["The campus", "Vajiram & Ravi", "Photograph from the current site"]} />
        </section>

        {/* 1976 — Origin (white) */}
        <section id="bs-origin" data-panel="" data-theme="white" data-chapter="1976" className="bs-panel" style={{ width: u(205) }} aria-labelledby="bs-origin-h">
          <Cap className="absolute" style={{ left: u(14.8), top: u(4.9) }} lines={["Chapter one", "Origin", "1976 to today"]} />
          <p className="bs-cas absolute text-[var(--bs-brand)]" style={{ left: u(13.5), top: u(16) }} aria-hidden>
            <span className="bs-mask">
              <span data-reveal="">19</span>
            </span>
            <span className="bs-mask">
              <span data-reveal="">76</span>
            </span>
          </p>
          <div className="absolute" style={{ left: u(80), top: u(16), width: u(62) }}>
            <h2 id="bs-origin-h" className="bs-label mb-[calc(var(--u)*3)]">
              <span className="bs-mask">
                <span data-reveal="">Where it began</span>
              </span>
            </h2>
            <Lines className="bs-serif bs-indent" lines={["Vajiram & Ravi began", "preparing aspirants for", "the UPSC Civil Services", "Examination in 1976."]} />
          </div>
          <div className="absolute" style={{ left: u(150), top: u(16), width: u(44) }}>
            <Lines className="bs-serif-sm opacity-60" lines={["Five decades on, the method", "is the same: a structured", "syllabus, regular tests and", "mentors who know the exam."]} />
          </div>

          {/* Timeline 1976 -> 2026, drawn on scroll */}
          <div className="absolute" style={{ left: u(14.8), right: u(10), bottom: u(9) }}>
            <svg data-draw-group="" viewBox="0 0 1000 60" preserveAspectRatio="none" className="block w-full" style={{ height: u(5) }} aria-hidden>
              <path className="bs-draw" pathLength={1} d="M0 30 H1000" />
              {Array.from({ length: 6 }, (_, i) => (
                <path key={i} className="bs-draw" pathLength={1} d={`M${i * 200} 12 V48`} />
              ))}
            </svg>
            <div className="mt-[calc(var(--u)*1.5)] flex justify-between">
              {[1976, 1986, 1996, 2006, 2016, 2026].map((y) => (
                <span key={y} className="bs-label bs-mask">
                  <span data-reveal="">{y}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Photo — library */}
        <section data-panel="" data-theme="image" data-chapter="1976" className="bs-panel" style={{ width: u(140) }} aria-label="The library">
          <Photo src="/v3/images/gallery/library.webp" alt="Aspirants studying together in the Vajiram & Ravi library" className="bs-photo-full" sizes="(min-aspect-ratio: 1/1) 140vh, 100vw" />
          <Cap className="bs-photo-cap" lines={["The library", "Study, together", "Photograph from the current site"]} />
        </section>

        {/* 02 — Method (paper) */}
        <section id="bs-method" data-panel="" data-theme="paper" data-chapter="02" className="bs-panel" style={{ width: u(190) }} aria-labelledby="bs-method-h">
          <Cap className="absolute" style={{ left: u(14.8), top: u(4.9) }} lines={["Chapter two", "Method", "Faculty, method, guidance"]} />
          <p className="bs-cas absolute text-[var(--bs-brand)]" style={{ left: u(13.5), top: u(16) }} aria-hidden>
            <span className="bs-mask">
              <span data-reveal="">02</span>
            </span>
          </p>
          <div className="absolute" style={{ left: u(14.8), bottom: u(4.8), width: u(58) }}>
            <h2 id="bs-method-h" className="bs-label mb-[calc(var(--u)*3)]">
              <span className="bs-mask">
                <span data-reveal="">One plan</span>
              </span>
            </h2>
            <Lines className="bs-serif bs-indent" lines={["Classes, study material", "and tests follow one", "plan, from the first", "class to the interview."]} />
          </div>
          <div className="bs-vline" data-vline="" style={{ left: u(84) }} />
          <ol className="absolute flex flex-col justify-between" style={{ left: u(96), top: u(6), bottom: u(6), width: u(84) }}>
            {pillars.map((p, i) => (
              <li key={p.title} className="flex items-center" style={{ gap: u(4) }}>
                <span className={`bs-cir ${p.cir}`} style={{ width: u(22), height: u(22) }}>
                  {i + 1}
                </span>
                <span>
                  <span className="bs-serif block">
                    <span className="bs-mask">
                      <span data-reveal="">{p.title}</span>
                    </span>
                  </span>
                  <Lines className="bs-cap mt-[calc(var(--u)*1.2)] opacity-70" lines={[p.text]} />
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Faculty (white) */}
        <section data-panel="" data-theme="white" data-chapter="02" className="bs-panel" style={{ width: u(196) }} aria-labelledby="bs-faculty-h">
          <div className="absolute" style={{ left: u(9), top: u(4.9), width: u(70) }}>
            <Cap lines={["Faculty", "Subject specialists", "For every GS paper, the essay and the optionals"]} />
          </div>
          <h2 id="bs-faculty-h" className="bs-serif absolute" style={{ left: u(100), top: u(4.9), width: u(86) }}>
            <Lines className="bs-indent" lines={["Learn from top educators."]} />
          </h2>
          <ul className="absolute flex" style={{ left: u(9), right: u(9), bottom: u(4.8), gap: u(2.6) }}>
            {faculty.map((f) => (
              <li key={f.name} className="flex-1">
                <Photo src={`/v3/images/faculty/${f.img}.webp`} alt={f.name} style={{ height: u(52) }} sizes="20vh" />
                <Cap className="mt-[calc(var(--u)*1.6)]" lines={[f.name, f.subject, "Faculty"]} />
              </li>
            ))}
          </ul>
        </section>

        {/* 2025 — Results (dark) */}
        <section id="bs-results" data-panel="" data-theme="dark" data-chapter="2025" className="bs-panel" style={{ width: u(268) }} aria-labelledby="bs-results-h">
          <Cap className="absolute" style={{ left: u(14.8), top: u(4.9) }} lines={["Chapter three", "Results", "Civil Services Examination 2025"]} />
          <p className="bs-cas absolute text-[var(--bs-brand-soft)]" style={{ left: u(13.5), top: u(16) }} aria-hidden>
            <span className="bs-mask">
              <span data-reveal="">20</span>
            </span>
            <span className="bs-mask">
              <span data-reveal="">25</span>
            </span>
          </p>
          <div className="absolute" style={{ left: u(14.8), bottom: u(4.8), width: u(60) }}>
            <h2 id="bs-results-h" className="bs-label mb-[calc(var(--u)*3)]">
              <span className="bs-mask">
                <span data-reveal="">Real results, real ranks</span>
              </span>
            </h2>
            <Lines className="bs-serif bs-indent" lines={["Ranks 1 to 10 in", "UPSC CSE 2025 all", "prepared with", "Vajiram & Ravi."]} />
          </div>
          <ul className="absolute flex flex-col justify-between" style={{ left: u(86), top: u(6), bottom: u(6), width: u(70) }}>
            {stats.map((s) => (
              <li key={s.label} className="flex items-center" style={{ gap: u(3.5) }}>
                <span className={`bs-cir ${s.cir}`} style={{ width: u(22), height: u(22), fontSize: s.value.length > 2 ? u(7.6) : u(9.5) }}>
                  {/^\d+$/.test(s.value) ? <span data-count={s.value}>{s.value}</span> : s.value}
                </span>
                <Cap lines={[s.label, "CSE 2025", s.text]} />
              </li>
            ))}
          </ul>
          <div className="bs-vline" data-vline="" style={{ left: u(166) }} />
          <ul className="absolute flex" style={{ left: u(176), right: u(8), top: u(6), bottom: u(4.8), gap: u(2.4) }}>
            {toppers.map((t) => (
              <li key={t.name} className="flex flex-1 flex-col">
                <Photo src={`/v3/images/toppers/${t.img}.webp`} alt={`${t.name}, ${t.rank}`} className="flex-1" sizes="20vh" />
                <Cap className="mt-[calc(var(--u)*1.6)]" style={{ minHeight: u(11) }} lines={[t.rank, t.name, t.text]} />
              </li>
            ))}
          </ul>
        </section>

        {/* 2026 — Reach (white) */}
        <section id="bs-reach" data-panel="" data-theme="white" data-chapter="2026" className="bs-panel" style={{ width: u(240) }} aria-labelledby="bs-reach-h">
          <Cap className="absolute" style={{ left: u(14.8), top: u(4.9) }} lines={["Chapter four", "Reach", "New Delhi · Chennai · Online"]} />
          <p className="bs-cas absolute text-[var(--bs-brand)]" style={{ left: u(13.5), top: u(16) }} aria-hidden>
            <span className="bs-mask">
              <span data-reveal="">20</span>
            </span>
            <span className="bs-mask">
              <span data-reveal="">26</span>
            </span>
          </p>
          <div className="absolute" style={{ left: u(14.8), bottom: u(4.8), width: u(62) }}>
            <h2 id="bs-reach-h" className="bs-label mb-[calc(var(--u)*3)]">
              <span className="bs-mask">
                <span data-reveal="">Two centres, every mode</span>
              </span>
            </h2>
            <Lines className="bs-serif bs-indent" lines={["Classes run in the", "classroom, live online", "and recorded, in", "English and Hindi."]} />
          </div>

          {/* Graticule map, to scale: 5° grid over India's lat/long box, the two centres plotted. */}
          <div className="absolute" style={{ left: u(90), top: u(5), height: u(90), aspectRatio: `${MAP.w} / ${MAP.h}` }}>
            <svg data-draw-group="" viewBox={`-10 -10 ${MAP.w + 20} ${MAP.h + 20}`} className="block h-full w-full overflow-visible" aria-label="Map grid showing the New Delhi and Chennai centres">
              <g opacity="0.35">
                {Array.from({ length: 6 }, (_, i) => 70 + i * 5).map((lon) => (
                  <path key={`lon${lon}`} className="bs-draw" pathLength={1} d={`M${px(lon)} 0 V${MAP.h}`} />
                ))}
                {Array.from({ length: 6 }, (_, i) => 10 + i * 5).map((lat) => (
                  <path key={`lat${lat}`} className="bs-draw" pathLength={1} d={`M0 ${py(lat)} H${MAP.w}`} />
                ))}
              </g>
              <path className="bs-draw" pathLength={1} d={`M0 0 H${MAP.w} V${MAP.h} H0 Z`} />
              <path className="bs-draw" pathLength={1} strokeDasharray="1" d={`M${px(centres[0].lon)} ${py(centres[0].lat)} L${px(centres[1].lon)} ${py(centres[1].lat)}`} style={{ stroke: "var(--bs-brand)" }} />
              {Array.from({ length: 6 }, (_, i) => 70 + i * 5).map((lon) => (
                <text key={`t${lon}`} x={px(lon) + 4} y={MAP.h - 8} fontSize="11" fill="currentColor" opacity="0.5" style={{ fontFamily: "var(--bs-sans)" }}>
                  {lon}°E
                </text>
              ))}
              {Array.from({ length: 6 }, (_, i) => 10 + i * 5).map((lat) => (
                <text key={`a${lat}`} x={6} y={py(lat) - 5} fontSize="11" fill="currentColor" opacity="0.5" style={{ fontFamily: "var(--bs-sans)" }}>
                  {lat}°N
                </text>
              ))}
              {centres.map((c) => (
                <g key={c.city} transform={`translate(${px(c.lon)} ${py(c.lat)})`}>
                  <circle r="9" fill="var(--bs-brand)" />
                  <circle r="20" fill="none" stroke="var(--bs-brand)" opacity="0.5" />
                  <text x="30" y="-4" fontSize="26" fill="currentColor" style={{ fontFamily: "var(--bs-serif)" }}>
                    {c.city}
                  </text>
                  <text x="30" y="20" fontSize="13" fill="currentColor" opacity="0.6" style={{ fontFamily: "var(--bs-sans)", fontStyle: "italic" }}>
                    {c.area}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <ul className="absolute flex flex-col justify-between" style={{ left: u(186), top: u(6), bottom: u(6), width: u(46) }}>
            {[
              ["Offline", "In the classroom", "New Delhi and Chennai"],
              ["Live online", "Same faculty, same plan", "Anywhere in India"],
              ["Recorded", "Watch at your own pace", "English and Hindi medium"],
            ].map((m, i) => (
              <li key={m[0]} className="flex items-center" style={{ gap: u(3) }}>
                <span className={`bs-cir ${["bs-cir-brand", "bs-cir-ink", "bs-cir-line"][i]}`} style={{ width: u(14), height: u(14), fontSize: u(6) }}>
                  {i + 1}
                </span>
                <Cap lines={m as [string, string, string]} />
              </li>
            ))}
          </ul>
        </section>

        {/* Photo — online */}
        <section data-panel="" data-theme="image" data-chapter="2026" className="bs-panel" style={{ width: u(150) }} aria-label="Online classes">
          <Photo src="/hero/online.jpg" alt="A student attending an online class on a laptop" className="bs-photo-full" sizes="(min-aspect-ratio: 1/1) 150vh, 100vw" />
          <Cap className="bs-photo-cap" lines={["Online", "Live and recorded classes", "Photograph: Unsplash"]} />
        </section>

        {/* Credits (brand), like the CANALS about page */}
        <section id="bs-credits" data-panel="" data-theme="brand" data-chapter="—" className="bs-panel" style={{ width: u(196) }} aria-labelledby="bs-credits-h">
          <h2 id="bs-credits-h" className="bs-wide absolute" style={{ left: u(14.8), top: u(4.9), fontSize: u(4.2) }}>
            <span className="bs-mask">
              <span data-reveal="">Credits</span>
            </span>
          </h2>
          <div className="absolute" style={{ left: u(14.8), top: u(18), width: u(62) }}>
            <Lines className="bs-serif bs-indent" lines={["A brand story of", "Vajiram & Ravi, told", "as an editorial,", "horizontal scroll.", "Iteration 9 of the", "homepage."]} />
          </div>
          <div className="absolute bs-serif-sm" style={{ left: u(88), top: u(18), width: u(52) }}>
            <Lines
              className="opacity-70"
              lines={["Figures and copy come from the", "current Vajiram & Ravi site.", "Campus, library, faculty and", "topper photographs: the current", "site. Online class photograph:", "Unsplash."]}
            />
            <p className="mt-[calc(var(--u)*3)]">
              <span className="bs-mask">
                <span data-reveal="">
                  Design after{" "}
                  <a className="bs-link" href="https://web.archive.org/web/20250811223929/https://canals-amsterdam.com/" target="_blank" rel="noreferrer">
                    CANALS
                  </a>
                </span>
              </span>
            </p>
          </div>
          <ul className="absolute flex flex-col" style={{ left: u(150), top: u(18), width: u(38), gap: u(3.4) }}>
            {[
              ["Design reference", "Marcus Brown & Aristide Benoist"],
              ["Type", "Libre Caslon Display, Newsreader, Hanken Grotesk, Archivo, Anton"],
              ["Client", "Vajiram & Ravi, since 1976"],
            ].map(([role, name], i) => (
              <li key={i} className="bs-cap">
                {role && (
                  <div>
                    <span data-reveal="">{role}</span>
                  </div>
                )}
                <div style={{ fontStyle: "normal", fontSize: u(2.4) }}>
                  <span data-reveal="">{name}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="absolute flex items-baseline" style={{ left: u(14.8), bottom: u(4.8), gap: u(6) }}>
            <button type="button" className="bs-serif bs-link cursor-pointer" onClick={() => apiRef.current?.goTo("bs-intro")}>
              ← Back to the start
            </button>
            <Link href="/" className="bs-label bs-link">
              All iterations
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- page shell: loader, rail and menu sit outside the smoother ---------- */

export default function BrandStory({ fontClass }: { fontClass: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<TrackApi | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    // Let the menu start closing before the long scroll begins.
    setTimeout(() => apiRef.current?.goTo(id), 250);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className={`bs ${fontClass}`}>
      {/* Brand duotone used on every photo: shadows brown-950, mids brand-600, highlights brand-50. */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="bs-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.176 0.82 0.996" />
            <feFuncG type="table" tableValues="0.125 0.341 0.973" />
            <feFuncB type="table" tableValues="0.114 0.055 0.925" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div ref={loaderRef} className="bs-loader" aria-hidden>
        <div className="bs-loader-no bs-wide" data-loader-no="">
          <span>0</span>
        </div>
        <div className="bs-loader-line bs-serif" data-loader-line="">
          <span>Vajiram &amp; Ravi, since 1976. Scroll to begin.</span>
        </div>
      </div>

      <nav ref={railRef} className="bs-rail" data-theme="brand" aria-label="Story">
        <div className="bs-rail-bg" />
        <button type="button" className="bs-burger" aria-expanded={menuOpen} aria-controls="bs-menu" aria-label={menuOpen ? "Close chapters" : "Open chapters"} onClick={() => setMenuOpen((o) => !o)}>
          <span className="bs-burger-lines">
            <span />
            <span />
          </span>
        </button>
        <div className="bs-prog-w">
          <div ref={progRef} className="bs-prog" />
        </div>
        <div className="bs-vert">
          <span className="bs-label bs-vert-title">Vajiram &amp; Ravi — a brand story</span>
          <span className="bs-vert-count">
            <span ref={countRef}>00</span>
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bs-emblem" src="/brand/vajiram-ravi-emblem.svg" alt="" />
      </nav>

      <div id="bs-menu" className="bs-menu" data-open={menuOpen} aria-hidden={!menuOpen}>
        <div className="bs-menu-bg" />
        <ul className="bs-menu-list">
          {chapters.map((c) => (
            <li key={c.id} className="bs-menu-li">
              <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => go(c.id)}>
                <span className="bs-menu-no">{c.no}</span>
                <span className="bs-menu-title">{c.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="bs-menu-foot bs-label">Since 1976 · New Delhi · Chennai</p>
      </div>

      <SmoothScroll>
        <Track railRef={railRef} progRef={progRef} countRef={countRef} loaderRef={loaderRef} apiRef={apiRef} />
      </SmoothScroll>
    </div>
  );
}
