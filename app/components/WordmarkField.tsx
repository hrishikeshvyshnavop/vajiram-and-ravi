"use client";

import { useEffect, useRef } from "react";

// Living wordmark for the closing CTA, after tines.com's "Start today" field. On load the
// letters are plain ink with no fill effect. Moving the pointer over them paints the brand glow
// (teal → orange → amber blobs with grain) into the letters with a soft brush. Each stroke fades
// back to ink over ~1.4s, the way Tines' drones cut their vines and the vines grow back.
// Only animates while a stroke is fading. With reduced motion it stays plain ink.

type Trail = { x: number; y: number; born: number };

const TRAIL_LIFE = 1400; // ms until a trail point has fully faded
const INK = "#1a1814";

// Small noise tile, generated once and repeated as a pattern for the grain.
function makeGrain() {
  const tile = document.createElement("canvas");
  tile.width = tile.height = 128;
  const g = tile.getContext("2d")!;
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return tile;
}

export default function WordmarkField({ text = "Start today" }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const family = getComputedStyle(wrap).fontFamily;
    const grain = ctx.createPattern(makeGrain(), "repeat");
    const trails: Trail[] = [];

    let w = 0;
    let h = 0;
    let fontSize = 0;
    let baseline = 0;
    let frame = 0;
    let running = false;
    let ready = false;
    const t0 = performance.now();

    const font = () => `700 ${fontSize}px ${family}`;

    // Size the text so it spans the full width, then set the canvas height to the glyph box.
    const layout = () => {
      w = wrap.clientWidth;
      ctx.font = `700 100px ${family}`;
      ctx.letterSpacing = "-3px";
      const m = ctx.measureText(text);
      fontSize = (100 * w) / m.width;
      ctx.font = font();
      ctx.letterSpacing = `${-fontSize * 0.03}px`;
      const fit = ctx.measureText(text);
      fontSize *= w / fit.width; // second pass corrects for letter-spacing
      ctx.font = font();
      ctx.letterSpacing = `${-fontSize * 0.03}px`;
      const box = ctx.measureText(text);
      const ascent = box.actualBoundingBoxAscent;
      const descent = box.actualBoundingBoxDescent;
      h = Math.ceil(ascent + descent);
      baseline = ascent;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
      wrap.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      reveal.width = canvas.width;
      reveal.height = canvas.height;
    };

    // Offscreen layer for the revealed glow: the brush strokes, then the glow kept only inside them.
    const reveal = document.createElement("canvas");
    const rctx = reveal.getContext("2d")!;

    const blob = (g: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) => {
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    };

    const drawText = () => {
      ctx.font = font();
      ctx.letterSpacing = `${-fontSize * 0.03}px`;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = INK;
      ctx.fillText(text, 0, baseline);
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      drawText();
      if (!trails.length) return;

      // 1. Brush strokes: soft discs that shrink and fade with age.
      rctx.setTransform(ctx.getTransform());
      rctx.globalCompositeOperation = "source-over";
      rctx.clearRect(0, 0, w, h);
      for (let i = trails.length - 1; i >= 0; i--) {
        const life = 1 - (now - trails[i].born) / TRAIL_LIFE;
        if (life <= 0) {
          trails.splice(i, 1);
          continue;
        }
        blob(rctx, trails[i].x, trails[i].y, h * 0.32 * (0.5 + 0.5 * life), `rgba(0,0,0,${life})`);
      }

      // 2. Glow, kept only where the strokes are.
      rctx.globalCompositeOperation = "source-in";
      const base = rctx.createLinearGradient(0, 0, w, 0);
      base.addColorStop(0, "#1f4a3c");
      base.addColorStop(0.45, "#5a3a17");
      base.addColorStop(1, "#7a3d10");
      rctx.fillStyle = base;
      rctx.fillRect(0, 0, w, h);
      rctx.globalCompositeOperation = "source-atop";
      blob(rctx, w * (0.12 + 0.05 * Math.sin(t * 0.4)), h * (0.3 + 0.2 * Math.cos(t * 0.5)), h * 1.1, "rgba(46,160,128,0.85)");
      blob(rctx, w * (0.5 + 0.08 * Math.sin(t * 0.3 + 1)), h * (0.8 + 0.15 * Math.sin(t * 0.6)), h * 1.0, "rgba(229,117,18,0.75)");
      blob(rctx, w * (0.86 + 0.05 * Math.cos(t * 0.35)), h * (0.6 + 0.2 * Math.sin(t * 0.45 + 2)), h * 1.2, "rgba(247,173,107,0.9)");
      if (grain) {
        rctx.globalAlpha = 0.18;
        rctx.fillStyle = grain;
        rctx.fillRect(0, 0, w, h);
        rctx.globalAlpha = 1;
      }

      // 3. Lay the revealed glow over the ink letters only.
      ctx.globalCompositeOperation = "source-atop";
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(reveal, 0, 0);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      draw(now);
      if (trails.length) frame = requestAnimationFrame(tick);
      else running = false;
    };
    const start = () => {
      if (running || reduceMotion || !ready || !trails.length) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      const r = canvas.getBoundingClientRect();
      trails.push({ x: e.clientX - r.left, y: e.clientY - r.top, born: performance.now() });
      if (visible) start();
    };

    const ro = new ResizeObserver(() => {
      if (!ready) return;
      layout();
      draw(performance.now());
    });
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });

    let cancelled = false;
    document.fonts.load(`700 100px ${family}`).then(() => {
      if (cancelled) return;
      ready = true;
      layout();
      draw(performance.now());
      ro.observe(wrap);
      io.observe(wrap);
    });
    wrap.addEventListener("pointermove", onMove);

    return () => {
      cancelled = true;
      stop();
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
    };
  }, [text]);

  return (
    // Placeholder height (about the wordmark's aspect) until the font loads and layout() measures it.
    <div ref={wrapRef} aria-hidden className="relative w-full font-headline" style={{ aspectRatio: "1296 / 250" }}>
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}
