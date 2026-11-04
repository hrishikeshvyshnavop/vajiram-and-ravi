"use client";

import { useEffect, useRef } from "react";

const IMAGE = "/hero/parliament-panorama.png";
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

type Particle = { x: number; y: number; z: number; size: number; color: string; phase: number };

export default function ParliamentParticles() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;

    const image = new Image();
    image.src = IMAGE;
    const sample = document.createElement("canvas");
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
    if (!sampleCtx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let targetProgress = 0;
    let progress = 0;
    let frame = 0;

    const buildParticles = () => {
      const sampleWidth = 260;
      const sampleHeight = Math.round(sampleWidth * (image.naturalHeight / image.naturalWidth));
      sample.width = sampleWidth;
      sample.height = sampleHeight;
      sampleCtx.drawImage(image, 0, 0, sampleWidth, sampleHeight);
      const pixels = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;
      particles = [];

      for (let y = 0; y < sampleHeight; y += 2) {
        for (let x = 0; x < sampleWidth; x += 2) {
          const index = (y * sampleWidth + x) * 4;
          const alpha = pixels[index + 3];
          if (alpha < 80) continue;
          particles.push({
            x: x / sampleWidth,
            y: y / sampleHeight,
            z: 0.72 + ((x * 17 + y * 31) % 100) / 100,
            size: 0.65 + ((x * 7 + y * 13) % 10) / 5,
            color: `rgb(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]})`,
            phase: ((x * 19 + y * 7) % 100) / 100,
          });
        }
      }
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      targetProgress = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
    };

    const draw = (time: number) => {
      progress += (targetProgress - progress) * 0.075;
      // Also check here so cached images cannot leave the scene with an empty
      // particle buffer if their load event fired before the handler attached.
      if (particles.length === 0 && image.complete && image.naturalWidth > 0) buildParticles();
      if (width > 0 && height > 0 && particles.length > 0) {
        const seconds = time * 0.001;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, width, height);

        const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const zoom = 1 + progress * 1.35;
        const scale = cover * zoom;
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        const focusX = width * (0.5 + progress * 0.02);
        const focusY = height * (0.49 - progress * 0.04);
        const left = focusX - drawWidth * (0.5 + progress * 0.015);
        const top = focusY - drawHeight * (0.46 + progress * 0.02);
        const particleScale = drawWidth / sample.width;

        // Keep a restrained version of the source image beneath the points so
        // the building remains legible while the particle field is in motion.
        ctx.globalAlpha = 0.16;
        ctx.drawImage(image, left, top, drawWidth, drawHeight);
        ctx.globalAlpha = 1;

        for (const particle of particles) {
          const drift = Math.sin(seconds * 0.7 + particle.phase * 8) * (1.2 + progress * 2.4);
          const x = left + particle.x * drawWidth + drift;
          const y = top + particle.y * drawHeight + Math.cos(seconds * 0.55 + particle.phase * 9) * 0.8;
          if (x < -8 || x > width + 8 || y < -8 || y > height + 8) continue;
          const alpha = 0.48 + particle.z * 0.42;
          const size = Math.max(1.1, particle.size * particleScale * 0.15 * (1 + progress * 0.3));
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1;

        const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.15, width / 2, height / 2, width * 0.78);
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, `rgba(0,0,0,${0.55 + progress * 0.2})`);
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (image.complete && image.naturalWidth > 0) buildParticles();
    };

    resize();
    updateScroll();
    image.onload = start;
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (image.complete && image.naturalWidth > 0) start();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="bg-[#050505] text-white">
      <section ref={sectionRef} className="relative h-[340svh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <canvas ref={canvasRef} aria-label="Animated Parliament mosaic point cloud" className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
          <p className="absolute left-5 top-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 md:left-10 md:top-9">
            Parliament / Point cloud study
          </p>
          <div className="absolute bottom-[12vh] left-5 max-w-xl bg-black/70 p-5 backdrop-blur-sm md:left-10 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d7e678]">A structure in motion</p>
            <h1 className="mt-4 font-headline text-4xl leading-none tracking-[-0.04em] md:text-7xl">
              Every point holds a piece of the building.
            </h1>
          </div>
          <p className="absolute bottom-7 right-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/65 md:right-10">
            Scroll to explore ↓
          </p>
        </div>
      </section>
    </main>
  );
}
