"use client";

import { useEffect } from "react";
import { MANIFESTO_HTML } from "./manifesto.generated";

// Markup, CSS and JS all come from apps/manifesto (synced by scripts/sync-manifesto.mjs).
// Scripts load in order once; on every mount MF.init() wires the page and on unmount
// MF.destroy() tears down Lenis, ScrollTriggers and listeners, so client-side navigation
// back to the index leaves nothing running.
const SCRIPTS = [
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
  "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js",
  "/manifesto/js/placeholders.js",
  "/manifesto/js/fx.js",
  "/manifesto/js/main.js",
];

type MFWindow = Window & {
  MF?: { init: () => void; destroy: () => void };
  VR_PH?: { wire: (img: HTMLImageElement) => void };
};

function loadScript(src: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[data-mf-src="${src}"]`);
  if (existing) {
    return existing.dataset.loaded
      ? Promise.resolve()
      : new Promise((r) => {
          existing.addEventListener("load", () => r());
          existing.addEventListener("error", () => r());
        });
  }
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.dataset.mfSrc = src;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () => resolve(); // without GSAP/Lenis the page falls back to plain vertical scroll
    document.body.appendChild(s);
  });
}

export default function ManifestoView() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const src of SCRIPTS) {
        if (cancelled) return;
        await loadScript(src);
      }
      if (cancelled) return;
      const w = window as MFWindow;
      // First visit: the scripts ran on load. Return visits: re-wire this fresh markup.
      document.querySelectorAll<HTMLImageElement>(".mf img").forEach((img) => w.VR_PH?.wire(img));
      w.MF?.init();
    })();
    return () => {
      cancelled = true;
      (window as MFWindow).MF?.destroy();
    };
  }, []);

  // Fonts and the stylesheet are scoped to this route on purpose: they belong to the manifesto
  // (shared with the standalone build in apps/manifesto), not to the other iterations.
  return (
    <>
      {/* eslint-disable @next/next/no-page-custom-font, @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap"
        precedence="manifesto"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Libertinus+Sans:ital,wght@0,400;0,700;1,400&display=swap"
        precedence="manifesto"
      />
      <link rel="stylesheet" href="/manifesto/css/style.css" precedence="manifesto" />
      {/* eslint-enable @next/next/no-page-custom-font, @next/next/no-css-tags */}
      <div className="mf is-loading flex-1" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: MANIFESTO_HTML }} />
    </>
  );
}
