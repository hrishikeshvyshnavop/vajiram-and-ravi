"use client";

import { useEffect } from "react";
import gsap from "gsap";

// Entrance animation for the About section (user 2026-11-09: "about section now plainly comes, implement animation to it"). Renders nothing; it finds
// #about and, once it is in view, plays one sequence:
//   1. the headline rises line by line from behind a mask (.rs-ab-line),
//   2. the eyebrow and the two paragraphs fade up,
//   3. the saffron highlights wipe in left to right like a marker pen (the --mk custom property on <mark>, 0% to 100%),
//   4. the closing note and the button rise,
//   and, a little later when the stats row comes into view: the four figures rise in turn and count up from 0 ([data-ab-count]).
// The sequences are started by an IntersectionObserver (not a scroll trigger), so they play however the visitor arrives: scrolling, an anchor link,
// a dragged scrollbar or a reload part-way down the page. Nothing is hidden without JavaScript (the server HTML is the finished state), and nothing runs for prefers-reduced-motion.

export default function AboutMotion() {
  useEffect(() => {
    const root = document.getElementById("about");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observers: (IntersectionObserver | null)[] = [];
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const lines = q(".rs-ab-line > span");
      const eyebrow = q(".rs-ab-eyebrow");
      const leads = q(".rs-ab-lead");
      const marks = q("mark");
      const foot = q(".rs-ab-note, .rs-ab-foot .rs-btn");
      const stats = q(".rs-ab-stats li");
      const counts = q("[data-ab-count]") as HTMLElement[];

      gsap.set(lines, { yPercent: 112 });
      gsap.set([...eyebrow, ...leads], { autoAlpha: 0, y: 28 });
      gsap.set(marks, { "--mk": "0%" });
      gsap.set(foot, { autoAlpha: 0, y: 20 });
      gsap.set(stats, { autoAlpha: 0, y: 34 });
      const finals = counts.map((el) => Number(el.dataset.abCount));
      counts.forEach((el) => (el.textContent = "0"));

      const intro = gsap
        .timeline({ defaults: { ease: "power3.out" }, paused: true })
        .to(lines, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.11 })
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.2)
        .to(leads, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.2 }, 0.4)
        .to(marks, { "--mk": "100%", duration: 0.75, ease: "power2.inOut", stagger: 0.15 }, 1.0)
        .to(foot, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, 1.4);

      const figures = gsap
        .timeline({ defaults: { ease: "power3.out" }, paused: true })
        .to(stats, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.13 })
        .add(() => {
          counts.forEach((el, i) => {
            const o = { v: 0 };
            gsap.to(o, { v: finals[i], duration: 1.7, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) });
          });
        }, 0.1);

      // play each sequence the first time its element is on screen: the intro when the section is 35% up from the bottom edge, the figures at 10%
      const watch = (el: Element | null | undefined, tl: gsap.core.Timeline, bottomInset: string) => {
        if (!el) return null;
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              tl.play();
              io.disconnect();
            }
          },
          { rootMargin: `0px 0px -${bottomInset} 0px`, threshold: 0 },
        );
        io.observe(el);
        return io;
      };
      observers.push(watch(root, intro, "35%"), watch(q(".rs-ab-stats")[0], figures, "10%"));
    }, root);

    return () => {
      observers.forEach((o) => o?.disconnect());
      ctx.revert();
    };
  }, []);

  return null;
}
