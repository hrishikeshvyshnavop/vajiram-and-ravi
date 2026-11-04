"use client";

import { useEffect, useRef } from "react";

// Full-bleed pattern band, after the AI in Design 2026 report header: a grid of small tiles where
// two print motifs meet in slow, organic patches. Our motifs are Indian, drawn here (no source art):
//   - Buti: a cream four-petal block-print flower on brand orange.
//   - Kolam: a dot ringed by looped lines on warm cream; the loops join across tiles into one lattice.
//   - Jaali: maroon kolam on orange, used along the edges where the two patches meet.
// A drifting value-noise field picks the tile for each cell; the pointer blooms buti around it.
// Pauses off screen. With reduced motion it draws one still frame and ignores the pointer.

const CELL = 28; // css px per tile
const ORANGE = "#e57512";
const CREAM = "#fbf8f3";
const SAND = "#fceac9";
const MAROON = "#8d2e13";

// Smooth 2D value noise on a hashed lattice, two octaves.
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function valueNoise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = smooth(x - xi);
  const v = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function field(x: number, y: number) {
  return valueNoise(x, y) * 0.7 + valueNoise(x * 2.3 + 17, y * 2.3 + 9) * 0.3;
}

function drawButi(g: CanvasRenderingContext2D, s: number) {
  g.fillStyle = ORANGE;
  g.fillRect(0, 0, s, s);
  const c = s / 2;
  g.fillStyle = CREAM;
  // Four almond petals.
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(c, c);
    g.rotate((i * Math.PI) / 2);
    g.beginPath();
    g.moveTo(0, -s * 0.04);
    g.quadraticCurveTo(s * 0.24, -s * 0.22, 0, -s * 0.42);
    g.quadraticCurveTo(-s * 0.24, -s * 0.22, 0, -s * 0.04);
    g.fill();
    g.restore();
  }
  g.fillStyle = MAROON;
  g.beginPath();
  g.arc(c, c, s * 0.07, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = CREAM;
  // Corner dots, which read as a dotted grid between flowers.
  for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) {
    g.beginPath();
    g.arc(x, y, s * 0.05, 0, Math.PI * 2);
    g.fill();
  }
}

// Kolam lattice: a quarter arc at each corner. Across tiles the arcs close into rings around the
// grid points, and each tile shows the curved diamond around its dot, as in a pulli kolam.
function drawKolam(g: CanvasRenderingContext2D, s: number, ground: string, ink: string) {
  g.fillStyle = ground;
  g.fillRect(0, 0, s, s);
  const c = s / 2;
  g.strokeStyle = ink;
  g.fillStyle = ink;
  g.lineWidth = Math.max(1, s * 0.07);
  for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) {
    g.beginPath();
    g.arc(x, y, c, 0, Math.PI * 2);
    g.stroke();
  }
  g.beginPath();
  g.arc(c, c, s * 0.09, 0, Math.PI * 2);
  g.fill();
}

function makeTile(px: number, paint: (g: CanvasRenderingContext2D, s: number) => void) {
  const tile = document.createElement("canvas");
  tile.width = tile.height = px;
  paint(tile.getContext("2d")!, px);
  return tile;
}

export default function PatternField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tiles: HTMLCanvasElement[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let frame = 0;
    let running = false;
    const pointer = { x: -1e4, y: -1e4, strength: 0 };
    const t0 = performance.now();

    const layout = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const px = Math.round(CELL * dpr);
      tiles = [
        makeTile(px, (g, s) => drawKolam(g, s, SAND, ORANGE)),
        makeTile(px, (g, s) => drawKolam(g, s, ORANGE, MAROON)),
        makeTile(px, drawButi),
      ];
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const px = CELL * dpr;
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      pointer.strength *= 0.96;
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          let n = field(col * 0.09 + t * 0.05, r * 0.11 - t * 0.03);
          const dx = (col + 0.5) * CELL - pointer.x;
          const dy = (r + 0.5) * CELL - pointer.y;
          n += pointer.strength * 0.5 * Math.exp(-(dx * dx + dy * dy) / (2 * 90 * 90));
          const tile = n < 0.46 ? tiles[0] : n < 0.52 ? tiles[1] : tiles[2];
          ctx.drawImage(tile, Math.round(col * px), Math.round(r * px));
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.strength = 1;
    };

    layout();
    draw(t0);

    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    if (!reduceMotion) canvas.addEventListener("pointermove", onMove);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`block w-full ${className}`} />;
}
