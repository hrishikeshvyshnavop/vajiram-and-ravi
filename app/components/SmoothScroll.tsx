"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// GSAP ScrollSmoother around the page sections. Created in a layout effect so it exists
// before the sections' own ScrollTriggers (plain effects) are set up. Fixed elements such as
// the header must live outside this wrapper. Touch devices keep native scrolling.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: reduceMotion ? 0 : 1.1,
      effects: true,
      smoothTouch: false,
    });

    // Sections using `content-visibility: auto` count as placeholders until they render, so
    // the page height changes after load (about 260px on /v1). Re-measure every ScrollTrigger
    // when the content resizes, or the footer wordmark's reveal ends below the real bottom of
    // the page and it stays hidden; same once fonts have loaded.
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastHeight = contentRef.current!.offsetHeight;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const ro = new ResizeObserver(() => {
      const h = contentRef.current?.offsetHeight ?? 0;
      if (Math.abs(h - lastHeight) < 1) return;
      lastHeight = h;
      refresh();
    });
    ro.observe(contentRef.current!);
    document.fonts?.ready.then(refresh);

    // In-page links (e.g. /v1#cta). The content is moved by a transform, so the browser's own
    // anchor jump lands in the wrong place; scroll through the smoother instead.
    const targetOf = (hash: string) => (hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null);
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#"]');
      const target = link && targetOf(link.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      smoother.scrollTo(target, true, "top top");
    };
    const onHashChange = () => {
      const target = targetOf(location.hash);
      if (target) smoother.scrollTo(target, true, "top top");
    };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    // Arriving with a hash: wait for fonts and the first re-measure, then jump without easing.
    let hashTimer: ReturnType<typeof setTimeout> | undefined;
    if (location.hash) {
      document.fonts?.ready.then(() => {
        hashTimer = setTimeout(() => {
          const target = targetOf(location.hash);
          if (target) smoother.scrollTo(target, false, "top top");
        }, 300);
      });
    }

    return () => {
      ro.disconnect();
      clearTimeout(timer);
      clearTimeout(hashTimer);
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      smoother.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} id="smooth-wrapper">
      <div ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
