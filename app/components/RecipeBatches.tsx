"use client";

import Btn from "./RecipeButton";
import { useEffect, useState } from "react";

// Upcoming batches (storyline section 8: docs/STORYLINE_HOMEPAGE.md).
//   Q5 "When can I start?"  ->  dated batches, filterable by track, the flagship first, a live seat meter and a Register
//   button on every card, and "Ask a counsellor" so a filter never leaves the visitor with no way forward.
// Ported from the homepage app (apps/Vajiram-ravi: Batches/BatchBoard.tsx) and restyled for /v5.
//
// SAMPLE DATA: the dates are from the current homepage data; the SEAT COUNTS ARE PLACEHOLDERS until the client supplies
// real ones (storyline decision E). SHOW_SAMPLE_NOTE prints a small note under the board; set it to false once confirmed.
const SHOW_SAMPLE_NOTE = true;

type Track = "Prelims" | "Current affairs" | "Foundation";
type Batch = {
  month: string;
  day: number;
  year: number;
  track: Track;
  title: string;
  summary: string;
  programme: string;
  target: string;
  mode: string;
  seats: { left: number; total: number };
  flagship?: boolean;
};

const MODE = "Classroom & LIVE-online";
const TRACKS: Track[] = ["Prelims", "Current affairs", "Foundation"];

const batches: Batch[] = [
  {
    month: "JAN", day: 29, year: 2027, track: "Foundation", flagship: true,
    title: "11 Months Prelims cum Mains General Studies Comprehensive Programme",
    summary: "The full GS syllabus for Prelims and Mains, in the classroom or LIVE-online.",
    programme: "GS Prelims-cum-Mains 2027", target: "UPSC CSE 2027", mode: MODE, seats: { left: 41, total: 120 },
  },
  {
    month: "JAN", day: 3, year: 2027, track: "Prelims",
    title: "Prelims CAMP Batch 3",
    summary: "Focused Prelims classes and practice tests that build speed and accuracy.",
    programme: "Prelims CAMP", target: "UPSC CSE 2027", mode: MODE, seats: { left: 14, total: 60 },
  },
  {
    month: "JAN", day: 17, year: 2027, track: "Prelims",
    title: "SMART Prelims Current Affairs Programme 2026",
    summary: "Current affairs taught the way Prelims asks them, with revision built in.",
    programme: "SMART Prelims Current Affairs", target: "UPSC CSE 2027", mode: MODE, seats: { left: 33, total: 90 },
  },
  {
    month: "JAN", day: 17, year: 2027, track: "Current affairs",
    title: "SMART Current Affairs Program 2026",
    summary: "A year of current affairs, linked to the syllabus, for the 2026 attempt.",
    programme: "SMART Current Affairs", target: "UPSC CSE 2026", mode: MODE, seats: { left: 22, total: 80 },
  },
];

type Filter = "All" | Track;
const FILTERS: Filter[] = ["All", ...TRACKS];
const countFor = (f: Filter) => (f === "All" ? batches.length : batches.filter((b) => b.track === f).length);

function Meter({ left, total, dark }: { left: number; total: number; dark?: boolean }) {
  const taken = Math.round(((total - left) / total) * 100);
  const fast = left / total <= 0.25;
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-baseline justify-between text-[13px] font-semibold">
        <span>{left} of {total} seats left</span>
        {fast && <span className="rs-bt-fast">Filling fast</span>}
      </p>
      <div role="progressbar" aria-label="Seats filled" aria-valuemin={0} aria-valuemax={100} aria-valuenow={taken} className={`rs-bt-track ${dark ? "is-dark" : ""}`}>
        <span style={{ width: `${taken}%` }} />
      </div>
    </div>
  );
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const startOf = (b: Batch) => new Date(b.year, MONTHS.indexOf(b.month), b.day, 9, 0, 0); // classes assumed to open at 9 AM
const when = (b: Batch) => startOf(b).getTime();
const label = (b: Batch) => `${b.day} ${MONTH_NAMES[MONTHS.indexOf(b.month)]} ${b.year}`;
const pad = (n: number) => String(n).padStart(2, "0");

// One flip tile of the countdown. Shows dashes until the clock has started (the server cannot know the visitor's "now").
function Tile({ value, unit }: { value: number | null; unit: string }) {
  return (
    <div className="rs-cd-tile">
      <b>{value === null ? "--" : pad(value)}</b>
      <span>{unit}</span>
    </div>
  );
}

// A later batch, as a stop on the timeline under the countdown.
function Stop({ b, after }: { b: Batch; after: number }) {
  return (
    <li data-pop="" className={`rs-cd-stop ${b.flagship ? "is-flagship" : ""}`}>
      <span className="rs-cd-dot" aria-hidden />
      <div className="rs-cd-when">
        <b>{b.day} {b.month}</b>
        <small>{after > 0 ? `+${after} day${after > 1 ? "s" : ""}` : "same day"}</small>
      </div>
      <div className="rs-cd-what">
        <h4>{b.title}</h4>
        <p>{b.flagship ? "Flagship" : b.track} · {b.target} · {b.seats.left} of {b.seats.total} seats left</p>
      </div>
      <Btn href="#enrol" variant="light" size="sm" className="rs-cd-reg">Register</Btn>
    </li>
  );
}

export default function RecipeBatches() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = batches.filter((b) => filter === "All" || b.track === filter).sort((x, y) => when(x) - when(y));
  // the clock starts after mount, so server and browser markup match; it ticks once a second
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  // the next batch is the first one still ahead; if every date has passed, show the earliest and no countdown
  const upcoming = now === null ? visible : visible.filter((b) => when(b) > now);
  const next = upcoming[0] ?? visible[0];
  const rest = visible.filter((b) => b !== next);
  const left = next && now !== null ? Math.max(0, when(next) - now) : null;
  const d = left === null ? null : Math.floor(left / 86400000);
  const h = left === null ? null : Math.floor(left / 3600000) % 24;
  const m = left === null ? null : Math.floor(left / 60000) % 60;
  const sec = left === null ? null : Math.floor(left / 1000) % 60;
  const DAY = 86400000;

  return (
    <section id="batches" className="relative overflow-hidden bg-[var(--rs-cream)] px-7 py-28 text-[var(--rs-deep)]">
      <div className="relative mx-auto max-w-[var(--rs-max)]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p data-pop="" className="rs-small text-[14px] text-[var(--rs-rust)]">
              Admissions open · 2027 · <span lang="hi" className="rs-hi normal-case">प्रवेश</span>
            </p>
            <h2 data-pop="" className="rs-display mt-4 text-[clamp(52px,6.6vw,108px)]">
              Next batches
              <br />
              <span className="text-[var(--rs-orange)]">starting soon</span>
            </h2>
            <p data-pop="" className="mt-5 max-w-[560px] text-xl leading-snug text-[var(--rs-deep)]/80">
              Register online, or call{" "}
              <a href="tel:+918062206330" className="underline decoration-[var(--rs-orange)] decoration-2 underline-offset-4">080-6220-6330</a>{" "}
              for registration or seat allotment.
            </p>
          </div>
          <div data-pop="" role="group" aria-label="Filter batches" className="flex flex-wrap gap-2">
            {FILTERS.filter((f) => countFor(f) > 0).map((f) => (
              <button key={f} type="button" aria-pressed={f === filter} onClick={() => setFilter(f)} className={`rs-bt-chip ${f === filter ? "is-on" : ""}`}>
                {f}
                <span>{countFor(f)}</span>
              </button>
            ))}
          </div>
        </div>

        {next ? (
          <div className="rs-cd">
            <div data-pop="" className="rs-cd-hero">
              <p className="rs-cd-kicker">{next.flagship ? "Flagship batch" : "Next batch"} starts in</p>
              <div className="rs-cd-clock" role="timer" aria-label={left === null ? "Countdown" : `${d} days, ${h} hours and ${m} minutes to the next batch`}>
                <Tile value={d} unit="Days" />
                <Tile value={h} unit="Hours" />
                <Tile value={m} unit="Minutes" />
                <Tile value={sec} unit="Seconds" />
              </div>
              <p className="rs-cd-date">{label(next)} · 9 AM</p>
              <h3 className="rs-cd-title">{next.title}</h3>
              <p className="rs-cd-sum">{next.summary}</p>
              <Meter left={next.seats.left} total={next.seats.total} dark />
              <p className="rs-cd-facts">{next.programme} · {next.target} · {next.mode}</p>
              <Btn href="#enrol" variant="saffron" className="rs-cd-go">Register for this batch</Btn>
            </div>

            <div className="rs-cd-after">
              <p data-pop="" className="rs-cd-after-h">{rest.length ? "Then" : "No other batches under this filter"}</p>
              <ol className="rs-cd-line">
                {rest.map((b) => (
                  <Stop key={`${b.day}-${b.title}`} b={b} after={Math.round((when(b) - when(next)) / DAY)} />
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <p className="mt-12 text-xl">No batches under this filter.</p>
        )}

        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-base text-[var(--rs-deep)]/80">
          Can&rsquo;t find your batch? Our counsellors will match you to the right one.
          <a href="#enrol" className="rs-bt-ask">
            Ask a counsellor
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" />
            </svg>
          </a>
        </p>
        {SHOW_SAMPLE_NOTE && <p className="mt-4 text-center text-[12px] opacity-60">Dates and seat counts shown are sample figures, to be confirmed.</p>}
      </div>
    </section>
  );
}
