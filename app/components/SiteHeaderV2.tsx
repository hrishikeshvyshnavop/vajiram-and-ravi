"use client";

import { Fragment, useEffect, useState } from "react";
import ArrowCircle from "./ArrowCircle";
import Logo from "./Logo";

const nav = ["Courses", "Test Series", "Results", "Resources", "About"];

// Iteration 2: a thin bar with dot-separated links and one pill CTA. White over the hero,
// then dark text on a light frosted bar once the hero is covered. Below 768px the links move
// into a full-screen panel that slides in from the right. `lightAfter` is how many screen heights
// of scroll pass before the bar turns light (pages with a taller dark hero raise it). `lightCta`
// makes the desktop "Talk to a counsellor" pill light (off-white with a dark arrow) while the bar is
// over the dark hero; it goes back to black once the bar turns light. `hiddenUntil` keeps the whole
// bar out of view for that many screen heights of scroll, then slides it in (pages whose hero
// should play without a header).
export default function SiteHeaderV2({
  lightAfter = 0.85,
  lightCta = false,
  hiddenUntil = 0,
}: {
  lightAfter?: number;
  lightCta?: boolean;
  hiddenUntil?: number;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [shown, setShown] = useState(hiddenUntil <= 0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * lightAfter);
      setShown(hiddenUntil <= 0 || window.scrollY > window.innerHeight * hiddenUntil);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lightAfter, hiddenUntil]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ease = "duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
  const dark = pastHero && !open;

  return (
    <>
      <header
        inert={!shown}
        className={`fixed inset-x-0 top-0 z-[60] transition-[opacity,translate] ${ease} ${
          shown ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 bg-[#f1f1f1]/80 backdrop-blur-md transition-opacity ${ease} ${
            dark ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`flex w-full items-center justify-between px-[32px] py-[10px] transition-colors max-[991px]:px-[24px] max-[767px]:px-[20px] max-[767px]:py-[16px] max-[479px]:px-[16px] max-[479px]:py-[18px] ${ease} ${
            dark ? "text-[#1f1f1f]" : "text-[#f1f1f1]"
          }`}
        >
          <a href="#" className="flex items-center gap-2 whitespace-nowrap text-[1.2vw] font-medium tracking-[0.02em] max-[991px]:text-[2.45vw] max-[767px]:text-[3.65vw] max-[767px]:tracking-normal max-[479px]:text-[6vw]">
            <Logo />
            Vajiram &amp; Ravi
          </a>

          <div className="hidden w-[82%] items-center justify-between min-[768px]:flex min-[992px]:w-[48%]">
            <nav className="flex items-center gap-3 text-[0.9vw] font-medium tracking-[-0.01em] max-[991px]:mx-auto max-[991px]:text-[1.5vw]">
              {nav.map((label, i) => (
                <Fragment key={label}>
                  {i > 0 && <span aria-hidden className="size-1 rounded-full bg-current max-[991px]:size-1.5" />}
                  <a href="#" className="transition-opacity duration-300 hover:opacity-70">
                    {label}
                  </a>
                </Fragment>
              ))}
            </nav>
            <a
              href="#"
              className={`group/cta flex items-center gap-7 rounded-full py-1 pl-5 pr-1 text-[0.8vw] tracking-[0.01em] max-[991px]:text-[1.5vw] max-[991px]:tracking-[0.02em] ${
                lightCta && !dark ? "bg-[#f1f1f1] text-[#1f1f1f]" : "bg-[#010101] text-[#f1f1f1]"
              }`}
            >
              Talk to a counsellor
              <ArrowCircle className={`size-10 ${lightCta && !dark ? "bg-[#1f1f1f] text-[#f1f1f1]" : "bg-[#f1f1f1] text-[#1f1f1f]"}`} />
            </a>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-3 text-[2.5vw] font-medium min-[768px]:hidden max-[479px]:gap-2 max-[479px]:text-[4.25vw]"
          >
            {open ? "Close" : "Menu"}
            <span
              aria-hidden
              className={`size-2.5 rounded-full border border-current transition-colors ${open ? "bg-transparent" : "bg-current"}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-[55] flex flex-col bg-[#1f1f1f] pb-6 pt-[120px] text-[#f1f1f1] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] min-[768px]:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mx-5 text-[13px] tracking-[0.02em] text-[#f1f1f1]/45">Explore</div>
        <nav className="mt-3 flex flex-col">
          {nav.map((label, i) => (
            <a
              key={label}
              href="#"
              onClick={() => setOpen(false)}
              className={`border-t border-dashed border-[#f1f1f1]/25 px-5 py-3.5 text-[24px] font-medium ${
                i === nav.length - 1 ? "border-b" : ""
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="mx-5 mt-8">
          <div className="mb-4 text-[22px] font-medium">Start your preparation</div>
          <a
            href="#"
            className="group/cta flex h-[52px] w-full items-center justify-between rounded-full bg-[#f1f1f1] py-1 pl-5 pr-1 text-[15px] font-medium text-[#1f1f1f]"
          >
            Talk to a counsellor
            <ArrowCircle className="size-11 bg-[#e57512] text-white" />
          </a>
        </div>
        <div className="mx-5 mt-auto flex gap-12 text-[15px]">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#f1f1f1]/45">Contact</span>
            <a href="#">Call a counsellor</a>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#f1f1f1]/45">Follow</span>
            <a href="#">YouTube</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </>
  );
}
