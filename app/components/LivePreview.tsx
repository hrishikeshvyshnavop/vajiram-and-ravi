"use client";

import { useEffect, useRef, useState } from "react";

// Live cover for the iterations index: the page itself, rendered at desktop size (1440×900) in
// an iframe and scaled down to fit the card. It loads only once the card nears the viewport
// (several pages run heavy WebGL scenes) and ignores pointer input so the card link gets clicks.
const W = 1440;
const H = 900;

export default function LivePreview({ src, title }: { src: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    // Measure once now; the observers below keep it current.
    setScale(box.clientWidth / W);
    const r = box.getBoundingClientRect();
    if (r.top < window.innerHeight + 300 && r.bottom > -300) setVisible(true);
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(box);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(box);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={boxRef} className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100" aria-hidden>
      {visible && scale > 0 && (
        <iframe
          src={src}
          title={`${title} preview`}
          tabIndex={-1}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute top-0 left-0 origin-top-left border-0 transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">Loading preview…</div>
      )}
    </div>
  );
}
