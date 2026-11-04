"use client";

import { useEffect, useRef, useState } from "react";
import { hash, makeSmokeSprite } from "./smoke";

// Page preloader, after fixaplan.com: a light full-screen panel where a short line reveals word by
// word (each word un-blurs and rises 2px). Once the page's images have loaded (and at least `minMs`
// has passed), the line blurs away and the panel dissolves into smoke: soft, uneven holes open from
// the middle outwards while panel-coloured wisps curl upward and thin out, so the page emerges
// through the mist. Scrolling is locked while it is up. Reduced motion: no stagger, a plain fade.

type Phase = "in" | "out" | "done";

const PANEL = "#eaeaea";
const HOLES = 26; // smoke puffs that eat through the panel
const WISPS = 14; // panel-coloured smoke left drifting over the edges
// Timing after fixaplan.com (measured on the live site): a beat of empty panel, the words
// come in over about a second, the line holds, blurs out quickly, and the page is through in ~1.1s.
const WORD_DELAY_MS = 200; // empty panel before the first word
const WORD_STAGGER_MS = 120;
const WORD_MS = 600;
const OUT_MS = 1100;

export default function Preloader({
  text = "Prelims. Mains. Interview.",
  images = [],
  minMs = 1900,
}: {
  text?: string;
  images?: string[];
  minMs?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("in");
  const [shown, setShown] = useState(false);
  const [reduce, setReduce] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const hole = makeSmokeSprite("0,0,0", 0.5); // alpha mask used to erase the panel
    const wisp = makeSmokeSprite("234,234,234", 0.3); // same colour as the panel
    let w = 0;
    let h = 0;
    let dpr = 1;
    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    const smooth = (a: number, b: number, v: number) => {
      const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    // e: 0 → 1 across the dissolve.
    const draw = (e: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1 - smooth(0.7, 1, e); // whatever is left fades at the very end
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = PANEL;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      if (e <= 0) return;
      const base = Math.max(w, h);

      // Holes: puffs start near the middle at different moments and swell outwards, rising a little.
      ctx.globalCompositeOperation = "destination-out";
      for (let i = 0; i < HOLES; i++) {
        const delay = hash(i, 7) * 0.45;
        const k = smooth(delay, delay + 0.55, e);
        if (k <= 0) continue;
        const ang = hash(i, 8) * Math.PI * 2;
        const dist = base * (0.04 + hash(i, 9) * 0.32) * (0.6 + k * 0.6);
        const x = w / 2 + Math.cos(ang) * dist;
        const y = h * 0.55 + Math.sin(ang) * dist * 0.65 - k * base * 0.06;
        const s = base * (0.2 + hash(i, 10) * 0.35) * (0.2 + k * 1.6);
        ctx.globalAlpha = Math.min(1, k * 1.6);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(hash(i, 11) * 6 + k * 0.6);
        ctx.drawImage(hole, -s / 2, -s / 2, s, s);
        ctx.drawImage(hole, -s / 2, -s / 2, s, s); // twice: the sprite is soft, this firms the clearing
        ctx.restore();
      }

      // Wisps: panel-coloured smoke curling up off the torn edges, thinning out.
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < WISPS; i++) {
        const delay = 0.1 + hash(i, 12) * 0.35;
        const k = smooth(delay, delay + 0.6, e);
        if (k <= 0 || k >= 1) continue;
        const x = w * (0.1 + hash(i, 13) * 0.8) + Math.sin(k * 3 + i) * base * 0.03;
        const y = h * (0.4 + hash(i, 14) * 0.5) - k * h * 0.45;
        const s = base * (0.25 + hash(i, 15) * 0.3) * (0.7 + k * 0.8);
        ctx.globalAlpha = Math.sin(k * Math.PI) * 0.85;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(hash(i, 16) * 6 + k * 0.8);
        ctx.drawImage(wisp, -s / 2, -s / 2, s, s);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    size();
    draw(0);
    const onResize = () => {
      size();
      draw(0);
    };
    window.addEventListener("resize", onResize);

    // Let the words mount hidden first, then start their reveal.
    const raf = requestAnimationFrame(() => {
      setReduce(reduced);
      setShown(true);
    });
    const load = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });
    const minWait = new Promise((r) => setTimeout(r, reduced ? 400 : minMs));

    let frame = 0;
    let cancelled = false;
    const finish = () => {
      root.style.overflow = prevOverflow;
      setPhase("done");
    };
    Promise.all([minWait, ...images.map(load)]).then(() => {
      if (cancelled) return;
      setPhase("out");
      window.removeEventListener("resize", onResize);
      if (reduced) {
        frame = window.setTimeout(finish, 400);
        return;
      }
      const t0 = performance.now() + 200; // let the line blur out first
      const tick = (now: number) => {
        const e = Math.min(1, Math.max(0, (now - t0) / OUT_MS));
        draw(e);
        if (e < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
      clearTimeout(frame);
      window.removeEventListener("resize", onResize);
      root.style.overflow = prevOverflow;
    };
    // The image list is fixed for the page's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;
  const out = phase === "out";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70]"
      style={reduce ? { opacity: out ? 0 : 1, transition: "opacity 400ms ease" } : undefined}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="whitespace-pre px-5 text-center font-headline text-[32px] font-medium tracking-[-0.04em] text-[#262626] md:text-[42px]"
          style={{ opacity: out ? 0 : 1, filter: out ? "blur(6px)" : "none", transition: "opacity 200ms ease, filter 200ms ease" }}
        >
          {words.map((word, i) => (
            <span key={i}>
              <span
                className="inline-block"
                style={
                  reduce
                    ? undefined
                    : {
                        opacity: shown ? 1 : 0,
                        filter: shown ? "blur(0px)" : "blur(3px)",
                        transform: shown ? "translateY(0)" : "translateY(2px)",
                        transition: ["opacity", "filter", "transform"]
                          .map((prop) => `${prop} ${WORD_MS}ms ease ${WORD_DELAY_MS + i * WORD_STAGGER_MS}ms`)
                          .join(", "),
                      }
                }
              >
                {word}
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
