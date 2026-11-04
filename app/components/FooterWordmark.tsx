"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Giant wordmark under the footer card, cropped at the page's bottom edge, animated like
// primefold's: it stays pinned to the bottom of the viewport while the card scrolls up and
// uncovers it (their `position: sticky; bottom: 0`, which ScrollSmoother can't use), and
// fades from 20% to full opacity over that reveal.
export default function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const card = el?.parentElement?.previousElementSibling as HTMLElement | null;
    if (!el || !card) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: () => -card.offsetHeight, opacity: 0.2 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            // Measure the untransformed wrapper, not the element being moved.
            trigger: el.parentElement,
            // Over the last card-height of scrolling, counter-move exactly 1:1 so the
            // wordmark holds still at the bottom of the screen while the card lifts away.
            start: () => `bottom bottom+=${card.offsetHeight}`,
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    // With native scrolling nothing else re-measures when the page grows after load (fonts,
    // `content-visibility` sections rendering), which would leave the reveal ending short of the
    // real bottom. Refresh ScrollTrigger whenever the document height changes.
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastHeight = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const hgt = document.documentElement.scrollHeight;
      if (Math.abs(hgt - lastHeight) < 1) return;
      lastHeight = hgt;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div aria-hidden className="relative z-0 mx-auto w-full max-w-[1440px] px-5 pt-6 md:px-[72px] md:pt-8">
      <div ref={ref} className="aspect-[1280/138] overflow-hidden will-change-transform">
        <svg viewBox="0 0 1280 200" className="block h-auto w-full" fill="#1a1814">
          <text
            x="0"
            y="175"
            textLength="1280"
            lengthAdjust="spacingAndGlyphs"
            fontSize="204"
            style={{ fontFamily: "var(--font-stack-headline), Arial, sans-serif", letterSpacing: "-0.01em" }}
          >
            Vajiram &amp; Ravi
          </text>
        </svg>
      </div>
    </div>
  );
}
