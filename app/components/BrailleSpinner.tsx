"use client";

import { useEffect, useRef, useState } from "react";

// Small animated marker for section eyebrows, like primefold's: the classic braille "dots"
// spinner, ~80ms per frame. Ticks only while on screen; static for reduced-motion users.
const FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const FRAME_MS = 80;

export default function BrailleSpinner() {
  const ref = useRef<HTMLSpanElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Tick from mount; the observer only pauses it while off screen and resumes on return.
    const start = () => setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS);
    let id: ReturnType<typeof setInterval> | undefined = start();
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id);
      id = e.isIntersecting ? start() : undefined;
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
  }, []);

  return (
    <span ref={ref} aria-hidden className="inline-block w-[1ch] font-mono text-base leading-none text-[#616161]">
      {FRAMES[frame]}
    </span>
  );
}
