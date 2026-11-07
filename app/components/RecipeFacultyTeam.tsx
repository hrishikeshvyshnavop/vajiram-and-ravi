"use client";

import Btn from "./RecipeButton";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Roll } from "./Roll";

gsap.registerPlugin(ScrollTrigger);

// "Learn from the specialists" as the team section of monument.tv (user request 2026-11-06,
// replacing the lanyard ID cards, which stay in RecipeFaculty.tsx unused).
// A deep-red screen pins with a huge dark title. As you scroll, a numbered list fades in over it
// (number · name · subject) and the scroll steps through the six faculty: the active row turns
// cream, the rest dim, and the active teacher's portrait floats over the title, swapping with a
// clip wipe. Hovering or focusing a row also selects it. Phones: no pin, a tap-to-select list.

export type Specialist = { name: string; subject: string; detail: string; img: string };

/**
 * `entry="sweep"` (variant): the team arrives over the toppers paper the way the footer arrives over the team: a ragged,
 * angled top edge sweeps in from the left and flattens as it lands, while the paper darkens under a black veil.
 * `entry="plain"` (default): the team simply scrolls in.
 */
export default function RecipeFacultyTeam({ specialists, entry = "plain", look = "dark" }: { specialists: readonly Specialist[]; entry?: "plain" | "sweep"; look?: "dark" | "collage" }) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // On from the start (2026-11-07): the first teacher is shown the moment the section arrives, not a title-only screen.
  const [listOn, setListOn] = useState(true);
  const barRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const n = specialists.length;
        const prevSection = root.previousElementSibling as HTMLElement | null;
        const sweepIn = entry === "sweep" && !reduce && prevSection?.id === "toppers";
        let sweepTrigger: ScrollTrigger | null = null;
        if (sweepIn) {
          // Same ragged edge as the team -> footer hand-off, mirrored: it flattens over one screen of scroll as the team's top
          // climbs from the bottom of the screen to the top. Compositor-cheap: only clip-path on one element + one opacity.
          const xs = [0, 17, 38, 61, 83, 100];
          const lag = [0, 0.14, 0.05, 0.3, 0.46, 0.62];
          const paperVeil = document.querySelector<HTMLElement>(".rs-paper-veil");
          let lastEntry = "";
          const applyEntry = (p: number) => {
            const vh = window.innerHeight;
            const k = 1 - p;
            const clip = p >= 0.999 ? "" : `polygon(${xs.map((x, i) => `${x}% ${Math.round(lag[i] * vh * k)}px`).join(", ")}, 100% 100%, 0% 100%)`;
            if (clip === lastEntry) return; // perf: no style write when nothing changed
            lastEntry = clip;
            root.style.clipPath = clip;
          };
          applyEntry(0);
          sweepTrigger = ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => {
              applyEntry(self.progress);
              if (paperVeil) paperVeil.style.opacity = (0.6 * self.progress).toFixed(3);
            },
            onLeaveBack: () => {
              if (paperVeil) paperVeil.style.opacity = "0";
            },
          });
        }
        // Pace and hand-off after monument.tv's team section (user 2026-11-06), measured at 1440x900:
        // ~0.38 of a screen of scroll per person (was 0.7), then a one-screen hand-off in which the next
        // section (the footer) slides up over the held team with a ragged, angled top edge that sweeps in
        // from the left and flattens as it lands, while the team darkens (black veil to 75%) and its giant
        // title shrinks to 85% and lifts away. The hand-off runs only when the programmes section (or the footer) follows directly.
        const STEP = 38; // % of the viewport per slice (title slice + one per teacher)
        const steps = (n + 1) * STEP;
        const next = root.nextElementSibling as HTMLElement | null;
        const handoff = !reduce && !!next && ["why", "manifesto", "programmes", "resources", "batches", "contact"].includes(next.id);
        const HANDOFF = handoff ? 100 : 0;
        const total = steps + HANDOFF;

        // perf: remember what was last written so a scroll frame only touches what actually changed
        let lastIdx = -1;
        let lastUi = "";
        let lastSp = -1;
        const pin = pinRef.current;
        const bar = barRef.current;
        const rail = railRef.current;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${total}%`,
            pin: "[data-team-pin]",
            scrub: true,
            onUpdate: (self) => {
              // steps use the first part of the pin; first slice: only the title; then one per teacher
              const sp = Math.min(1, (self.progress * total) / steps);
              const idx = Math.max(0, Math.min(n - 1, Math.floor(sp * (n + 1) - 1)));
              // React re-renders only when the teacher changes (6 times), never per frame
              if (idx !== lastIdx) {
                lastIdx = idx;
                setActive(idx);
              }
              // The list, portrait, kicker and progress fade out over the first 30% of the hand-off (CSS variable;
              // a GSAP tween on them left opacity:0 inline for good). Written only while it changes: setting a custom
              // property on the pin restyles its whole subtree.
              const hp = Math.max(0, Math.min(1, (self.progress * total - steps) / (HANDOFF * 0.3 || 1)));
              const ui = (1 - hp).toFixed(3);
              if (ui !== lastUi) {
                lastUi = ui;
                pin?.style.setProperty("--team-ui", ui);
              }
              // progress bar + rail: compositor-only transforms, skipped when unchanged
              const spr = Math.round(sp * 1000) / 1000;
              if (spr !== lastSp) {
                lastSp = spr;
                if (bar) bar.style.transform = `scaleX(${spr})`;
                if (rail) rail.style.transform = `scaleY(${spr})`;
              }
            },
          },
        });
        tl.to({}, { duration: steps }); // the stepping part: nothing animates on the timeline

        if (handoff && next) {
          // the footer overlaps the last screen of the pin, above the team
          gsap.set(next, { marginTop: "-100vh", position: "relative", zIndex: 2 });
          // ragged top edge: six points across; the left leads, the right lags (px of lag at the start)
          const xs = [0, 17, 38, 61, 83, 100];
          const lag = [0, 0.14, 0.05, 0.3, 0.46, 0.62];
          const edge = { p: 0 };
          const title = root.querySelector<HTMLElement>("[data-team-title]");
          let lastEdge = "";
          let layered = false;
          const applyEdge = () => {
            const vh = window.innerHeight;
            const k = 1 - edge.p;
            const running = edge.p > 0 && edge.p < 0.999;
            // perf: the footer and the title get their own compositor layers only while the hand-off runs, so the
            // clip only re-rasterises a mask and the title moves without repainting; dropped again after
            if (running !== layered) {
              layered = running;
              next.style.willChange = running ? "transform" : "";
              if (title) title.style.willChange = running ? "transform" : "";
            }
            const clip = edge.p >= 0.999 ? "" : `polygon(${xs.map((x, i) => `${x}% ${Math.round(lag[i] * vh * k)}px`).join(", ")}, 100% 100%, 0% 100%)`;
            if (clip === lastEdge) return;
            lastEdge = clip;
            next.style.clipPath = clip; // cleared once landed: no mask left on the footer
          };
          applyEdge();
          tl.to(edge, { p: 1, duration: HANDOFF, ease: "power1.inOut", onUpdate: applyEdge }, steps)
            .to(".rs-team-veil", { opacity: 0.75, duration: HANDOFF, ease: "none" }, steps)
            .to("[data-team-title]", { scale: 0.85, y: () => -window.innerHeight * 0.35, transformOrigin: "0% 0%", duration: HANDOFF, ease: "power1.in" }, steps);
          return () => {
            gsap.set(next, { clearProps: "marginTop,position,zIndex,clipPath,willChange" });
            sweepTrigger?.kill();
            root.style.clipPath = "";
          };
        }
        if (!reduce) {
          gsap.from("[data-team-title] > span", { yPercent: 100, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 70%" } });
        }
      });
      mm.add("(max-width: 1023px)", () => {
        setListOn(true);
      });
    }, root);
    return () => ctx.revert();
  }, [specialists.length, entry]);

  return (
    <section ref={rootRef} id="faculty" className={`rs-team${look === "collage" ? " rs-team--collage" : ""}`}>
      <div ref={pinRef} data-team-pin="" className="rs-team-pin">
        {/* darkens as the next section slides over (hand-off after monument.tv) */}
        <span className="rs-team-veil" aria-hidden />
        <h2 data-team-title="" className="rs-team-title" aria-label="Great ranks require great teachers: learn from the specialists">
          {["Great", "ranks", "require", "great", "teachers"].map((w, i) => (
            <span key={i} className="rs-team-line block overflow-hidden" aria-hidden>
              <span className="block">{w}</span>
            </span>
          ))}
        </h2>

        <p className="rs-team-kicker">
          Faculty · <span lang="hi" className="rs-hi normal-case">विषय विशेषज्ञ</span>
          <span className="rs-team-kicker-sub">Learn from the specialists</span>
        </p>

        {/* the floating portrait of the active teacher */}
        <figure className={`rs-team-photo ${listOn ? "is-on" : ""}`} aria-hidden>
          {specialists.map((f, i) => (
            <Image key={f.img} src={`/v3/images/faculty/${f.img}.webp`} alt="" fill sizes="(min-width: 1024px) 20vw, 60vw" className={`rs-team-photo-img object-cover object-top ${i === active ? "is-active" : ""}`} />
          ))}
        </figure>

        <div className={`rs-team-list ${listOn ? "is-on" : ""}`}>
        {/* progress rail beside the numbers: fills as the scroll steps through the teachers */}
        <span className="rs-team-rail" aria-hidden>
          <span ref={railRef} className="rs-team-rail-fill" />
        </span>
        <ol>
          {specialists.map((f, i) => (
            <li key={f.name}>
              <button type="button" className={`rs-team-row ${i === active ? "is-active" : ""}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={i === active}>
                <span className="rs-team-num">{i + 1}</span>
                <span className="rs-team-name">{f.name}</span>
                <span className="rs-team-role">
                  {f.subject}
                  <small> · {f.detail}</small>
                </span>
              </button>
            </li>
          ))}
        </ol>
        </div>

        {/* scroll progress through the six teachers (desktop, where the section is pinned) */}
        <div className={`rs-team-progress ${listOn ? "is-on" : ""}`} aria-hidden>
          <span className="rs-team-count">
            <b>{String(active + 1).padStart(2, "0")}</b> / {String(specialists.length).padStart(2, "0")}
          </span>
          <span className="rs-team-track">
            <span ref={barRef} className="rs-team-bar" />
          </span>
        </div>

        <Btn href="#enrol" variant="ink" className="rs-team-cta">Learn with them</Btn>
      </div>
    </section>
  );
}
