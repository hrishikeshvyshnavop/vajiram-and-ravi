"use client";

import { useState } from "react";

// Contact options and Locations (storyline sections 13 and 14).
//   13: "Let the visitor pick their channel."   14: "Make it physical: New Delhi and Chennai, with directions."
// Facts are the ones on the current site (apps/Vajiram-ravi data/site.ts and data/home.ts): phone, email, hours, the
// Delhi address, landmark and map link. The Chennai address is only "Egmore, Chennai" on the current site, so it
// has no directions link until the client gives the full address. There is no WhatsApp card on purpose: the current
// site's WhatsApp link is a placeholder ("#"), so no number is verified.
//
// Option B (user 2026-11-07, "need another way to show"): the campuses are a milestone stone, the arch-topped marker on
// Indian roads. Pick a city on the left and its milestone shows the address; the three contact channels are a ruled directory
// underneath. Option A (three channel cards + two address cards) is in apps/my-app/backup/removed-sections.

const PHONE = "080-6220-6330";
const EMAIL = "admissions@vajiramandravi.com";
const DELHI_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060";

const channels = [
  { label: "Talk to us", value: PHONE, note: "Mon – Sat, 9 AM – 7 PM", href: "tel:+918062206330", cta: "Call now" },
  { label: "Email us", value: EMAIL, note: "Admissions and course questions", href: `mailto:${EMAIL}`, cta: "Send an email" },
  { label: "Request a call", value: "We call you back", note: "Choose the time that suits you", href: "#enrol", cta: "Book free counselling" },
];

const campuses = [
  {
    id: "delhi",
    city: "New Delhi",
    hi: "नई दिल्ली",
    tag: "Head campus",
    place: "Old Rajinder Nagar",
    address: "1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi – 110060",
    near: "Adjacent to Gate 5, Karol Bagh Metro Station & Pillar no. 103",
    href: DELHI_MAPS,
    cta: "Get directions",
    external: true,
  },
  {
    id: "chennai",
    city: "Chennai",
    hi: "चेन्नई",
    tag: "Campus",
    place: "Egmore",
    address: "Egmore, Chennai.",
    near: "Ask a counsellor for the full address and the current batches in Chennai.",
    href: "#enrol",
    cta: "Ask a counsellor",
    external: false,
  },
] as const;

const Arrow = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

export default function RecipeContactLocations() {
  const [pick, setPick] = useState<(typeof campuses)[number]["id"]>("delhi");
  const c = campuses.find((x) => x.id === pick) ?? campuses[0];

  return (
    <section id="visit" className="relative overflow-hidden bg-[var(--rs-cream)] px-7 py-28 text-[var(--rs-rust)]">
      <div className="relative mx-auto max-w-[var(--rs-max)]">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p data-pop="" className="rs-small text-[14px] opacity-80">
              Contact and campus · <span lang="hi" className="rs-hi normal-case">संपर्क</span>
            </p>
            <h2 data-pop="" className="rs-display mt-4 text-[clamp(52px,6.6vw,108px)]">
              Here to help,
              <br />
              any way
            </h2>
          </div>
          <p data-pop="" className="max-w-[460px] text-xl leading-snug text-[var(--rs-deep)]/85">
            Pick the channel that suits you, or visit us in New Delhi or Chennai.
          </p>
        </div>

        {/* campuses: city list on the left, the milestone for the chosen city on the right */}
        <div data-pop="" className="rs-ms">
          <div role="tablist" aria-label="Campus" className="rs-ms-tabs">
            {campuses.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`ms-tab-${x.id}`}
                aria-selected={x.id === pick}
                aria-controls="ms-panel"
                tabIndex={x.id === pick ? 0 : -1}
                onClick={() => setPick(x.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") setPick(campuses[(i + 1) % campuses.length].id);
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") setPick(campuses[(i + campuses.length - 1) % campuses.length].id);
                }}
                className={`rs-ms-tab ${x.id === pick ? "is-on" : ""}`}
              >
                <span className="rs-ms-no">0{i + 1}</span>
                <span className="rs-ms-city">{x.city}</span>
                <span lang="hi" className="rs-hi rs-ms-hi">{x.hi}</span>
              </button>
            ))}
          </div>

          <div id="ms-panel" role="tabpanel" aria-labelledby={`ms-tab-${c.id}`} className="rs-ms-stage">
            <div className="rs-ms-stone" key={c.id}>
              <p className="rs-ms-top">V&amp;R · {c.tag}</p>
              <h3>{c.city}</h3>
              <p className="rs-ms-place">{c.place}</p>
              <div className="rs-ms-band">
                <p>{c.address}</p>
                <p className="rs-ms-near">{c.near}</p>
                <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="rs-ms-link">
                  {c.cta}
                  {c.external ? (
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
                      <path d="M4 12 12 4M5.5 4H12v6.5" />
                    </svg>
                  ) : (
                    <Arrow />
                  )}
                  {c.external && <span className="sr-only"> (opens Google Maps in a new tab)</span>}
                </a>
              </div>
            </div>
            <div className="rs-ms-ground" aria-hidden />
          </div>
        </div>

        {/* channels: a ruled directory, one line each */}
        <ul className="rs-dir">
          {channels.map((x) => (
            <li key={x.label} data-pop="" className="rs-dir-row">
              <p className="rs-dir-label">{x.label}</p>
              <p className="rs-dir-value">{x.value}</p>
              <p className="rs-dir-note">{x.note}</p>
              <a href={x.href} className="rs-prog-link">
                {x.cta}
                <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
