"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import PrimaryCta from "./PrimaryCta";

const nav = [
  { label: "Courses", menu: true },
  { label: "Test Series" },
  { label: "Results" },
  { label: "Resources", menu: true },
  { label: "About", menu: true },
];

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// Transparent over the hero; turns into a floating frosted bar once the page scrolls.
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Like primefold, the content never moves: a separate frosted bar fades in behind it
  // and the text colour cross-fades, in both directions.
  const ease = "duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-[72px]">
        <div
          className={`relative flex h-[72px] items-center justify-between transition-colors ${ease} ${
            scrolled ? "text-[#211e1c]" : "text-white"
          }`}
        >
          <div
            aria-hidden
            className={`absolute -inset-x-3 inset-y-1 -z-10 rounded-2xl bg-white/72 backdrop-blur-[5px] transition-[opacity,transform] md:-inset-x-5 ${ease} ${
              scrolled ? "scale-100 opacity-100" : "scale-[0.985] opacity-0"
            }`}
          />
          <a href="#" className="flex items-center gap-2 whitespace-nowrap text-lg font-medium">
            <Logo />
            Vajiram &amp; Ravi
          </a>
          <nav className="hidden items-center gap-7 whitespace-nowrap text-[15px] xl:flex">
            {nav.map((n) => (
              <a key={n.label} href="#" className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
                {n.label}
                {n.menu && <Chevron />}
              </a>
            ))}
            <div className="ml-3 flex items-center gap-2">
              <a
                href="#"
                className={`rounded-full px-4 py-2.5 transition-[background-color,box-shadow,backdrop-filter] ${ease} ${
                  scrolled
                    ? "bg-transparent shadow-[0_0_0_1px_rgba(38,57,90,0.16)]"
                    : "glass-pill shadow-[0_0_0_1px_transparent]"
                }`}
              >
                Sign in
              </a>
              <PrimaryCta icon="phone">Let&apos;s talk</PrimaryCta>
            </div>
          </nav>
          <PrimaryCta icon="phone" className="xl:hidden">
            Let&apos;s talk
          </PrimaryCta>
        </div>
      </div>
    </header>
  );
}
