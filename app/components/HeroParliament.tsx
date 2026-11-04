"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hash, makeSmokeSprite } from "./smoke";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Scroll-story hero, after untillabs.com: a pinned full-screen stage (a GSAP pin rather than CSS sticky,
// so it also holds inside ScrollSmoother) where the Parliament mosaic
// fills the screen from the start (revealed by the preloader smoke), then the camera dives into
// one dark opening of the colonnade until the screen is black; through drifting dark smoke the chamber
// fades in out of the dark and settles to its full view.
// The story ends there, on the chamber with the last caption. Big captions step through the story at the bottom; a rail on the left tracks progress.
// Then the hand-off to the next section, after /scroll-demo: the captions and rail clear, the full-screen
// stage clips into a rounded card on the page column and a year counter runs 1976 → 2026, before the
// next section scrolls in.
// Drawn on a 2D canvas (no WebGL). Pauses off screen. Reduced motion gets one still frame.

const IMG = "/hero/parliament-mosaic.jpg";
const ROOM = "/hero/parliament-chamber.jpg";
const DARK = "rgb(18,15,12)"; // #120f0c, the iteration 4 hero ground
const END = 0.8; // progress at which the story stops: the chamber with the last caption
// Scroll split: the section is 700svh tall (600svh of scrolling). The story takes the first 400svh,
// the hand-off the last 200svh (the same two screens as /scroll-demo).
const STORY = 4 / 6;
const PAGE = "#fbf8f3"; // page ground that shows around the card
// One opening between two columns, in exterior image space (measured on the 1682×935 photo).
const DOOR = { x: 846 / 1682, y: 372 / 935, w: 30 / 1682, h: 128 / 935 };
const FOCUS = { x: DOOR.x + DOOR.w / 2, y: DOOR.y + DOOR.h / 2 };

const CAPTIONS = [
  { from: -1, to: 0.17, text: "In this building, India's Constitution was written." },
  { from: 0.21, to: 0.38, text: "Civil servants carry it into every district." },
  { from: 0.42, to: 0.6, text: "Since 1976, Vajiram & Ravi has prepared them for the exam." },
  { from: 0.64, to: 2, text: "Prelims, Mains and the interview: one topic, one test, one answer at a time." }, // stays
];
const STAGES = ["Prelims", "Mains", "Interview"];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// Opacity of a caption window, with short fades at both ends.
const windowAlpha = (p: number, from: number, to: number) => smooth(from - 0.02, from + 0.02, p) * (1 - smooth(to - 0.02, to + 0.02, p));

const PUFFS = 16;
const SMOKE_MAX = 0.8; // the smoke layer as a whole never covers the chamber more than this
export default function HeroParliament() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [hand, setHand] = useState(0); // 0 → 1 across the hand-off
  const [vw, setVw] = useState(1440);
  const [vh, setVh] = useState(900);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stageEl = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !stageEl || !canvas || !ctx) return;

    // Hold the stage on screen for the whole section, like `position: sticky; top: 0`.
    const pin = ScrollTrigger.create({ trigger: section, start: "top top", end: "bottom bottom", pin: stageEl, pinSpacing: false });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduceMotion);
    const img = new Image();
    img.src = IMG;
    const room = new Image();
    room.src = ROOM;
    const smoke = makeSmokeSprite("12,10,8"); // charcoal
    // The smoke is drawn on its own layer first, then laid over the chamber at most SMOKE_MAX opaque,
    // so overlapping puffs can never fully hide the interior.
    const smokeLayer = document.createElement("canvas");
    const sctx = smokeLayer.getContext("2d")!;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let frame = 0;
    let running = false;
    let shown = 0; // eased scroll fraction through the whole section
    let lastP = -1;
    const t0 = performance.now();

    const target = () => {
      if (reduceMotion) return 0.3 * (STORY / END);
      const r = section.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    };

    const layout = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      smokeLayer.width = canvas.width;
      smokeLayer.height = canvas.height;
    };

    img.onload = () => draw(performance.now());
    room.onload = () => draw(performance.now());

    // Cover-fit scale times the scroll zoom, centred on the focus point.
    const view = (z: number) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.max(w / iw, h / ih) * z;
      // Keep the focus point at screen centre once zoomed; at z=1 the image is simply centred.
      const k = smooth(1, 2.5, z);
      const fx = mix(iw / 2, FOCUS.x * iw, k);
      const fy = mix(ih / 2, FOCUS.y * ih, k);
      return { s, ox: w / 2 - fx * s, oy: h / 2 - fy * s };
    };


    const storyOf = (f: number) => clamp(f / STORY) * END;
    const handOf = (f: number) => clamp((f - STORY) / (1 - STORY));

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const pp = storyOf(shown);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Ground: dark, turning white once the zoom has finished.
      ctx.fillStyle = DARK;
      ctx.fillRect(0, 0, w, h);
      // Image callbacks can fire before the canvas has received a measurable
      // layout size (for example while its pinned stage is being attached).
      // Avoid drawing from a zero-sized offscreen canvas in that window.
      if (w <= 0 || h <= 0 || smokeLayer.width <= 0 || smokeLayer.height <= 0) return;
      if (!img.complete || !img.naturalWidth) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const cover = Math.max(w / iw, h / ih);
      // Dive into the dark opening until it fills the screen and everything is black, then the chamber
      // fades in out of the dark.
      const zIn = (1.04 * Math.max(w / (DOOR.w * iw), h / (DOOR.h * ih))) / cover; // opening covers the screen
      const z =
        pp < 0.2 ? 1 : pp < 0.42 ? mix(1, 1.35, smooth(0.2, 0.42, pp)) : 1.35 * (zIn / 1.35) ** smooth(0.42, 0.64, pp);
      const { s, ox, oy } = view(z);
      const dark = smooth(0.52, 0.64, pp); // the opening's shadow takes over the screen
      const fade = smooth(0.65, 0.74, pp); // chamber appears out of the black
      const roomReady = room.complete && room.naturalWidth > 0;

      // 1. Exterior, full screen from the start (the preloader smoke reveals it), going black as we enter.
      if (dark < 1) {
        ctx.save();
        // As the camera magnifies the photo its pixels show; soften it in step with the zoom.
        const soften = smooth(1.15, 4, z) * 8;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        if (soften > 0.3) ctx.filter = `blur(${soften.toFixed(1)}px)`;
        ctx.drawImage(img, ox, oy, iw * s, ih * s);
        ctx.filter = "none";
        ctx.fillStyle = `rgba(0,0,0,${dark})`;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Chamber, fading in from black and settling from 6% too close to its full view.
      if (roomReady && fade > 0) {
        const rw = room.naturalWidth;
        const rh = room.naturalHeight;
        const rs = Math.max(w / rw, h / rh) * mix(1.06, 1, smooth(0.65, 0.8, pp));
        ctx.globalAlpha = fade;
        ctx.drawImage(room, w / 2 - (rw * rs) / 2, h / 2 - (rh * rs) / 2, rw * rs, rh * rs);
        ctx.globalAlpha = 1;
      }

      // 3. Smoke: dark charcoal wisps hang over the chamber as it appears, then part outward and thin.
      // Smoke is there from the start: a light drift over the exterior that thickens as the camera
      // dives in (hiding the photo's pixels), then the chamber haze, which parts and thins.
      const outside = mix(0.3, 1, smooth(0.08, 0.45, pp)) * (1 - smooth(0.66, 0.74, pp));
      const haze = Math.max(outside, smooth(0.55, 0.66, pp)) * (1 - smooth(0.7, 0.8, pp));
      if (haze > 0.001 && smokeLayer.width > 0 && smokeLayer.height > 0) {
        const part = smooth(0.6, 0.8, pp);
        const base = Math.max(w, h);
        sctx.setTransform(1, 0, 0, 1, 0, 0);
        sctx.clearRect(0, 0, smokeLayer.width, smokeLayer.height);
        for (let i = 0; i < PUFFS; i++) {
          const n1 = hash(i, 1);
          const n2 = hash(i, 2);
          const n3 = hash(i, 3);
          const ang = n1 * Math.PI * 2;
          const dist = base * (0.05 + n2 * 0.35 + part * (0.35 + n3 * 0.45));
          const size = base * (0.45 + n3 * 0.55) * (1 + part * 0.4);
          const x = w / 2 + Math.cos(ang) * dist + Math.sin(t * 0.25 + i) * base * 0.02;
          const y = h / 2 + Math.sin(ang) * dist * 0.7 - part * base * 0.08 + Math.cos(t * 0.2 + i * 1.7) * base * 0.015;
          sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          sctx.globalAlpha = 0.45 + n2 * 0.4;
          sctx.translate(x, y);
          sctx.rotate(n1 * 6 + t * 0.03 * (n3 - 0.5));
          sctx.drawImage(smoke, -size / 2, -size / 2, size, size);
        }
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = SMOKE_MAX * haze;
        ctx.drawImage(smokeLayer, 0, 0);
        ctx.restore();
      }

      // Soft vignette keeps the captions readable.
      const v = ctx.createLinearGradient(0, h * 0.55, 0, h);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = (now: number) => {
      const tp = target();
      // ScrollSmoother already eases the scroll; only ease it here when scrolling is native.
      shown = ScrollSmoother.get() ? tp : shown + (tp - shown) * 0.12;
      if (Math.abs(tp - shown) < 0.0005) shown = tp;
      draw(now);
      if (Math.abs(shown - lastP) > 0.0005) {
        lastP = shown;
        setP(storyOf(shown));
        setHand(handOf(shown));
      }
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    layout();
    shown = target();
    setP(storyOf(shown));
    setHand(handOf(shown));
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);
    draw(performance.now());
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !reduceMotion ? start() : stop()));
    io.observe(section);

    return () => {
      stop();
      pin.kill();
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const stage = Math.min(STAGES.length - 1, Math.floor(clamp(p / 0.8) * STAGES.length));

  // Hand-off timeline (h: 0 → 1), the same beats as /scroll-demo: the overlays clear first, the stage
  // clips into a card from 0.15 to 0.75, the year block rises in at 0.5 and counts from 0.55 to 0.9.
  const h = reduced ? 0 : hand;
  const clearK = clamp(h / 0.25);
  const clipK = clamp((h - 0.15) / 0.6);
  const insetY = vh * 0.12 * clipK;
  const insetX = (vw >= 768 ? 72 : 20) * clipK;
  const yearsK = clamp((h - 0.5) / 0.15);
  const countK = clamp((h - 0.55) / 0.35);
  const countEase = countK < 0.5 ? 2 * countK * countK : 1 - (-2 * countK + 2) ** 2 / 2; // power1.inOut-like
  const year = Math.round(mix(1976, 2026, countEase));
  const overlay = { opacity: 1 - clearK, transform: `translateY(${clearK * 60}px)` };

  return (
    <section
      ref={sectionRef}
      className={`relative ${reduced ? "h-svh" : "h-[700svh]"}`}
      style={{ backgroundColor: h > 0 ? PAGE : "#120f0c" }}
    >
      <div
        ref={stageRef}
        className="h-svh overflow-hidden bg-[#120f0c]"
        style={clipK > 0 ? { clipPath: `inset(${insetY}px ${insetX}px round ${24 * clipK}px)` } : undefined}
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        {/* Dark wash as the card forms (as on /scroll-demo), so the year block reads over the chamber. */}
        {clipK > 0 && (
          <div aria-hidden className="absolute inset-0" style={{ opacity: clipK }}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        )}

        {/* Year counter, revealed during the hand-off */}
        {!reduced && (
          <div
            aria-hidden={yearsK < 0.5}
            className="pointer-events-none absolute z-10 text-white"
            style={{
              left: insetX + (vw >= 768 ? 32 : 20),
              bottom: insetY + (vw >= 768 ? 40 : 28),
              opacity: yearsK,
              transform: `translateY(${(1 - yearsK) * 30}px)`,
            }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/70">Years of UPSC preparation</p>
            <p className="font-headline text-[18vw] leading-none tracking-[-0.03em] tabular-nums md:text-[9vw]">{year}</p>
            <p className="mt-3 max-w-[40ch] text-sm leading-5 text-white/80">
              Five decades of preparing aspirants for Prelims, Mains and the interview.
            </p>
          </div>
        )}

        {/* Progress rail */}
        {!reduced && (
          <div aria-hidden className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 md:left-8 md:block" style={{ opacity: 1 - clearK }}>
            <div className="relative h-56 w-px bg-white/20">
              <div className="absolute left-0 top-0 w-px bg-white" style={{ height: `${clamp(p / 0.8) * 100}%` }} />
              <div className="absolute -left-[3px] size-[7px] rounded-full bg-white" style={{ top: `calc(${clamp(p / 0.8) * 100}% - 3px)` }} />
            </div>
            <ul className="mt-4 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em]">
              {STAGES.map((s, i) => (
                <li key={s} className={i === stage ? "text-white" : "text-white/40"}>
                  {String(i + 1).padStart(2, "0")} {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Story captions */}
        {!reduced && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[12svh] z-10 px-5 text-center" style={overlay}>
            {CAPTIONS.map(c => {
              const a = windowAlpha(p, c.from, c.to);
              return (
                <p
                  key={c.text}
                  aria-hidden={a < 0.5}
                  className="absolute inset-x-5 bottom-0 mx-auto max-w-[22ch] font-headline text-[34px]/[1.05] tracking-[-0.03em] text-balance text-white md:text-[56px]/[1.04]"
                  style={{ opacity: a, transform: `translateY(${(1 - a) * 16}px)`, filter: `blur(${(1 - a) * 6}px)` }}
                >
                  {c.text}
                </p>
              );
            })}
            <p className="absolute inset-x-0 -bottom-12 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70" style={{ opacity: 1 - smooth(0.04, 0.1, p) }}>
              [ Scroll to discover ]
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
