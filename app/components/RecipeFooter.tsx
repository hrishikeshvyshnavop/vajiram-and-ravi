"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeFaq from "./RecipeFaq";

// /v5 footer (layout after Sharon's v-sharon footer), built to carry the full V&R link set (the same groups and labels as SiteFooter,
// taken from the current site). Desktop: six link columns. Phones: each column is a collapsible
// section so ~40 links never become one endless list. A "Popular" row surfaces the most-used
// pages. Link targets are "#" until the client's real URLs are wired in (same as SiteFooter).

export type Item = { label: string; href?: string };

export const columns: { title: string; links: Item[] }[] = [
  {
    title: "Courses",
    links: [
      { label: "UPSC GS Course 2027", href: "#programmes" },
      { label: "UPSC GS Online Course 2027", href: "#programmes" },
      { label: "UPSC 2 Year Course" },
      { label: "UPSC 2 Year Online Course" },
      { label: "UPSC Online Coaching" },
      { label: "UPSC CSAT Course" },
      { label: "Current Affairs Course" },
      { label: "UPSC Study Material" },
    ],
  },
  {
    title: "Test series & mentorship",
    links: [
      { label: "UPSC Prelims Test Series 2027", href: "#programmes" },
      { label: "UPSC Mains Test Series 2027" },
      { label: "Mains Test Series Hindi Medium" },
      { label: "UPSC Optional Test Series" },
      { label: "UPSC Mentorship Program 2027" },
      { label: "Mentorship Program Hindi Medium" },
      { label: "Interview Guidance Program (IGP)", href: "#programmes" },
    ],
  },
  {
    title: "UPSC exam",
    links: [
      { label: "UPSC 2027" },
      { label: "UPSC Exam Pattern" },
      { label: "UPSC Syllabus" },
      { label: "UPSC CSAT Syllabus" },
      { label: "Optional Subjects List" },
      { label: "UPSC Selection Process" },
      { label: "UPSC Interview" },
      { label: "UPSC Age Limit" },
      { label: "IAS Salary" },
    ],
  },
  {
    title: "Exam updates",
    links: [{ label: "UPSC Calendar 2027" }, { label: "UPSC Admit Card" }, { label: "Prelims Answer Key" }, { label: "UPSC Cut Off" }, { label: "UPSC Final Result 2025", href: "#toppers" }],
  },
  {
    title: "Free resources",
    links: [{ label: "UPSC Current Affairs" }, { label: "Previous Year Papers" }, { label: "UPSC Books" }, { label: "Model Answers for Mains 2026" }],
  },
  {
    title: "Vajiram & Ravi",
    links: [{ label: "About Us", href: "/v4" }, { label: "Toppers", href: "#toppers" }, { label: "Faculty", href: "#faculty" }, { label: "Careers" }, { label: "Contact Us", href: "#enrol" }, { label: "FAQs", href: "#faq" }],
  },
];


const legal: Item[] = [{ label: "Terms and Conditions" }, { label: "Privacy Policy" }, { label: "Grievance Redressal" }];

function FLink({ item, className = "" }: { item: Item; className?: string }) {
  const href = item.href ?? "#";
  const cls = `rs-flink ${className}`;
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {item.label}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {item.label}
    </a>
  );
}

export default function RecipeFooter() {
  const [open, setOpen] = useState<number | null>(null);

  // Layout after Sharon's v-sharon footer: a centred closing call over the Parliament painting,
  // fading from the saffron section above into a deep brown base that carries the links.
  return (
    <footer id="contact" className="rs-grain relative isolate overflow-hidden bg-[var(--rs-saffron)] text-[var(--rs-cream)]">
      {/* One scene for FAQ + closing call + links: the Parliament painting sits behind the lower part
          and fades in (mask) from well inside the FAQ, so there is no seam; a dark veil starts above
          the link columns so every link reads on a dark, even background. */}
      <RecipeFaq />

      <div className="relative">
      {/* Painting rises 360px up behind the end of the FAQ and fades in, so there is no seam. The
          veil darkens fully before the link columns start, so every link has even, dark contrast. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/v5/footer-scene.webp"
        alt=""
        className="pointer-events-none absolute inset-x-0 -top-[360px] bottom-0 -z-20 h-[calc(100%+360px)] w-full object-cover object-[50%_42%] [mask-image:linear-gradient(180deg,transparent_0%,#000_26%)]"
      />
      <div
        className="pointer-events-none absolute inset-x-0 -top-[360px] bottom-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(252,176,51,.25) 22%, transparent 34%, transparent 50%, rgba(45,32,29,.7) 60%, rgba(45,32,29,.95) 66%, var(--rs-deep) 72%)",
        }}
      />
      {/* Closing call */}
      <div className="mx-auto flex max-w-[1380px] flex-col items-center px-7 pt-20 text-center text-[var(--rs-deep)]">
        <h2 className="rs-display text-[clamp(40px,5vw,76px)]">
          A district will need you.
          <br />
          <span className="text-[var(--rs-rust)]">Begin today.</span>
        </h2>
        <p className="mt-5 max-w-[520px] text-[18px] leading-snug font-semibold text-[var(--rs-deep)]/80">
          From the first class in Old Rajinder Nagar to the oath you take under the Constitution, we walk the road with you.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <a href="#enrol" className="rs-pill !h-14 !bg-[var(--rs-deep)] !px-6 !text-[var(--rs-saffron)]">
            Book free counselling →
          </a>
          <a href="tel:08062206330" className="rs-pill !h-14 !bg-[var(--rs-cream)] !px-6">
            Call 080-6220-6330
          </a>
        </div>
      </div>

      {/* Links over the dark base */}
      <div className="mx-auto mt-[clamp(300px,28vw,440px)] max-w-[1380px] px-7">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-14">
          <div>
            <Link href="/" className="flex items-center gap-3" aria-label="Vajiram & Ravi">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/vajiram-ravi-emblem.svg" alt="" className="w-12" />
              <span className="rs-display text-[24px] leading-[0.9] text-[var(--rs-saffron)]">
                Vajiram
                <br />
                &amp; Ravi
              </span>
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--rs-cream)]/90">
              1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi – 110060. Next to Gate 5, Karol Bagh Metro.
              <br />
              Egmore, Chennai.
            </p>
            <p className="mt-3 text-[15px] text-[var(--rs-cream)]/90">Mon – Sat, 9 AM – 7 PM</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6">
              {/* TODO: connect to the client's mailing list; until then submitting does nothing. */}
              <label htmlFor="rs-news" className="rs-small block text-[11px] text-[var(--rs-saffron)]">
                Get exam updates
              </label>
              <div className="mt-2 flex h-12 items-center rounded-full bg-white/10 pr-1.5 pl-4 ring-1 ring-white/25 backdrop-blur-sm focus-within:ring-2 focus-within:ring-[var(--rs-saffron)]">
                <input id="rs-news" type="email" required placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/45" />
                <button type="submit" className="rs-pill !h-9 !px-4 !text-[12px]">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Desktop: six columns. Phones: collapsible sections. */}
          <nav aria-label="Footer" className="grid gap-x-8 md:grid-cols-3 md:gap-y-10 xl:grid-cols-6">
            {columns.map((col, i) => {
              const isOpen = open === i;
              const listId = `rs-fcol-${i}`;
              return (
                <div key={col.title} className="border-b border-white/15 md:border-0">
                  <h3>
                    <button
                      type="button"
                      className="rs-small flex w-full items-center justify-between py-4 text-left text-[13px] text-[var(--rs-saffron)] md:pointer-events-none md:py-0"
                      aria-expanded={isOpen}
                      aria-controls={listId}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      {col.title}
                      <span className={`text-lg transition-transform duration-300 md:hidden ${isOpen ? "rotate-45" : ""}`} aria-hidden>
                        +
                      </span>
                    </button>
                  </h3>
                  <ul id={listId} className={`${isOpen ? "block" : "hidden"} space-y-2.5 pb-5 md:mt-4 md:block md:pb-0`}>
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <FLink item={l} className="text-[15px] leading-snug text-[var(--rs-cream)]/90" />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Base row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/20 py-6 text-[13px] text-[var(--rs-cream)]/80 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Vajiram &amp; Ravi. Institute for IAS Examination, New Delhi.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <FLink item={l} className="text-[13px] text-[var(--rs-cream)]/80" />
              </li>
            ))}
            <li lang="hi" className="rs-hi text-[15px] text-[var(--rs-saffron)]">
              जय हिन्द
            </li>
          </ul>
        </div>
      </div>
      </div>
    </footer>
  );
}
