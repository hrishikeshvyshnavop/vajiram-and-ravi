"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "./Logo";

gsap.registerPlugin(ScrollTrigger);

// Iteration 2: the first section under the hero, sliding over it like the sections below.
// Small uppercase question, a large statement whose letters rise into place as it scrolls
// into view, then an endless row of topper cards. Sizes are in em on a 1vw base, stepped at
// 991 / 767 / 479px, matching the iteration 2 hero.
const eyebrow = "Wondering where India's top civil servants prepared?";
const statement = "The entire top 10 of UPSC CSE 2025 prepared with Vajiram & Ravi.";

type Topper = {
  rank: string;
  name: string;
  exam: string;
  programme: string;
  // The topper's own approved photo, e.g. /toppers/anuj-agnihotri.jpg.
  photo?: string;
  // Until then, a stock portrait for layout review only. It is NOT the topper, so the card
  // shows a "Sample photo" tag; every sample must be replaced with a real photo before launch.
  sample: { src: string; position: string };
  background: string;
};

// Facts from the current V&R results page (same as the toppers carousel).
const toppers: Topper[] = [
  {
    rank: "1",
    name: "Anuj Agnihotri",
    exam: "UPSC CSE 2025",
    programme: "Prepared for the Personality Test with our Interview Guidance Programme.",
    sample: { src: "/hero/interview.jpg", position: "48% 30%" },
    background: "radial-gradient(90% 70% at 70% 35%, #4b4a78 0%, #22213a 55%, #0c0c16 100%)",
  },
  {
    rank: "2",
    name: "Rajeshwari Suve M",
    exam: "UPSC CSE 2025",
    programme: "Practised with our Prelims and Mains Test Series, then the Interview Guidance Programme.",
    sample: { src: "/hero/prelims.jpg", position: "64% 40%" },
    background: "radial-gradient(90% 70% at 30% 40%, #3f6b5d 0%, #1b2f29 55%, #0b1210 100%)",
  },
  {
    rank: "3",
    name: "Akansh Dhull",
    exam: "UPSC CSE 2025",
    programme: "Prepared in our GS Prelims-cum-Mains classroom programme.",
    sample: { src: "/hero/mains.jpg", position: "66% 40%" },
    background: "radial-gradient(90% 70% at 65% 45%, #8a6a44 0%, #3a2a1b 55%, #140e09 100%)",
  },
];

// Seconds for the card row to travel one full set.
const MARQUEE_S = 40;

const CARD_SIZES = "(max-width: 479px) 92vw, (max-width: 767px) 62vw, (max-width: 991px) 52vw, 32vw";

function TopperCard({ t, hidden }: { t: Topper; hidden?: boolean }) {
  return (
    <article
      aria-hidden={hidden}
      className="relative mr-[1em] h-[42em] w-[32em] shrink-0 overflow-hidden rounded-lg text-[#f1f1f1] max-[991px]:h-[62em] max-[991px]:w-[52em] max-[767px]:h-[72em] max-[767px]:w-[62em] max-[479px]:h-[112em] max-[479px]:w-[92em] max-[479px]:rounded-[5px]"
      style={{ background: t.background }}
    >
      {t.photo ? (
        <Image src={t.photo} alt={t.name} fill sizes={CARD_SIZES} className="object-cover" />
      ) : (
        <Image src={t.sample.src} alt="" fill sizes={CARD_SIZES} className="object-cover" style={{ objectPosition: t.sample.position }} />
      )}
      {/* Plain overlays, not CSS filters or blend modes, so moving cards don't repaint */}
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      {/* Keeps the rank and name readable over light photo backgrounds */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />

      {!t.photo && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-white/90">
          Sample photo
        </span>
      )}

      <div className="relative flex h-full flex-col px-5 pb-6 max-[479px]:px-4 max-[479px]:pb-4">
        <div className="flex border-b border-[#f1f1f1]/55">
          <div className="flex gap-1.5 pb-1.5 pr-4 pt-4">
            <span className="text-[1.05em] max-[991px]:text-[1.5em] max-[767px]:text-[2.15em] max-[479px]:text-[4em]">AIR</span>
            <span className="text-[4.5em] font-medium leading-none tracking-[-0.03em] max-[991px]:text-[6.5em] max-[767px]:text-[7.5em] max-[479px]:text-[12em]">
              {t.rank}
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l border-[#f1f1f1]/55 pl-4 pt-4">
            <span className="text-[1.3em] leading-tight max-[991px]:text-[2em] max-[767px]:text-[2.55em] max-[479px]:text-[4em]">{t.name}</span>
            <span className="text-[1.1em] leading-tight opacity-75 max-[991px]:text-[2em] max-[767px]:text-[2.55em] max-[479px]:text-[4em]">{t.exam}</span>
          </div>
        </div>
        <p className="mt-auto w-[43ch] text-[1em] leading-[1.3] tracking-[0.02em] max-[991px]:w-full max-[991px]:text-[2em] max-[767px]:text-[2.55em] max-[479px]:w-auto max-[479px]:text-[4em]">
          {t.programme}
        </p>
      </div>
    </article>
  );
}

export default function ToppersIntro() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".ti-char", {
        yPercent: 110,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.012,
        // Drop the per-letter transforms once settled so the letters stop needing layers.
        clearProps: "transform",
        scrollTrigger: { trigger: ".ti-statement", start: "top 85%", once: true },
      });
      // The track holds the cards twice, so sliding it by half loops seamlessly. It runs from
      // load, so the browser rasterises the cards up front: starting it only as the row came
      // into view drew them all mid-scroll and stalled a frame. It pauses once scrolled past.
      const loop = gsap.to(".ti-track", { xPercent: -50, duration: MARQUEE_S, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: ".ti-track",
        start: "top bottom",
        end: "bottom top",
        onLeave: () => loop.pause(),
        onEnterBack: () => loop.play(),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // The card photos download at page load but the browser only decodes them on first paint,
  // which stalled a frame as the section slid over the hero. Decode them while idle instead.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => {
      el.querySelectorAll("img").forEach((img) => {
        const decode = () => img.decode().catch(() => {});
        if (img.complete) decode();
        else img.addEventListener("load", decode, { once: true });
      });
    });
    return () => cancel(id);
  }, []);

  // Repeat the set so one half of the track always spans more than the widest screen.
  const set = Array.from({ length: Math.max(2, Math.ceil(6 / toppers.length)) }, () => toppers).flat();

  return (
    <section ref={ref} className="relative z-10 rounded-t-2xl bg-[#f1f1f1] text-[#1f1f1f]">
      <div className="px-[32px] py-[52px] text-[1vw] max-[991px]:px-[24px] max-[991px]:pb-[24px] max-[991px]:pt-[32px] max-[767px]:px-[20px] max-[767px]:pb-[32px] max-[767px]:pt-[42px] max-[479px]:px-[16px] max-[479px]:pb-[20px]">
        <div className="flex items-center gap-4 max-[479px]:gap-3">
          <Logo className="size-8 shrink-0 max-[479px]:size-7" />
          <p className="w-[26ch] text-[0.8em] font-medium uppercase leading-[1.1] max-[991px]:w-[46ch] max-[991px]:text-[1.44em] max-[767px]:w-[62ch] max-[767px]:text-[2.15em] max-[767px]:leading-[1.2] max-[479px]:w-auto max-[479px]:text-[3.8em]">
            {eyebrow}
          </p>
        </div>

        <div className="mt-[92px] w-[121ch] max-[991px]:w-[147ch] max-[767px]:w-[141ch] max-[479px]:w-full">
          <p
            aria-label={statement}
            className="ti-statement font-headline will-change-transform text-[6em] font-medium leading-none tracking-[-0.025em] max-[991px]:text-[7.5em] max-[767px]:text-[7em] max-[479px]:text-[8em]"
          >
            {statement.split(" ").map((word, w) => (
              <span key={w} aria-hidden>
                <span className="inline-block overflow-hidden pb-[0.08em] align-top">
                  {Array.from(word).map((ch, i) => (
                    <span key={i} className="ti-char inline-block">
                      {ch}
                    </span>
                  ))}
                </span>{" "}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Topper cards: an endless row, full-bleed. Reduced motion gets a plain scrollable row. */}
      <div className="no-scrollbar overflow-hidden py-[5em] text-[1vw] motion-reduce:overflow-x-auto" aria-label="Toppers who prepared with Vajiram & Ravi">
        <div className="ti-track flex w-max will-change-transform">
          {[0, 1].map((copy) =>
            set.map((t, i) => <TopperCard key={`${copy}-${i}`} t={t} hidden={copy === 1 || i >= toppers.length} />),
          )}
        </div>
      </div>
    </section>
  );
}
