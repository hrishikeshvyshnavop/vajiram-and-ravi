"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { columns, type Item } from "./RecipeFooter";

gsap.registerPlugin(ScrollTrigger);

// /v5 header, sized for the full V&R menu. Desktop (lg+): saffron pills, four of them open a
// dropdown panel built from the same link groups as the footer (one source of truth). Smaller
// screens: a "Menu" pill opens a full-screen sheet with the groups as collapsible sections.
// Slides away on scroll down, returns on scroll up; stays put while a menu is open.

const byTitle = (t: string) => columns.find((c) => c.title === t)!.links;

const menus: { label: string; groups: { title: string; links: Item[] }[]; feature?: { kicker: string; title: string; href: string } }[] = [
  {
    label: "Courses",
    groups: [{ title: "Courses", links: byTitle("Courses") }],
    feature: { kicker: "Flagship", title: "GS Prelims cum Mains 2027", href: "#programmes" },
  },
  {
    label: "Test series",
    groups: [{ title: "Test series & mentorship", links: byTitle("Test series & mentorship") }],
    feature: { kicker: "UPSC Prelims 2025", title: "59 questions reflected from our PTS", href: "#tradition" },
  },
  {
    label: "UPSC exam",
    groups: [
      { title: "UPSC exam", links: byTitle("UPSC exam") },
      { title: "Exam updates", links: byTitle("Exam updates") },
    ],
  },
  {
    label: "Resources",
    groups: [{ title: "Free resources", links: byTitle("Free resources") }],
    feature: { kicker: "Free", title: "Daily UPSC current affairs", href: "#" },
  },
];

const direct: Item[] = [
  { label: "Toppers", href: "#toppers" },
  { label: "Faculty", href: "#faculty" },
  { label: "FAQ", href: "#faq" },
];

function A({ item, className, onClick }: { item: Item; className?: string; onClick?: () => void }) {
  const href = item.href ?? "#";
  return href.startsWith("/") ? (
    <Link href={href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  ) : (
    <a href={href} className={className} onClick={onClick}>
      {item.label}
    </a>
  );
}

export default function RecipeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null); // desktop dropdown
  const [sheet, setSheet] = useState(false); // mobile menu
  const [sheetGroup, setSheetGroup] = useState<number | null>(0);
  const lockRef = useRef(false);
  // Keep the scroll handler's view of "a menu is open" current without re-creating the trigger.
  useEffect(() => {
    lockRef.current = open !== null || sheet;
  }, [open, sheet]);

  useEffect(() => {
    const header = headerRef.current!;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (lockRef.current) return;
        const hide = self.direction === 1 && self.scroll() > 120;
        gsap.to(header, { yPercent: hide ? -130 : 0, duration: 0.45, ease: "power3.out", overwrite: true });
      },
    });
    return () => st.kill();
  }, []);

  // Close on Escape / outside click.
  useEffect(() => {
    if (open === null && !sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setSheet(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (open !== null && !headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open, sheet]);

  const close = () => {
    setOpen(null);
    setSheet(false);
  };
  const m = open !== null ? menus[open] : null;

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-7 pt-3.5" onMouseLeave={() => setOpen(null)}>
      <div className="relative flex items-center justify-between">
        {/* Desktop menus */}
        <nav className="hidden gap-1.5 lg:flex" aria-label="Main">
          {menus.map((menu, i) => (
            <button
              key={menu.label}
              type="button"
              className={`rs-pill !h-12 !px-4 ${open === i ? "!bg-[var(--rs-cream)]" : ""}`}
              aria-expanded={open === i}
              aria-controls="rs-mega"
              onClick={() => setOpen(open === i ? null : i)}
              onMouseEnter={() => setOpen(i)}
            >
              {menu.label}
              <span className={`text-[10px] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} aria-hidden>
                ▼
              </span>
            </button>
          ))}
        </nav>

        {/* Smaller screens */}
        <button type="button" className="rs-pill !h-12 !px-4 lg:!hidden" aria-expanded={sheet} aria-controls="rs-sheet" onClick={() => setSheet(true)}>
          Menu
        </button>

        <Link href="/" className="rs-display absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-[18px] leading-[0.85]" aria-label="Vajiram & Ravi, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/vajiram-ravi-emblem.svg" alt="" className="mb-0.5 w-7" />
          <span>Vajiram</span>
          <span>&amp; Ravi</span>
        </Link>

        <div className="flex gap-1.5">
          {direct.map((d) => (
            <A key={d.label} item={d} className="rs-pill !hidden !h-12 !px-4 xl:!inline-flex" />
          ))}
          <a href="#contact" className="rs-pill !hidden !h-12 !px-4 sm:!inline-flex">
            Contact
          </a>
          <a href="#enrol" className="rs-pill !h-12 !bg-[var(--rs-cream)] !px-4">
            Enrol now
          </a>
        </div>
      </div>

      {/* Desktop dropdown panel */}
      <div
        id="rs-mega"
        className={`absolute top-[calc(100%+8px)] left-7 hidden w-[min(860px,calc(100vw-56px))] origin-top-left rounded-2xl bg-[var(--rs-cream)] p-7 text-[var(--rs-deep)] shadow-[0_30px_60px_-20px_rgba(20,6,2,0.55)] transition-all duration-300 lg:block ${
          m ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {m && (
          <div className={`grid gap-8 ${m.feature ? "grid-cols-[1fr_240px]" : "grid-cols-1"}`}>
            <div className={`grid gap-8 ${m.groups.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {m.groups.map((g) => (
                <div key={g.title}>
                  <p className="rs-small text-[11px] opacity-60">{g.title}</p>
                  <ul className={`mt-3 grid gap-x-6 gap-y-1 ${m.groups.length === 1 && g.links.length > 5 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {g.links.map((l) => (
                      <li key={l.label}>
                        <A item={l} onClick={close} className="block rounded-lg px-2 py-1.5 -mx-2 text-[15px] transition-colors hover:bg-[var(--rs-saffron)]/40" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {m.feature && (
              <a href={m.feature.href} onClick={close} className="rs-grain relative flex flex-col justify-between overflow-hidden rounded-xl bg-[var(--rs-rust)] p-5 text-[var(--rs-saffron)] transition-transform hover:-rotate-1">
                <span className="rs-small text-[11px] opacity-70">{m.feature.kicker}</span>
                <span className="rs-display mt-6 text-[26px] leading-[0.95]">{m.feature.title}</span>
                <span className="rs-small mt-4 text-[11px]">Explore →</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Mobile / tablet sheet */}
      <div
        id="rs-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[60] overflow-y-auto bg-[var(--rs-deep)] px-7 pt-5 pb-10 text-[var(--rs-saffron)] transition-transform duration-500 lg:hidden ${sheet ? "translate-y-0" : "invisible -translate-y-full"}`}
      >
        <div className="flex items-center justify-between">
          <span className="rs-display text-[22px] leading-[0.85]">
            Vajiram
            <br />
            &amp; Ravi
          </span>
          <button type="button" className="rs-pill !h-12 !px-4" onClick={() => setSheet(false)}>
            Close ✕
          </button>
        </div>
        <ul className="mt-8">
          {menus.map((menu, i) => {
            const on = sheetGroup === i;
            return (
              <li key={menu.label} className="border-b border-[var(--rs-saffron)]/20">
                <button type="button" className="rs-display flex w-full items-center justify-between py-4 text-left text-[30px]" aria-expanded={on} onClick={() => setSheetGroup(on ? null : i)}>
                  {menu.label}
                  <span className={`text-[20px] transition-transform ${on ? "rotate-45" : ""}`} aria-hidden>
                    +
                  </span>
                </button>
                {on && (
                  <ul className="space-y-1 pb-5">
                    {menu.groups.flatMap((g) => g.links).map((l) => (
                      <li key={l.label}>
                        <A item={l} onClick={close} className="block py-1.5 text-[16px] text-[var(--rs-cream)]/80" />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          {direct.map((d) => (
            <li key={d.label} className="border-b border-[var(--rs-saffron)]/20">
              <A item={d} onClick={close} className="rs-display block py-4 text-[30px]" />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-2">
          <a href="#enrol" onClick={close} className="rs-pill">
            Enrol now
          </a>
          <a href="tel:08062206330" className="rs-pill !bg-transparent !text-[var(--rs-saffron)] ring-2 ring-[var(--rs-saffron)]">
            Call 080-6220-6330
          </a>
        </div>
      </div>
    </header>
  );
}
