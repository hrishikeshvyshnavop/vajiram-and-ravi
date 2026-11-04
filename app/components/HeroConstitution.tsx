"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Rozha_One, Tiro_Devanagari_Hindi, Unbounded, Yatra_One } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lotus, Paisley } from "./IndianArt";

gsap.registerPlugin(ScrollTrigger);

// Wide display face standing in for ten.375.studio's "Valve".
const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "800"] });
// Devanagari serif for the Hindi touches.
const hindi = Tiro_Devanagari_Hindi({ subsets: ["devanagari"], weight: "400" });
// Indian display face (hand-painted signboard style) for the year on the endpaper.
const yatra = Yatra_One({ subsets: ["latin"], weight: "400" });
// Heavy Indian display serif (poster / signboard style) for the big title and the years.
const rozha = Rozha_One({ subsets: ["latin"], weight: "400" });

// Iteration 8 hero, after ten.375.studio, in the brand palette (maroon ground, sand title,
// orange outline years): a huge title at the top, the 1950 Constitution of India in the middle,
// outline years along the bottom. The book tilts toward the cursor; scrolling pins the hero,
// swings the cover open on the Preamble, then grows the open spread until it fills the screen.
// From there the scroll turns horizontal: the book slides left and a white screen follows. Scrubbed, so scrolling back reverses it.
// With reduced motion the cursor tilt and intro animations are skipped, but scrolling still opens
// the book, since that motion is driven by the visitor.
export default function HeroConstitution() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tilt = el.querySelector<HTMLElement>(".hc-tilt")!;
    const book = el.querySelector<HTMLElement>(".hc-book")!;
    const shadow = el.querySelector<HTMLElement>(".hc-shadow")!;
    const camera = el.querySelector<HTMLElement>(".hc-camera")!;

    const ctx = gsap.context(() => {
      // Cursor tilt. quickTo eases toward the latest target, so it follows smoothly.
      // `cam.k` scales the tilt down to nothing as the camera zooms in, so the spread faces it square.
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
      const sx = gsap.quickTo(shadow, "x", { duration: 0.8, ease: "power3.out" });
      const sy = gsap.quickTo(shadow, "y", { duration: 0.8, ease: "power3.out" });
      const pointer = { nx: 0, ny: 0 };
      const cam = { k: 1 };
      const applyTilt = () => {
        ry(pointer.nx * 22 * cam.k);
        rx(-pointer.ny * 14 * cam.k);
        sx(-pointer.nx * 40);
        sy(-pointer.ny * 24 + 18);
      };
      const onMove = (e: PointerEvent) => {
        pointer.nx = e.clientX / window.innerWidth - 0.5;
        pointer.ny = e.clientY / window.innerHeight - 0.5;
        applyTilt();
      };
      if (!reduceMotion) {
        window.addEventListener("pointermove", onMove);
        gsap.from(".hc-art-in", { opacity: 0, scale: 0.92, duration: 2, ease: "expo.out", delay: 0.3 });
        gsap.from([".hc-title", ".hc-years"], { yPercent: 30, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.12 });
        gsap.from(book, { y: 80, rotationX: 25, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.15 });
      }

      // Open on scroll: the cover swings round the spine while the book slides right by half
      // its width, so the open spread ends up centred. Narrow screens scale the spread to fit.
      const spreadScale = () => Math.min(1, (window.innerWidth * 0.92) / (book.offsetWidth * 2));

      // Then the camera zooms about the centre until the open spread fills the screen, and stops.
      const fitZoom = () => {
        const s = spreadScale();
        return Math.min((el.clientWidth * 0.96) / (book.offsetWidth * 2 * s), (el.clientHeight * 0.92) / (book.offsetHeight * s));
      };

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=420%", pin: true, scrub: 0.8, invalidateOnRefresh: true },
        })
        .to(".hc-hint", { opacity: 0, duration: 0.1 }, 0)
        // Scale is about the book's centre, so the slide shrinks with it to keep the spine centred.
        .to(book, { xPercent: () => 50 * spreadScale(), scale: spreadScale, duration: 1, ease: "power1.inOut" }, 0)
        .to(".hc-cover", { rotationY: -180, duration: 1, ease: "power1.inOut" }, 0)
        .to(shadow, { scaleX: 2, opacity: 0.8, duration: 1 }, 0)
        .to(".hc-title-wrap", { yPercent: -18, opacity: 0.35, duration: 1 }, 0)
        .from(".hc-page-text > *", { opacity: 0, y: 10, stagger: 0.04, duration: 0.3 }, 0.6)
        // Once open, the spread grows to fill the screen and the surroundings fade away.
        .to(cam, { k: 0, duration: 0.5, onUpdate: applyTilt }, 1)
        .to([".hc-title-wrap", ".hc-years", ".hc-frame", ".hc-tag", ".hc-art", shadow], { opacity: 0, duration: 0.4 }, 1)
        .to(camera, { scale: fitZoom, duration: 0.7, ease: "power2.inOut" }, 1)
        // Horizontal scroll: the full-screen book slides off to the left as a plain white screen,
        // waiting to the right, slides in after it (the blank start of the horizontal site).
        .to([camera, ".hc-track"], { x: () => -el.clientWidth, duration: 1 }, 1.8);

      return () => window.removeEventListener("pointermove", onMove);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className={`${unbounded.className} relative flex h-svh min-h-[560px] w-full flex-col items-center overflow-hidden bg-brand-950 text-brand-100`}
    >
      {/* Soft lighter patches, like the blurred backdrop of the reference. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] top-[20%] h-[60%] w-[45%] rounded-full bg-brand-800 opacity-60 blur-[120px]" />
        <div className="absolute -right-[5%] top-[35%] h-[55%] w-[40%] rounded-full bg-brand-700 opacity-35 blur-[140px]" />
        <div className="absolute left-[30%] -top-[20%] h-[45%] w-[40%] rounded-full bg-brand-900 opacity-70 blur-[100px]" />
      </div>

      {/* Simple Indian line art in faint brand orange: paisleys on the frame sides, with Hindi captions. Outer layers are scroll-animated, inner ones take the intro, so they never clash. */}
      <div aria-hidden className="hc-art pointer-events-none absolute inset-y-0 left-[4%] z-[5] hidden items-center md:flex">
        <div className="hc-art-in flex flex-col items-center gap-3">
          <Paisley className="w-[clamp(56px,6vw,96px)] text-brand-500 opacity-35" />
          <p lang="hi" className={`${hindi.className} text-[clamp(13px,1.2vw,18px)] text-brand-500/70`}>सत्यमेव जयते</p>
        </div>
      </div>
      <div aria-hidden className="hc-art pointer-events-none absolute inset-y-0 right-[4%] z-[5] hidden items-center md:flex">
        <div className="hc-art-in flex flex-col items-center gap-3">
          <Paisley className="w-[clamp(56px,6vw,96px)] -scale-x-100 text-brand-500 opacity-35" />
          <p lang="hi" className={`${hindi.className} text-[clamp(13px,1.2vw,18px)] text-brand-500/70`}>भारत का संविधान</p>
        </div>
      </div>

      {/* Thin frame running down both sides, its top edge hidden behind the title. */}
      <div aria-hidden className="hc-frame pointer-events-none absolute inset-x-[2%] top-[11%] bottom-[9%] border border-brand-100/45" />

      {/* Intro animates the h1, scroll animates this wrapper, so the two never fight over a value. */}
      <div className="hc-title-wrap relative z-0">
        <h1 className={`${rozha.className} hc-title mt-[-0.4vw] text-center text-[19.5vw] uppercase leading-[0.78] tracking-[-0.01em]`}>
          Vajiram
          <br />
          &amp; Ravi
        </h1>
      </div>

      {/* The book. Wrapper chain keeps preserve-3d so the cover can swing in real 3D.
          This outer layer is the "camera": scaling it about the centre is the zoom. */}
      <div className="hc-camera absolute inset-0 z-10 flex items-center justify-center [perspective:1600px]">
        <div className="hc-tilt [transform-style:preserve-3d]">
          <div
            aria-hidden
            className="hc-shadow absolute inset-x-[8%] bottom-[-6%] h-[18%] rounded-[50%] bg-black/70 opacity-60 blur-2xl"
          />
          <div className="hc-book relative aspect-[1139/1500] h-[min(60svh,105vw)] [transform-style:preserve-3d]">
            {/* Right-hand page: the Preamble as adopted on 26 November 1949. */}
            <div className="absolute inset-0 rounded-r-[3px] paper-vintage shadow-[3px_0_0_#d9c497,6px_0_0_#c8b182,10px_14px_30px_rgba(0,0,0,0.45)] [transform:translateZ(-2px)]">
              {/* A thin double border, a light echo of the illuminated pages of the 1950 original. */}
              <div aria-hidden className="pointer-events-none absolute inset-[4%] rounded-[2px] border border-[#9c6b2e]/35" />
              <div aria-hidden className="pointer-events-none absolute inset-[5.2%] rounded-[2px] border border-[#9c6b2e]/20" />
              <div className="hc-page-text relative flex h-full flex-col justify-center px-[11%] py-[10%] font-serif ink-faded">
                <p className="text-center text-[clamp(7px,1.15svh,12px)] tracking-[0.3em] text-brand-700">THE CONSTITUTION OF INDIA</p>
                <Lotus className="mx-auto mt-[5%] w-[12%] text-brand-500/60" />
                <p className="mt-[2%] text-center text-[clamp(12px,2.6svh,26px)] italic">Preamble</p>
                <p lang="hi" className={`${hindi.className} mt-[1%] text-center text-[clamp(9px,1.7svh,17px)] text-brand-700`}>उद्देशिका</p>
                <p className="mt-[7%] text-justify text-[clamp(7px,1.45svh,14px)] leading-[1.55] [hyphens:auto]">
                  WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN DEMOCRATIC
                  REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of
                  thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote
                  among them all FRATERNITY assuring the dignity of the individual and the unity of the Nation;
                </p>
                <p className="mt-[4%] text-justify text-[clamp(7px,1.45svh,14px)] leading-[1.55]">
                  IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND
                  GIVE TO OURSELVES THIS CONSTITUTION.
                </p>
              </div>
            </div>

            {/* Cover: the scan on the front, an aged paper endpaper with a note on the back. */}
            <div className="hc-cover absolute inset-0 origin-left [transform-style:preserve-3d]">
              <div className="absolute inset-0 overflow-hidden rounded-r-[4px] shadow-[inset_6px_0_10px_rgba(0,0,0,0.5)] [backface-visibility:hidden]">
                <Image
                  src="/hero/constitution-cover.jpg"
                  alt="Cover of the Constitution of India, 1950 edition"
                  fill
                  priority
                  sizes="(max-width: 768px) 80vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end rounded-l-[4px] paper-vintage paper-gutter-right px-[11%] py-[12%] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="hc-page-text">
                  <p className={`${yatra.className} text-[clamp(20px,6svh,60px)] text-brand-700 leading-none`}>1976</p>
                  <p className="mt-[8%] font-serif ink-faded text-[clamp(8px,1.5svh,15px)] leading-[1.5]">
                    The year the Preamble gained &ldquo;socialist&rdquo;, &ldquo;secular&rdquo; and &ldquo;integrity&rdquo;, and the year
                    Vajiram &amp; Ravi opened its doors. Fifty years on, we still start with this book.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hc-hint absolute bottom-[23%] z-20 text-center">
        <p className="text-[11px] font-normal tracking-wide sm:text-xs">scroll to open</p>
        <p lang="hi" className={`${hindi.className} mt-0.5 text-[12px] text-brand-500/80 sm:text-[13px]`}>खोलने के लिए स्क्रॉल करें</p>
      </div>

      <div className={`${rozha.className} hc-years pointer-events-none absolute bottom-[3%] z-0 flex w-full justify-between px-[3%] text-[17vw] leading-none tracking-[-0.01em] text-transparent [-webkit-text-stroke:1.5px_var(--color-brand-500)]`}>
        <span>1976</span>
        <span>2026</span>
      </div>

      {/* A plain white screen, parked just off the right edge until the horizontal scroll. */}
      <div aria-hidden className="hc-track absolute inset-y-0 left-full z-10 w-full bg-white" />

      <p className="hc-tag absolute bottom-[2%] z-20 flex items-center gap-2 text-center text-[11px] font-normal sm:text-xs">
        <Lotus className="w-4 text-brand-500/70" />
        Fifty years of preparing India&rsquo;s civil servants.
        <Lotus className="w-4 text-brand-500/70" />
      </p>
    </section>
  );
}
