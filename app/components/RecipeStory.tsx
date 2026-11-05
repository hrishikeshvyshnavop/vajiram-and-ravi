"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "./SmoothScroll";
import RecipeLeadForm from "./RecipeLeadForm";
import RecipeFooter from "./RecipeFooter";
import SectionMotif from "./SectionMotifs";
import RecipeHeader from "./RecipeHeader";
import "./recipe-story.css";

gsap.registerPlugin(ScrollTrigger);

// Iteration 10 (/v5): "The Recipe for Rank 1", after eathungrytiger.com (Hungry Tiger sauce).
// Their idea, carried over: a loud packaging-style landing where one product object (the jar)
// rides the scroll, spins to show its label and "what's inside", then hands over to ingredients,
// a nutrition label, "why the jar matters" cards, a marquee and recipe cards. Here the product is
// the V&R study kit (a 3D book), the nutrition label is a programme facts label, and the recipes
// are programmes. Copy and figures come from the site copy already in this app and the domain notes.

const ingredients = ["Structured syllabus", "Study material", "Regular tests", "Mentors who know the exam", "Interview guidance"];


const pillars = [
  { kicker: "Taught in", title: "Experienced faculty", text: "Every subject is taught by faculty who know the UPSC syllabus inside out." },
  { kicker: "Tested often", title: "A structured method", text: "Classes, study material and tests follow one plan, from the first class to the interview." },
  { kicker: "Guided through", title: "Honest guidance", text: "Counsellors and mentors tell you where you stand and what to work on next." },
];

const programmes = [
  { tags: ["Foundation", "11 months"], name: "Classroom GS PCM 2027", text: "Prelims-cum-Mains General Studies in the classroom, with study material and regular tests.", img: "/hero/classroom.jpg" },
  { tags: ["Foundation", "Online"], name: "Online GS PCM 2027", text: "The same programme online, so you can prepare from wherever you are.", img: "/hero/online.jpg" },
  { tags: ["Prelims", "Test series"], name: "Prelims Test Series", text: "Topic-wise and full-length tests with detailed explanations.", img: "/hero/prelims.jpg" },
  { tags: ["Interview", "IGP"], name: "Interview Guidance Programme", text: "9 of the CSE 2025 top 10 prepared for the Personality Test with it.", img: "/hero/interview.jpg" },
];

// CSE 2025 top 10 and the V&R programmes each took, as listed on the current site (/v3 Toppers).
const toppers = [
  { air: 1, name: "Anuj Agnihotri", img: "anuj-agnihotri", took: ["Interview Guidance Programme"] },
  { air: 2, name: "Rajeshwari Suve M", img: "rajeshwari-suve-m", took: ["PowerUp Prelims Test Series", "IGP", "Mains Test Series"] },
  { air: 3, name: "Akansh Dhull", img: "akansh-dhull", took: ["GS Prelims cum Mains Classroom"] },
  { air: 4, name: "Raghav Jhunjhunwala", img: "raghav-jhunjhunwala", took: ["IGP"] },
  { air: 5, name: "Ishan Bhatnagar", img: "ishan-bhatnagar", took: ["Sociology Optional", "Prelims CAMP", "IGP"] },
  { air: 6, name: "Zinnia Aurora", img: "zinnia-aurora", took: ["GS Ethics Module", "IGP", "Power Up 23"] },
  { air: 7, name: "A R Rajah Mohaideen", img: "a-r-rajah-mohaideen", took: ["IGP"] },
  { air: 8, name: "Pakshal Secretry", img: "pakshal-secretry", took: ["Mains Camp", "IGP"] },
  { air: 9, name: "Astha Jain", img: "astha-jain", took: ["IGP"] },
  { air: 10, name: "Ujjwal Priyank", img: "ujjwal-priyank", took: ["IGP"] },
];

// Faculty and subjects as listed on the current site (/v3 Educators).
const specialists = [
  { name: "SK Manocha", subject: "General Studies", detail: "Polity & Governance", img: "sk-manocha" },
  { name: "Brijender Singh", subject: "Essay", detail: "Mains", img: "brijender-singh" },
  { name: "Md. Rizwan", subject: "Geography", detail: "Optional", img: "md-rizwan" },
  { name: "Md. Tarique", subject: "History", detail: "Optional", img: "md-tarique" },
  { name: "Mukul Pathak", subject: "Psychology", detail: "Optional", img: "mukul-pathak" },
  { name: "Shyam Sundar", subject: "Economics", detail: "Optional", img: "shyam-sundar" },
];

const facts: { k: string; v: string; cls?: string }[] = [
  { k: "Programme length", v: "11 months", cls: "thick" },
  { k: "Stages covered", v: "Prelims · Mains · Interview" },
  { k: "Modes", v: "Classroom · Live online · Recorded" },
  { k: "Mediums", v: "English · Hindi" },
  { k: "Centres", v: "New Delhi · Chennai", cls: "mid" },
  { k: "CSE 2025 top 10 prepared with V&R", v: "10 of 10" },
  { k: "Top 10 who took our IGP", v: "9 of 10" },
  { k: "Prelims 2025 questions reflected in our PTS", v: "59" },
  { k: "Years of UPSC preparation", v: "50", cls: "mid" },
];

/* ---------- pieces ---------- */


// Hero collage by the V&R team (vr-homepage-v25.vercel.app, "hero__stage"), reused here in place
// of the study-kit book. Layer boxes are % of the 1536x952 backdrop, measured from that page at
// 1440px; DOM order is stacking order. Each layer also names the part of the syllabus it stands for,
// shown when the collage "explodes" in "What's inside".
type Layer = { id: string; w: number; h: number; box: [number, number, number]; depth: number; tag?: string; tagAt?: [number, number] };
const layers: Layer[] = [
  { id: "bg", w: 1536, h: 952, box: [0, 0, 100], depth: -80, tag: "GS I · Geography", tagAt: [71, 42] },
  { id: "satellite", w: 219, h: 161, box: [64.4, 13.0, 14.6], depth: 70, tag: "GS III · Science & Tech" },
  { id: "rocket", w: 73, h: 255, box: [79.4, 22.8, 4.75], depth: 60 },
  { id: "temple", w: 357, h: 380, box: [23.3, 28.7, 23.3], depth: -10, tag: "GS I · Art & Culture" },
  { id: "pillar", w: 309, h: 628, box: [41.4, 10.6, 20.1], depth: 0, tag: "GS II · Polity" },
  { id: "manuscript", w: 301, h: 285, box: [16.0, 47.9, 19.6], depth: 20, tag: "GS I · History" },
  { id: "book", w: 340, h: 348, box: [48.0, 39.7, 22.2], depth: 40, tag: "GS II · Constitution" },
  { id: "metro", w: 383, h: 192, box: [66.7, 60.5, 25.0], depth: 30, tag: "GS III · Economy" },
  { id: "wheel", w: 343, h: 276, box: [12.2, 62.9, 22.3], depth: 50, tag: "GS I · Freedom struggle" },
  { id: "gandhi", w: 339, h: 376, box: [26.1, 48.9, 22.0], depth: 60, tag: "GS IV · Ethics" },
  { id: "parliament", w: 593, h: 280, box: [43.1, 69.7, 38.6], depth: 70, tag: "GS II · Governance" },
  { id: "front", w: 1153, h: 189, box: [11.6, 80.7, 75.0], depth: 100, tag: "GS III · Environment", tagAt: [28, 22] },
];

function IndiaCollage() {
  return (
    <div className="rs-collage" data-collage="">
      {layers.map((l) => (
        <div key={l.id} data-layer="" data-depth={l.depth} className={`rs-layer rs-layer-${l.id}`} style={{ left: `${l.box[0]}%`, top: `${l.box[1]}%`, width: `${l.box[2]}%` }}>
          <div data-mouse="" className="will-change-transform">
            <Image src={`/v5/hero/${l.id}.webp`} alt="" width={l.w} height={l.h} sizes={`${Math.ceil(l.box[2] * 0.6)}vw`} className="block h-auto w-full" priority />
          </div>
          {l.tag && (
            <span data-tag="" className="rs-tag-pop rs-pill" style={{ left: `${l.tagAt?.[0] ?? 50}%`, top: `${l.tagAt?.[1] ?? 50}%` }}>
              {l.tag}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- the page ---------- */

function Story() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mouseCleanup = () => {};
    const ctx = gsap.context(() => {
      const collage = root.querySelector<HTMLElement>("[data-collage]")!;
      const mover = root.querySelector<HTMLElement>("[data-mover]")!;
      const layerEls = gsap.utils.toArray<HTMLElement>("[data-layer]", collage);

      // Each layer sits at its own depth, so tilting the collage shows real parallax.
      layerEls.forEach((el) => gsap.set(el, { z: Number(el.dataset.depth) }));
      // Tags all float at one depth in front of every layer, so no image can cover a tag.
      gsap.utils.toArray<HTMLElement>("[data-tag]", collage).forEach((t) => gsap.set(t, { z: 240 - Number(t.parentElement!.dataset.depth) }));
      const backdrop = collage.querySelector<HTMLElement>(".rs-layer-bg img")!;

      // Intro: title letters drop in; the collage rises from below the fold, layers settling in turn.
      if (!reduce) {
        gsap.from("[data-hero-char]", { yPercent: 110, rotate: 8, duration: 1.1, ease: "back.out(1.4)", stagger: 0.035, delay: 0.15 });
        gsap.from("[data-hero-fade]", { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.08, delay: 0.5 });
        gsap.from(mover, { yPercent: 40, duration: 1.6, ease: "expo.out", delay: 0.3 });
        gsap.from(layerEls.slice(1), { y: 80, autoAlpha: 0, duration: 1.1, ease: "back.out(1.3)", stagger: 0.06, delay: 0.45 });
      }

      // Mouse parallax: each piece drifts with the cursor by its depth (deeper = further), and the
      // collage tilts a little toward it. Runs on inner wrappers, so it never fights the scroll timeline.
      if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const stage = root.querySelector<HTMLElement>("[data-stage]")!;
        const tilt = root.querySelector<HTMLElement>("[data-mouse-tilt]")!;
        const movers = layerEls.map((el) => {
          const inner = el.querySelector<HTMLElement>("[data-mouse]")!;
          const k = (Number(el.dataset.depth) + 90) / 190; // backdrop ~0, front ~1
          return { k, x: gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" }), y: gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" }) };
        });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.1, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.1, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * 46 * m.k);
            m.y(ny * 30 * m.k);
          });
          ry(nx * 8);
          rx(-ny * 6);
        };
        const onLeave = () => {
          movers.forEach((m) => {
            m.x(0);
            m.y(0);
          });
          rx(0);
          ry(0);
        };
        stage.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerleave", onLeave);
        mouseCleanup = () => {
          stage.removeEventListener("pointermove", onMove);
          stage.removeEventListener("pointerleave", onLeave);
        };
      }

      // Explode: every layer moves away from the collage centre, in proportion to its distance.
      const spread = (el: HTMLElement, axis: "x" | "y") => {
        const box = collage.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const c = axis === "x" ? (r.left + r.width / 2 - box.left) / box.width - 0.5 : (r.top + r.height / 2 - box.top) / box.height - 0.55;
        return c * (axis === "x" ? box.width : box.height) * 0.42;
      };

      // The pinned stage: hero -> "A new angle" (tilt, parallax) -> "What's inside" (exploded syllabus map), held until unpin.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: "[data-stage]", pin: true, start: "top top", end: "+=210%", scrub: reduce ? true : 0.8, invalidateOnRefresh: true },
      });
      tl.to("[data-hero-layer]", { yPercent: -60, autoAlpha: 0, duration: 1 }, 0)
        .to(mover, { y: () => -window.innerHeight * 0.2, x: () => window.innerWidth * 0.15, scale: 0.8, duration: 1 }, 0)
        .to(collage, { rotateY: -22, rotateX: 10, duration: 1.4 }, 0.6)
        .fromTo("[data-phase-a] [data-line]", { yPercent: 105 }, { yPercent: 0, stagger: 0.08, duration: 0.5 }, 0.8)
        .fromTo("[data-phase-a] [data-fade]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 1)
        .to("[data-phase-a]", { autoAlpha: 0, y: -40, duration: 0.4 }, 2.1)
        .to(collage, { rotateY: 0, rotateX: 0, duration: 0.5 }, 2.1)
        .to(layerEls.slice(1), { x: (_, el) => spread(el, "x"), y: (_, el) => spread(el, "y"), duration: 0.6, ease: "power2.out" }, 2.2)
        .to(backdrop, { autoAlpha: 0.55, duration: 0.6 }, 2.2)
        .fromTo("[data-phase-b] [data-line]", { yPercent: 105 }, { yPercent: 0, stagger: 0.08, duration: 0.5 }, 2.3)
        .fromTo("[data-phase-b] [data-fade]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2.5)
        .to("[data-tag]", { scale: 1, autoAlpha: 1, stagger: 0.05, duration: 0.35, ease: "back.out(2)" }, 2.6)
        // Hold on the labelled syllabus view, then unpin: the next section scrolls up over it.
        // (No fly-off exit: it left about a screen of empty background before the next section.)
        .to({}, { duration: 0.35 });

      // "Just a plan in every class": words light up one by one as the section scrolls.
      gsap.to("[data-fill] .rs-fill-word", {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: "[data-fill]", start: "top 85%", end: "top 35%", scrub: true },
      });

      if (reduce) return;

      // Generic pop-in for headings and cards.
      gsap.utils.toArray<HTMLElement>("[data-pop]").forEach((el) => {
        gsap.from(el, { y: 60, rotate: 3, autoAlpha: 0, duration: 0.9, ease: "back.out(1.4)", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      // Result cards count up; the 1976 -> 2026 line draws across with the scroll.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v))), scrollTrigger: { trigger: el, start: "top 85%" } });
      });
      gsap.fromTo("[data-grow]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 90%", end: "top 45%", scrub: true } });
      // AIR 1 lands like a rubber stamp.
      gsap.from("[data-stamp]", { scale: 2.4, rotate: -12, autoAlpha: 0, duration: 0.8, ease: "back.out(1.8)", scrollTrigger: { trigger: "[data-stamp]", start: "top 80%" } });
      gsap.utils.toArray<HTMLElement>("[data-tilt-photo]").forEach((el, i) => {
        gsap.fromTo(el, { rotate: i % 2 ? 4 : -4, y: 40 }, { rotate: 0, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true } });
      });
    }, root);
    return () => {
      mouseCleanup();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* ---------- pinned stage: hero, spin, what's inside ---------- */}
      <section data-stage="" className="rs-grain relative h-screen overflow-hidden bg-[var(--rs-rust)]">
        <SectionMotif variant="newsprint" className="!text-inherit" />

        <div data-hero-layer="" className="rs-dots absolute inset-x-7 top-[78px]" />
        <div data-hero-layer="" className="absolute inset-x-0 top-0 px-7 pt-[96px]">
          <p data-hero-fade="" className="rs-small text-center text-[15px]">Vajiram &amp; Ravi · UPSC coaching since 1976</p>
          <h1 className="rs-display mt-3 overflow-hidden text-center text-[5vw] leading-[0.95] whitespace-nowrap" aria-label="Your UPSC journey starts here: Civil Services preparation">
            {"YOUR UPSC JOURNEY STARTS HERE".split("").map((c, i) => (
              <span key={i} data-hero-char="" className={c === " " ? "inline-block w-[0.3em]" : "inline-block"} aria-hidden>
                {c === " " ? "" : c}
              </span>
            ))}
          </h1>
          <div data-hero-fade="" className="rs-dots mt-5" />
          <p data-hero-fade="" className="rs-display mt-5 text-center text-[3.6vw]">
            IAS · IPS · IFS · and every Civil Service
          </p>
          <p data-hero-fade="" lang="hi" className="rs-hi mt-1 text-center text-[1.7vw] opacity-80">
            सिविल सेवा परीक्षा की तैयारी · प्रारंभिक · मुख्य · साक्षात्कार
          </p>
        </div>

        <div data-hero-layer="" className="absolute bottom-6 left-7 z-10 max-w-[300px]">
          <p data-hero-fade="" className="rs-small text-[14px] leading-snug">
            One preparation for the UPSC Civil Services Examination, whichever service you aim for. Classroom and online courses, test series and interview guidance, from Prelims to the Personality Test.
          </p>
          <div data-hero-fade="" className="mt-5 flex flex-wrap gap-2">
            <a href="#enrol" className="rs-pill">
              Enrol for UPSC 2027
            </a>
            <a href="#programmes" className="rs-pill !bg-transparent !text-[var(--rs-saffron)] ring-2 ring-[var(--rs-saffron)]">
              Courses
            </a>
          </div>
        </div>

        {/* Proof, bottom right: the CSE 2025 result. */}
        <a data-hero-layer="" href="#toppers" className="group absolute right-7 bottom-6 z-10 block max-w-[300px] rounded-2xl bg-[var(--rs-saffron)] p-5 text-[var(--rs-deep)] transition-transform duration-300 hover:-rotate-2">
          <span data-hero-fade="" className="block">
            <span className="rs-small block opacity-70">UPSC CSE 2025</span>
            <span className="rs-display mt-2 block text-[44px] leading-[0.9]">AIR 1 to 10</span>
            <span className="mt-2 block text-[14px] leading-snug">All India Ranks 1 to 10 prepared with Vajiram &amp; Ravi. Meet the toppers →</span>
          </span>
        </a>

        {/* Phase A: a new angle */}
        <div data-phase-a="" className="pointer-events-none absolute inset-0 px-7 pt-[110px]">
          <h2 className="rs-display text-[7.6vw]">
            <span className="block overflow-hidden">
              <span data-line="" className="block">A new angle</span>
            </span>
            <span className="block overflow-hidden">
              <span data-line="" className="block">on preparation</span>
            </span>
          </h2>
          <p data-fade="" className="absolute right-7 bottom-10 max-w-[300px] text-lg leading-snug">
            Fifty years of UPSC preparation, seen from every side: the history, the polity, the economy and the people who shaped India.
          </p>
        </div>

        {/* Phase B: what's inside */}
        <div data-phase-b="" className="pointer-events-none absolute inset-0 px-7 pt-[110px]">
          <h2 className="rs-display text-[7.6vw]">
            <span className="block overflow-hidden">
              <span data-line="" className="block">What&apos;s</span>
            </span>
            <span className="block overflow-hidden">
              <span data-line="" className="block">inside</span>
            </span>
          </h2>
          <p data-fade="" className="absolute right-7 bottom-10 max-w-[320px] text-lg leading-snug">
            The whole UPSC syllabus, GS I to GS IV, taken apart piece by piece. Our GS Prelims cum Mains programme covers every one of them.
          </p>
        </div>

        {/* The collage (by the V&R team), in place of the jar */}
        <div data-mover="" className="rs-collage-wrap absolute left-1/2 -translate-x-1/2" style={{ top: "40%" }}>
          <div data-mouse-tilt="" className="[transform-style:preserve-3d]">
            <IndiaCollage />
          </div>
        </div>
      </section>

      {/* ---------- what makes it work: ingredients + facts label ---------- */}
      <section className="rs-grain relative overflow-hidden bg-[var(--rs-deep)] px-7 py-28">
        <div className="relative mx-auto grid max-w-[1380px] gap-14 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <h2 data-pop="" className="rs-display text-[clamp(56px,8vw,128px)]">
              What makes
              <br />
              it work
            </h2>
            <p data-pop="" className="mt-8 max-w-[440px] text-xl leading-snug text-[var(--rs-cream)]/85">
              Nothing to hide. Just real classes, regular tests and honest guidance, from the first class to the interview.
            </p>
            <ul className="mt-12 flex flex-wrap gap-3">
              {ingredients.map((x) => (
                <li key={x} data-pop="" className="rs-pill">
                  {x}
                </li>
              ))}
            </ul>
            <div className="rs-dots mt-12 max-w-[560px]" />
            <ul className="rs-small mt-6 flex flex-col gap-2 text-[var(--rs-cream)]/70">
              <li>No shortcuts</li>
              <li>No one-size-fits-all plan</li>
              <li>No guessing where you stand</li>
            </ul>
          </div>

          <div data-pop="" className="rs-label rounded-xl p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:rotate-[2deg]">
            <p className="rs-display text-[44px] leading-none">Programme facts</p>
            <p className="mt-2 text-sm">GS Prelims cum Mains 2027 · Vajiram &amp; Ravi</p>
            <div className="mt-4">
              {facts.map((f) => (
                <div key={f.k} className={`rs-label-row ${f.cls ?? ""}`}>
                  <span>{f.k}</span>
                  <span className="rs-display text-right text-[15px] tracking-normal">{f.v}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t-4 border-[var(--rs-deep)] pt-3 text-xs leading-snug">
              Contains: tests. Figures from Civil Services Examination 2025 and the current Vajiram &amp; Ravi site.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- no fillers, no shortcuts ---------- */}
      <section className="grid md:grid-cols-2">
        <div className="rs-grain relative flex min-h-[100svh] flex-col justify-between bg-[var(--rs-deep)] p-7">
          <h2 data-pop="" className="rs-display text-[clamp(44px,5vw,80px)] leading-[0.9]">
            No fillers.
            <br />
            No shortcuts.
          </h2>
          <p data-fill="" className="rs-display text-[clamp(48px,6.4vw,104px)] leading-[0.88]">
            {"Just a plan in every class".split(" ").map((w, i) => (
              <span key={i} className="rs-fill-word">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
        <div className="relative min-h-[100svh] overflow-hidden bg-[var(--rs-orange)]">
          <SectionMotif variant="jaali" className="!text-white/[0.13] [mask-image:linear-gradient(135deg,#000_20%,transparent_75%)]" />
          <div data-tilt-photo="" className="absolute inset-[9%] overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <Image src="/v3/images/gallery/library.webp" alt="Aspirants studying together in the Vajiram & Ravi library" fill sizes="45vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ---------- tradition & results ---------- */}
      <section id="tradition" className="rs-grain relative overflow-hidden bg-[var(--rs-rust)] px-7 py-28">
        <SectionMotif variant="chakra" className="!text-black/20" />
        <div className="relative mx-auto max-w-[1380px]">
          <div className="grid gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
            {/* Left: the claim, and the place it happens */}
            <div className="flex flex-col">
              <p data-pop="" className="rs-small text-[14px] opacity-80">
                Since 1976 · <span lang="hi" className="rs-hi normal-case">स्थापना १९७६</span>
              </p>
              <h2 data-pop="" className="rs-display mt-4 text-[clamp(56px,7.4vw,120px)]">
                Tradition
                <br />
                &amp; results
              </h2>
              <p data-pop="" className="mt-8 max-w-[480px] text-xl leading-snug text-[var(--rs-cream)]/85">
                Since 1976, Vajiram &amp; Ravi has prepared aspirants for every stage of the UPSC Civil Services Examination: Prelims, Mains and the interview. Five decades on, the method is the same.
              </p>
              <div data-tilt-photo="" className="relative mt-12 aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-2xl ring-[6px] ring-[var(--rs-saffron)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
                <Image src="/v3/images/gallery/campus.webp" alt="The Vajiram & Ravi campus building with students outside" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                <span className="rs-pill absolute bottom-4 left-4 !h-10 !text-[12px]">The V&amp;R campus</span>
              </div>
            </div>

            {/* Right: three results, as saffron cards that count up */}
            <ol className="flex flex-col gap-5 md:pt-6">
              {[
                { n: 50, unit: "years", hi: "५० वर्ष", text: "Of taking aspirants from their first class to the interview.", src: "1976 – 2026" },
                { n: 59, unit: "questions", hi: "५९ प्रश्न", text: "In UPSC Prelims 2025 reflected from our Prelims Test Series.", src: "Prelims Test Series" },
                { n: 9, unit: "of the top 10", hi: "१० में से ९", text: "Toppers of UPSC CSE 2025 took our Interview Guidance Programme.", src: "Interview Guidance Programme" },
              ].map((c, i) => (
                <li key={c.unit} data-pop="" className={`rs-grain relative overflow-hidden rounded-2xl bg-[var(--rs-saffron)] p-7 text-[var(--rs-deep)] md:p-8 ${i === 1 ? "md:ml-10" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="rs-small text-[12px] opacity-60">0{i + 1}</span>
                    <span lang="hi" className="rs-hi text-[15px] opacity-70">
                      {c.hi}
                    </span>
                  </div>
                  <p className="mt-2 flex items-baseline gap-3">
                    <span data-count={c.n} className="rs-display text-[clamp(72px,8vw,120px)] leading-[0.85] tabular-nums">
                      {c.n}
                    </span>
                    <span className="rs-display text-[clamp(22px,2.2vw,32px)]">{c.unit}</span>
                  </p>
                  <div className="rs-dots my-5" style={{ "--rs-saffron": "var(--rs-deep)" } as React.CSSProperties} />
                  <p className="max-w-[440px] text-[17px] leading-snug">{c.text}</p>
                  <p className="rs-small mt-3 text-[11px] opacity-60">{c.src}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Timeline 1976 -> 2026, drawn with the scroll */}
          <div data-timeline="" className="mt-32">
            <div className="relative h-[3px] bg-[var(--rs-saffron)]/20">
              <div data-grow="" className="absolute inset-0 origin-left bg-[var(--rs-saffron)]" />
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--rs-saffron)]" style={{ left: `${i * 20}%` }} />
              ))}
              {/* 2025 = 49 of 50 years along the line: the CSE 2025 result. */}
              <span className="absolute top-1/2 left-[98%] size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--rs-rust)] bg-[var(--rs-cream)]" />
              <span className="absolute bottom-full left-[98%] mb-0 hidden h-8 w-[2px] -translate-x-1/2 bg-[var(--rs-cream)] md:block" />
              <a href="#toppers" className="rs-pill absolute bottom-full left-[98%] mb-8 !hidden !h-10 -translate-x-[85%] whitespace-nowrap !bg-[var(--rs-cream)] !text-[12px] md:!inline-flex">
                2025 · AIR 1–10 ↓
              </a>
            </div>
            <div className="relative mt-5 h-24">
              {[
                { y: "1976", t: "Vajiram & Ravi begins preparing aspirants", at: 0 },
                { y: "1986", t: "", at: 20 },
                { y: "1996", t: "", at: 40 },
                { y: "2006", t: "", at: 60 },
                { y: "2016", t: "", at: 80 },
                { y: "2026", t: "Admissions for 2027 are open", at: 100 },
              ].map((m) => (
                <div key={m.y} className={`absolute top-0 ${m.at === 0 ? "" : m.at === 100 ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"}`} style={{ left: `${m.at}%` }}>
                  <p className={`rs-display ${m.t ? "text-[clamp(28px,3vw,44px)]" : "text-[clamp(18px,1.6vw,24px)] opacity-60"}`}>{m.y}</p>
                  {m.t && <p className="mt-1 max-w-[220px] text-[14px] leading-snug text-[var(--rs-cream)]/80">{m.t}</p>}
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* ---------- meet the toppers: CSE 2025 AIR 1-10 ---------- */}
      <section id="toppers" className="rs-grain relative overflow-hidden bg-[var(--rs-deep)] px-7 py-28">
        <SectionMotif variant="kolam" className="!text-[var(--rs-saffron)]/[0.07]" />
        <div className="relative mx-auto max-w-[1380px]">
          <p data-pop="" className="rs-small text-center opacity-80">UPSC Civil Services Examination 2025 · Final result</p>
          <h2 data-pop="" className="rs-display mt-4 text-center text-[clamp(56px,9vw,150px)]">
            Meet the
            <br />
            toppers
          </h2>
          <p data-pop="" className="mx-auto mt-6 max-w-[520px] text-center text-xl leading-snug text-[var(--rs-cream)]/85">
            All India Ranks 1 to 10, all prepared with Vajiram &amp; Ravi.
          </p>

          {/* AIR 1, the headline topper */}
          <article className="mt-16 grid items-stretch gap-5 md:grid-cols-[1fr_1.15fr]">
            <div data-tilt-photo="" className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--rs-saffron)] md:aspect-auto md:min-h-[620px]">
              <Image src={`/v3/images/toppers/${toppers[0].img}.webp`} alt={`${toppers[0].name}, AIR 1 in CSE 2025`} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-top" />
              <span className="rs-pill absolute top-5 left-5">AIR 1 · UPSC CSE 2025 topper</span>
            </div>
            <div className="rs-grain relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[var(--rs-saffron)] p-8 text-[var(--rs-deep)] md:p-10">
              <div className="flex items-start justify-between gap-6">
                <p className="rs-small">All India Rank</p>
                <p className="rs-small text-right">UPSC CSE 2025</p>
              </div>
              <p data-stamp="" className="rs-display text-[clamp(160px,22vw,360px)] leading-[0.78]">
                <span className="text-[0.32em] align-top">AIR</span>1
              </p>
              <div>
                <div className="rs-dots" style={{ "--rs-saffron": "var(--rs-deep)" } as React.CSSProperties} />
                <h3 className="rs-display mt-6 text-[clamp(44px,5vw,80px)] leading-[0.88]">{toppers[0].name}</h3>
                <p className="mt-4 max-w-[460px] text-lg leading-snug">Prepared for the Personality Test with our Interview Guidance Programme.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {toppers[0].took.map((t) => (
                    <span key={t} className="rs-tag !h-9 !px-4 !text-[12px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* AIR 2-10 */}
          <ul className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3">
            {toppers.slice(1).map((w) => (
              <li key={w.air} data-pop="" className="group rounded-xl bg-[var(--rs-saffron)] p-3 pb-6 text-[var(--rs-deep)] transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-1.5deg]">
                <div className="relative aspect-square overflow-hidden rounded-md bg-[var(--rs-cream)]">
                  <Image src={`/v3/images/toppers/${w.img}.webp`} alt={`${w.name}, AIR ${w.air} in CSE 2025`} fill sizes="(min-width: 768px) 30vw, 45vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <span className="rs-display absolute right-2 bottom-1 text-[64px] leading-none text-[var(--rs-saffron)] [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">{w.air}</span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <span className="rs-tag">AIR {w.air}</span>
                  <span className="rs-tag">CSE 2025</span>
                </div>
                <h3 className="rs-display mt-4 text-[22px] leading-[0.95]">{w.name}</h3>
                <p className="mt-2 text-[13px] leading-snug opacity-80">{w.took.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- why the method matters ---------- */}
      <section className="rs-grain relative bg-[var(--rs-saffron)] px-7 py-28 text-[var(--rs-deep)]">
        <div className="relative mx-auto max-w-[1380px]">
          <h2 data-pop="" className="rs-display text-center text-[clamp(56px,8vw,128px)]">
            Why the method
            <br />
            matters
          </h2>
          <p data-pop="" className="mx-auto mt-6 max-w-[520px] text-center text-xl leading-snug">
            One plan keeps every hour of study pointed at the exam, so nothing you learn goes to waste.
          </p>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {pillars.map((p, i) => (
              <article key={p.title} data-pop="" className="rs-grain relative overflow-hidden rounded-2xl bg-[var(--rs-deep)] p-7 text-[var(--rs-saffron)]">
                <p className="rs-small opacity-70">0{i + 1}</p>
                <p className="rs-display mt-10 text-[42px] leading-[0.9]">{p.kicker}</p>
                <div className="rs-dots my-6" />
                <p className="rs-display text-[22px]">{p.title}</p>
                <p className="mt-3 leading-snug text-[var(--rs-cream)]/80">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- specialists: the faculty ---------- */}
      <section id="faculty" className="rs-grain relative overflow-hidden bg-[var(--rs-rust)] py-28">
        <SectionMotif variant="buti" className="!text-black/[0.14]" />
        <div className="relative mx-auto max-w-[1380px] px-7">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <p data-pop="" className="rs-small text-[14px] opacity-80">
                Faculty · <span lang="hi" className="rs-hi normal-case">विषय विशेषज्ञ</span>
              </p>
              <h2 data-pop="" className="rs-display mt-4 text-[clamp(52px,6.4vw,104px)] whitespace-nowrap">
                Learn from the
                <br />
                specialists
              </h2>
            </div>
            <div data-pop="">
              <p className="max-w-[460px] text-xl leading-snug text-[var(--rs-cream)]/85">
                Subject specialists for every GS paper, the essay, the optionals and the interview. Every subject is taught by faculty who know the UPSC syllabus inside out.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["GS papers", "Essay", "Optionals", "Interview"].map((t) => (
                  <span key={t} className="inline-flex h-9 items-center rounded-full border border-[var(--rs-saffron)]/50 px-4 text-[13px] text-[var(--rs-cream)]/85">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phones: swipe row with snap. Desktop: 3 x 2 grid. */}
        <ul className="relative mx-auto mt-14 flex max-w-[1380px] snap-x snap-mandatory gap-5 overflow-x-auto px-7 pb-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {specialists.map((f, i) => (
            <li key={f.name} data-pop="" className="group w-[78vw] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none">
              <article className="h-full rounded-2xl bg-[var(--rs-saffron)] p-3.5 pb-6 text-[var(--rs-deep)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1.2deg]">
                <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-[var(--rs-cream)]">
                  <Image src={`/v3/images/faculty/${f.img}.webp`} alt={`${f.name}, ${f.subject} faculty at Vajiram & Ravi`} fill sizes="(min-width: 768px) 30vw, 78vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <span className="rs-tag absolute top-3 left-3">0{i + 1}</span>
                  {/* The subject, big, slides up on hover like a label being pulled from the jar. */}
                  <span className="rs-display absolute inset-x-0 bottom-0 translate-y-full bg-[var(--rs-deep)]/85 px-4 py-3 text-[26px] text-[var(--rs-saffron)] transition-transform duration-500 group-hover:translate-y-0">
                    {f.subject}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rs-tag">{f.subject}</span>
                  <span className="rs-tag !bg-transparent !text-[var(--rs-deep)] ring-1 ring-[var(--rs-deep)]/40">{f.detail}</span>
                </div>
                <h3 className="rs-display mt-4 text-[clamp(26px,2.4vw,34px)] leading-[0.95]">{f.name}</h3>
                <p className="mt-2 text-[14px] opacity-75">Faculty, Vajiram &amp; Ravi</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- photo strip + marquee ---------- */}
      <section className="rs-grain relative bg-[var(--rs-saffron)] text-[var(--rs-deep)]">
        <div className="grid md:grid-cols-3">
          {[
            ["/v3/images/gallery/campus.webp", "The Vajiram & Ravi campus building"],
            ["/hero/classroom.jpg", "Aspirants in a classroom"],
            ["/hero/mains.jpg", "An aspirant writing a Mains answer"],
          ].map(([src, alt], i) => (
            <div key={src} className="relative border-[var(--rs-deep)]/25 px-7 py-16 md:border-l md:first:border-l-0">
              <div data-tilt-photo="" className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={src} alt={alt} fill sizes="33vw" className="object-cover" priority={i === 0} />
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden border-y-[3px] border-dotted border-[var(--rs-deep)]/40 bg-[var(--rs-orange)] py-6 text-[var(--rs-saffron)]">
          <div className="rs-marquee" aria-hidden>
            {Array.from({ length: 2 }, (_, k) => (
              <p key={k} className="rs-display shrink-0 pr-10 text-[clamp(56px,9vw,150px)] whitespace-nowrap">
                Unlock the rank inside you ✺ Prelims ✺ Mains ✺ Interview ✺{" "}
              </p>
            ))}
          </div>
          <p className="sr-only">Unlock the rank inside you: Prelims, Mains, Interview.</p>
        </div>
      </section>

      {/* ---------- let's get preparing (recipe cards -> programmes) ---------- */}
      <section id="programmes" className="rs-grain relative overflow-hidden bg-[var(--rs-rust)] px-7 py-28">
        <div className="relative mx-auto max-w-[1380px]">
          <h2 data-pop="" className="rs-display text-center text-[clamp(56px,8vw,128px)]">
            Let&apos;s get
            <br />
            preparing
          </h2>
          <div className="mt-8 flex justify-center">
            <Link href="/v3" className="rs-pill">
              All programmes
            </Link>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map((p) => (
              <article key={p.name} data-pop="" className="group rounded-xl bg-[var(--rs-saffron)] p-3.5 pb-8 text-[var(--rs-deep)] transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-1deg]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image src={p.img} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="mt-3 flex gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rs-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="rs-display mt-6 text-[28px] leading-[0.92]">{p.name}</h3>
                <p className="mt-3 text-[15px] leading-snug">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- lead form: get your recipe ---------- */}
      <section id="enrol" className="rs-grain relative overflow-hidden bg-[var(--rs-saffron)] px-7 py-28 text-[var(--rs-deep)]">
        <SectionMotif variant="rangoli" className="!text-black/[0.09]" />
        <div className="relative mx-auto grid max-w-[1380px] gap-12 md:grid-cols-[1fr_1.05fr] md:items-start">
          <div className="md:sticky md:top-28">
            <p data-pop="" className="rs-small">Admissions for 2027 are open</p>
            <h2 data-pop="" className="rs-display mt-4 text-[clamp(64px,9vw,150px)]">
              Get your
              <br />
              recipe
            </h2>
            <p data-pop="" className="mt-8 max-w-[440px] text-xl leading-snug">
              Tell us where you are in your preparation. A counsellor will call you back and help you pick the right programme.
            </p>
            <div className="rs-dots mt-10 max-w-[480px]" style={{ "--rs-saffron": "var(--rs-deep)" } as React.CSSProperties} />
            <ul className="rs-small mt-6 flex flex-col gap-2 text-[13px]">
              <li>✺ Free counselling call</li>
              <li>✺ New Delhi · Chennai · Online</li>
              <li>✺ English and Hindi medium</li>
            </ul>
          </div>
          <div data-pop="" className="md:-rotate-[1.5deg]">
            <RecipeLeadForm />
          </div>
        </div>
      </section>

      {/* ---------- footer: full link set ---------- */}
      <RecipeFooter />
    </div>
  );
}

export default function RecipeStory({ fontClass }: { fontClass: string }) {
  return (
    <div className={`rs ${fontClass}`}>
      {/* Header lives outside the smoother so it stays fixed. */}
      <RecipeHeader />

      <SmoothScroll keepHash={false}>
        <Story />
      </SmoothScroll>
    </div>
  );
}
