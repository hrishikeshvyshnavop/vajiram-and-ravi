"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; z: number; size: number; tone: number };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function random(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function createPointCloud() {
  const points: Point[] = [];
  for (let i = 0; i < 5200; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const layer = random(i * 2.17);
    const depth = random(i * 4.31);
    const height = random(i * 7.13);
    const canopy = Math.pow(height, 0.62);
    const spread = 0.55 + layer * 0.85;
    points.push({
      x: side * (0.14 + random(i * 3.7) * spread),
      y: 0.12 + canopy * 1.25 - depth * 0.15,
      z: 0.15 + depth * 1.25,
      size: 0.5 + random(i * 9.1) * 1.9,
      tone: random(i * 11.7),
    });
  }

  // A loose floor and distant tree trunks make the scan read as a forest rather
  // than a generic particle field.
  for (let i = 0; i < 1600; i += 1) {
    const angle = random(i * 1.71) * Math.PI * 2;
    const radius = 0.15 + random(i * 2.81) * 1.35;
    points.push({
      x: Math.cos(angle) * radius,
      y: -0.7 + random(i * 5.1) * 0.35,
      z: 0.1 + random(i * 8.2) * 1.45,
      size: 0.45 + random(i * 3.2) * 1.3,
      tone: 0.2 + random(i * 4.8) * 0.55,
    });
  }
  return points;
}

const POINTS = createPointCloud();

export default function LidarAmazon() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let progress = 0;
    let targetProgress = 0;
    let frame = 0;

    const layout = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const updateProgress = () => {
      const bounds = section.getBoundingClientRect();
      targetProgress = clamp(-bounds.top / Math.max(1, bounds.height - window.innerHeight));
    };

    const draw = (time: number) => {
      progress += (targetProgress - progress) * 0.08;
      if (width <= 0 || height <= 0) {
        frame = requestAnimationFrame(draw);
        return;
      }

      const t = time * 0.00025;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.fillStyle = "#030403";
      context.fillRect(0, 0, width, height);

      const zoom = 0.78 + progress * 0.45;
      const drift = Math.sin(t) * 0.04 + progress * 0.18;
      const scale = Math.min(width, height) * 0.7 * zoom;
      const centerX = width * 0.51;
      const centerY = height * (0.58 - progress * 0.06);

      for (const point of POINTS) {
        const z = point.z + 0.35;
        const perspective = 1 / z;
        const x = centerX + (point.x + drift * (1 - point.z)) * scale * perspective;
        const y = centerY - point.y * scale * perspective;
        if (x < -8 || x > width + 8 || y < -8 || y > height + 8) continue;

        const twinkle = 0.72 + Math.sin(t * 5 + point.z * 8 + point.x) * 0.18;
        const alpha = clamp((0.18 + perspective * 0.52) * twinkle, 0.08, 0.95);
        const green = Math.round(105 + point.tone * 125);
        const red = Math.round(145 + point.tone * 80);
        context.fillStyle = `rgba(${red}, ${green}, ${Math.round(35 + point.tone * 65)}, ${alpha})`;
        const size = Math.max(0.45, point.size * perspective * (0.8 + progress * 0.35));
        context.fillRect(x, y, size, size);
      }

      // A subtle scan line sells the captured-data feeling without obscuring the points.
      const scanY = ((time * 0.035) % (height + 80)) - 40;
      const scan = context.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scan.addColorStop(0, "rgba(215, 230, 120, 0)");
      scan.addColorStop(0.5, "rgba(215, 230, 120, 0.055)");
      scan.addColorStop(1, "rgba(215, 230, 120, 0)");
      context.fillStyle = scan;
      context.fillRect(0, scanY - 30, width, 60);

      frame = requestAnimationFrame(draw);
    };

    layout();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", layout);
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", layout);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <main className="bg-[#030403] text-[#f4f2e9]">
      <section ref={sectionRef} className="relative h-[360svh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.38)_100%)]" />

          <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 md:left-10 md:top-8">
            Into the forest / LiDAR field study
          </div>

          <article className="absolute bottom-[13vh] left-5 max-w-[31rem] bg-black/75 p-5 backdrop-blur-sm md:left-8 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d7e678]">01 / The living canopy</p>
            <h1 className="mt-4 font-headline text-3xl leading-[1.05] tracking-[-0.03em] md:text-5xl">
              LiDAR scans allow us to see the forest at different times as the waters ebb and flow.
            </h1>
          </article>

          <article className="absolute right-5 top-0 max-w-[31rem] rounded-b-lg bg-black/75 p-5 text-right backdrop-blur-sm md:right-8 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d7e678]">02 / A changing world</p>
            <p className="mt-3 font-headline text-2xl leading-[1.1] md:text-4xl">
              Scientists are exploring how the trees and vegetation weather such extremes.
            </p>
          </article>

          <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 md:right-10">
            Scroll to explore ↓
          </div>
        </div>
      </section>
    </main>
  );
}
