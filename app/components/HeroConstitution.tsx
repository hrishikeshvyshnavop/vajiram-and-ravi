"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Unbounded } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Wide display face standing in for ten.375.studio's "Valve".
const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "800"] });

// Iteration 8 hero, after ten.375.studio, in the brand palette (maroon ground, sand title,
// orange outline years): a huge title at the top, the 1950 Constitution of India in the middle,
// outline years along the bottom. The book tilts toward the cursor; scrolling pins the hero,
// swings the cover open on the Preamble, then dives the camera into the page until its paper
// fills the screen and the site slides up over it. Scrubbed, so scrolling back reverses it.
// With reduced motion the book stays closed and still.
export default function HeroConstitution() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tilt = el.querySelector<HTMLElement>(".hc-tilt")!;
    const book = el.querySelector<HTMLElement>(".hc-book")!;
    const shadow = el.querySelector<HTMLElement>(".hc-shadow")!;
    const camera = el.querySelector<HTMLElement>(".hc-camera")!;

    const ctx = gsap.context(() => {
      // Cursor tilt. quickTo eases toward the latest target, so it follows smoothly.
      // `cam.k` scales the tilt down to nothing as the camera dives in, so the page faces it square.
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
      window.addEventListener("pointermove", onMove);

      gsap.from([".hc-title", ".hc-years"], { yPercent: 30, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.12 });
      gsap.from(book, { y: 80, rotationX: 25, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.15 });

      // Open on scroll: the cover swings round the spine while the book slides right by half
      // its width, so the open spread ends up centred. Narrow screens scale the spread to fit.
      const spreadScale = () => Math.min(1, (window.innerWidth * 0.92) / (book.offsetWidth * 2));

      // Then the camera dives into the Preamble page. The dive aims at the blank paper below the
      // text (FOCUS_Y down the page), so the screen fills with paper rather than giant letters,
      // and it zooms just far enough for the page to cover every edge of the screen.
      const FOCUS_Y = 0.85;
      const focus = () => {
        const s = spreadScale();
        const pw = book.offsetWidth * s;
        const ph = book.offsetHeight * s;
        const x = el.clientWidth / 2 + pw / 2;
        const y = el.clientHeight / 2 + ph * (FOCUS_Y - 0.5);
        const zoom = Math.max(
          x / (pw / 2),
          (el.clientWidth - x) / (pw / 2),
          y / (ph * FOCUS_Y),
          (el.clientHeight - y) / (ph * (1 - FOCUS_Y)),
        );
        return { x, y, zoom: zoom * 1.25 };
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
        // A short hold on the open book, then the dive.
        .set(camera, { transformOrigin: () => `${focus().x}px ${focus().y}px` }, 1.3)
        .to(cam, { k: 0, duration: 0.4, onUpdate: applyTilt }, 1.3)
        .to([".hc-title-wrap", ".hc-years", ".hc-frame", ".hc-tag", shadow], { opacity: 0, duration: 0.4 }, 1.3)
        .to(camera, { scale: () => focus().zoom, duration: 1.2, ease: "power2.in" }, 1.4)
        // The page's own paper takes over the screen, ready for the site to slide up over it.
        .to(".hc-paper", { opacity: 1, duration: 0.3 }, 2.3);

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

      {/* Thin frame running down both sides, its top edge hidden behind the title. */}
      <div aria-hidden className="hc-frame pointer-events-none absolute inset-x-[2%] top-[11%] bottom-[9%] border border-brand-100/45" />

      {/* Intro animates the h1, scroll animates this wrapper, so the two never fight over a value. */}
      <div className="hc-title-wrap relative z-0">
        <h1 className="hc-title mt-[-1.6vw] text-center text-[14.5vw] font-extrabold uppercase leading-[0.8] tracking-[-0.04em]">
          Vajiram
          <br />
          &amp; Ravi
        </h1>
      </div>

      {/* The book. Wrapper chain keeps preserve-3d so the cover can swing in real 3D.
          This outer layer is the "camera": scaling it about the page is the dive. */}
      <div className="hc-camera absolute inset-0 z-10 flex items-center justify-center [perspective:1600px]">
        <div className="hc-tilt [transform-style:preserve-3d]">
          <div
            aria-hidden
            className="hc-shadow absolute inset-x-[8%] bottom-[-6%] h-[18%] rounded-[50%] bg-black/70 opacity-60 blur-2xl"
          />
          <div className="hc-book relative aspect-[1139/1500] h-[min(60svh,105vw)] [transform-style:preserve-3d]">
            {/* Right-hand page: the Preamble as adopted on 26 November 1949. */}
            <div className="absolute inset-0 rounded-r-[3px] bg-brand-50 shadow-[3px_0_0_#e2d7bf,6px_0_0_#d6caae,10px_14px_30px_rgba(0,0,0,0.45)] [transform:translateZ(-2px)]">
              <div className="hc-page-text flex h-full flex-col justify-center px-[11%] py-[10%] font-serif text-ink">
                <p className="text-center text-[clamp(7px,1.15svh,12px)] tracking-[0.3em] text-brand-700">THE CONSTITUTION OF INDIA</p>
                <p className="mt-[6%] text-center text-[clamp(12px,2.6svh,26px)] italic">Preamble</p>
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

            {/* Cover: the scan on the front, a maroon endpaper with a note on the back. */}
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
              <div className="absolute inset-0 flex flex-col justify-end rounded-l-[4px] bg-brand-900 px-[11%] py-[12%] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="hc-page-text">
                  <p className="text-[clamp(18px,5svh,52px)] font-extrabold text-brand-500 leading-none">1976</p>
                  <p className="mt-[8%] font-sans text-[clamp(8px,1.5svh,15px)] leading-[1.5] text-brand-100/80">
                    The year the Preamble gained &ldquo;socialist&rdquo;, &ldquo;secular&rdquo; and &ldquo;integrity&rdquo;, and the year
                    Vajiram &amp; Ravi opened its doors. Fifty years on, we still start with this book.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="hc-hint absolute bottom-[23%] z-20 text-[11px] font-normal tracking-wide sm:text-xs">scroll to open</p>

      <div className="hc-years pointer-events-none absolute bottom-[4%] z-0 flex w-full justify-between px-[3%] text-[14.5vw] font-extrabold leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:1.5px_var(--color-brand-500)]">
        <span>1976</span>
        <span>2026</span>
      </div>

      <p className="hc-tag absolute bottom-[2%] z-20 text-center text-[11px] font-normal sm:text-xs">
        Fifty years of preparing India&rsquo;s civil servants.
      </p>

      {/* End of the dive: the page's paper fills the screen. */}
      <div aria-hidden className="hc-paper pointer-events-none absolute inset-0 z-30 bg-brand-50 opacity-0" />
    </section>
  );
}
