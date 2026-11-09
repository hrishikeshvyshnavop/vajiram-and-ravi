"use client";

import { useEffect, useState } from "react";
import Btn from "./RecipeButton";

// Free resources, rethought (user 2026-11-07: "this section needs to be rethought"). The earlier version was a bento of seven tiles
// with a live feed, a magazine stack and a calendar path (backup: apps/my-app/backup/removed-sections). It looked like the Courses
// cards above it and made the visitor decode seven tiles. This version is a reading-room index: an intro on the left with today's
// date, and on the right one ruled list, grouped by how often it changes (every day, every month, reference), each row a number,
// a title, one line, and an arrow. One glance shows what is free and how fresh it is.
// The resources are the ones already named on the site (current affairs, The Recitals, notes, papers, syllabus, calendar, postal
// books). Links are "#" until the resource pages exist (same as the footer's resource links).

type Item = { title: string; text: string; tag: string };
const groups: { label: string; hi: string; items: Item[] }[] = [
  {
    label: "Every day",
    hi: "हर दिन",
    items: [
      { title: "Editorial Analysis", text: "The day's editorials, read the way UPSC asks.", tag: "Daily" },
      { title: "Prelims Pointers", text: "Current affairs in short points for revision.", tag: "Prelims" },
      { title: "Mains Articles", text: "Issue-based articles for GS answer writing.", tag: "Mains" },
    ],
  },
  {
    label: "Every month",
    hi: "हर महीने",
    items: [{ title: "The Recitals", text: "UPSC current affairs monthly material, free to download.", tag: "Monthly" }],
  },
  {
    label: "Always there",
    hi: "संदर्भ",
    items: [
      { title: "UPSC Quest Notes", text: "Free study notes, topic by topic.", tag: "Notes" },
      { title: "Previous year papers", text: "Prelims and Mains papers, with the UPSC answer key.", tag: "Practice" },
      { title: "Syllabus & exam pattern", text: "What is asked at each stage, and how it is marked.", tag: "Guide" },
      { title: "UPSC Calendar 2027", text: "Every stage date, plus the age limit and eligibility rules.", tag: "Key dates" },
      { title: "GS postal books", text: "Printed General Studies material for UPSC preparation.", tag: "Books" },
    ],
  },
];

export default function RecipeResources() {
  const [today, setToday] = useState("");
  useEffect(() => {
    // today's date is client-only (keeps the static export stable)
    const d = new Date();
    const id = requestAnimationFrame(() => setToday(d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })));
    return () => cancelAnimationFrame(id);
  }, []);

  let n = 0;
  return (
    <section id="resources" className="rs-lib" aria-labelledby="lib-title">
      <div className="rs-lib-wrap">
        <div className="rs-lib-intro">
          <p data-pop="" className="rs-lib-eyebrow">
            <span className="l-en">Free resources · </span><span lang="hi" className="rs-hi normal-case">निःशुल्क संसाधन</span>
          </p>
          <h2 id="lib-title" data-pop="" className="rs-lib-title">
            Your preparation
            <br />
            can <em>begin today</em>
          </h2>
          <p data-pop="" className="rs-lib-lead">
            Daily current affairs, a monthly magazine and the official papers. Free, from the Vajiram &amp; Ravi editorial desk.
          </p>
          <p data-pop="" className="rs-lib-today">
            <span aria-hidden />
            {today ? `Updated today · ${today}` : "Updated daily"}
          </p>
          <div data-pop="" className="rs-lib-cta">
            <Btn href="#" variant="ink">Open the library</Btn>
          </div>
        </div>

        <div className="rs-lib-list">
          {groups.map((g) => (
            <div key={g.label} data-pop="" className="rs-lib-group">
              <h3 className="rs-lib-group-name">
                {g.label} <i lang="hi" className="rs-hi">{g.hi}</i>
              </h3>
              <ul>
                {g.items.map((it) => {
                  n += 1;
                  return (
                    <li key={it.title}>
                      <a href="#" className="rs-lib-row">
                        <span className="rs-lib-num">{String(n).padStart(2, "0")}</span>
                        <span className="rs-lib-main">
                          <b>{it.title}</b>
                          <small>{it.text}</small>
                        </span>
                        <span className="rs-lib-tag">{it.tag}</span>
                        <span className="rs-lib-arrow" aria-hidden>
                          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
                            <path d="M2 8h11M9 4l4 4-4 4" />
                          </svg>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
