"use client";

import Btn from "./RecipeButton";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// /v5 hero after bowiesheroes.tilda.ws (user request 2026-11-06): a dark stage where two portraits
// face each other across a giant title, a stage light cuts through, and rows of names frame the
// title. Ours: AIR 1 Anuj Agnihotri and AIR 2 Rajeshwari Suve M (CSE 2025) in black and white,
// "TOPPERS of CSE 2025" in plain cream (the tricolour brush strokes were removed 2026-11-07). The AIR 3-10 name rows were removed 2026-11-07 (only the two portraits remain).
// Portraits: public/v5/hero/air{1,2}-faceoff.webp, made by scripts/v5-hero-toppers.mjs.
// The previous collage hero is kept at /v5-collage.
// Motion: portraits slide in from the edges, title letters rise, the tricolour wipes into them, the light
// sweeps; the cursor shifts the portraits and the light; on scroll the portraits part outward.

export type HeroTopper = { air: number; name: string };

function TitleLines({ animate = false }: { animate?: boolean }) {
  const char = animate ? { "data-hero-char": "" } : {};
  return (
    <>
      <span className="rs-fo-big block overflow-hidden">
        {"TOPPERS".split("").map((c, i) => (
          <span key={i} {...char} className="inline-block">
            {c}
          </span>
        ))}
      </span>
      <span className="rs-fo-small block overflow-hidden">
        {"OF CSE 2025".split("").map((c, i) => (
          <span key={i} {...char} className={c === " " ? "inline-block w-[0.28em]" : "inline-block"}>
            {c === " " ? "" : c}
          </span>
        ))}
      </span>
    </>
  );
}

export default function RecipeHeroFaceoff({ toppers }: { toppers: readonly HeroTopper[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const air1 = toppers.find((t) => t.air === 1)!;
  const air2 = toppers.find((t) => t.air === 2)!;

  useEffect(() => {
    const root = rootRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let cleanup = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.from("[data-face='l']", { xPercent: -30, autoAlpha: 0, duration: 1.6 }, 0)
        .from("[data-face='r']", { xPercent: 30, autoAlpha: 0, duration: 1.6 }, 0)
        .from("[data-light]", { autoAlpha: 0, rotate: -20, duration: 2.2, ease: "power2.out" }, 0)
        .from("[data-hero-kicker]", { autoAlpha: 0, y: 14, duration: 0.8 }, 0.15)
        .from("[data-hero-char]", { yPercent: 110, duration: 1.1, stagger: 0.05 }, 0.35)
        .from("[data-hero-sub]", { yPercent: 100, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.8)
        .from("[data-hero-cta] > *", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.08 }, 1.25);

      // scroll: the two portraits part outward, the title drifts up
      gsap.to("[data-face-wrap='l']", { xPercent: -14, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-face-wrap='r']", { xPercent: 14, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-hero-title]", { yPercent: -18, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });

      // cursor: portraits lean toward it, the light follows a little
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const lx = gsap.quickTo("[data-face-wrap='l'] [data-mouse]", "x", { duration: 1, ease: "power3.out" });
        const rx = gsap.quickTo("[data-face-wrap='r'] [data-mouse]", "x", { duration: 1, ease: "power3.out" });
        const lr = gsap.quickTo("[data-light]", "rotation", { duration: 1.4, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          lx(nx * 30);
          rx(nx * 30);
          lr(nx * 8);
        };
        root.addEventListener("pointermove", onMove);
        cleanup = () => root.removeEventListener("pointermove", onMove);
      }
    }, root);
    return () => {
      cleanup();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} data-stage="" className="rs-fo relative isolate overflow-hidden">
      {/* stage light */}
      <span data-light="" className="rs-fo-light" aria-hidden />
      <span className="rs-fo-grain" aria-hidden />

      {/* the two portraits, facing in from the edges */}
      <div data-face-wrap="l" className="rs-fo-wrap rs-fo-wrap--l" aria-hidden>
        <div data-mouse="">
          <Image data-face="l" src="/v5/hero/air1-faceoff.webp" alt="" width={1200} height={1200} priority sizes="(min-width: 1024px) 40vw, 70vw" className="rs-fo-img" />
        </div>
      </div>
      <div data-face-wrap="r" className="rs-fo-wrap rs-fo-wrap--r" aria-hidden>
        <div data-mouse="">
          <Image data-face="r" src="/v5/hero/air2-faceoff.webp" alt="" width={1200} height={1200} priority sizes="(min-width: 1024px) 40vw, 70vw" className="rs-fo-img" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1100px] flex-col items-center justify-center px-6 pt-[120px] pb-16 text-center">
        {/* the institute's name leads the text block (user 2026-11-09), then the title and the lines under it */}
        <p data-hero-kicker="" className="rs-fo-kicker">
          <span aria-hidden />
          <b>Vajiram &amp; Ravi</b><i className="rs-fo-kx"> · UPSC coaching</i> · since 1976
          <span aria-hidden />
        </p>
        <h1 data-hero-title="" className="rs-fo-title mt-5" aria-label={`Toppers of CSE 2025: ${air1.name}, AIR 1, and ${air2.name}, AIR 2, prepared with Vajiram & Ravi`}>
          <span className="relative block" aria-hidden>
            <TitleLines animate />
          </span>
        </h1>

        <p className="rs-fo-sub mt-7">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-sub="" className="block">
              They walked in with the same questions you have.
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-sub="" className="block text-[var(--rs-saffron)]">
              Let&apos;s get you to the same answer.
            </span>
          </span>
        </p>

        <div data-hero-cta="" className="mt-9 flex flex-wrap items-center justify-center gap-4">
          {/* a matched pair: two boxed buttons of the same size, one saffron (primary), one cream */}
          <Btn href="#enrol" variant="saffron" className="rs-fo-cta">Enrol for UPSC 2027</Btn>
          <Btn href="#toppers" variant="light" className="rs-fo-cta">Meet the toppers</Btn>
        </div>

      </div>

      {/* name plates under the portraits */}
      <p className="rs-fo-plate rs-fo-plate--l" aria-hidden>
        <b>AIR 1</b>
        {air1.name}
      </p>
      <p className="rs-fo-plate rs-fo-plate--r" aria-hidden>
        <b>AIR 2</b>
        {air2.name}
      </p>
    </section>
  );
}
