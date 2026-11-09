"use client";

import { useState } from "react";
import { INDIA_DOTS, INDIA_GRID as G } from "./indiaDots";

// Contact and campus as a dotted map on white (user 2026-11-09: "build the contact section, map dotted, in white bg"). A dot-matrix map of
// India (one dot per grid cell inside the outline, see indiaDots.ts and its note on the boundary) with a pin on New Delhi and one on
// Chennai; beside it the four ways to find us. Hovering or focusing a city's label or card lights its pin. Facts are the same as the milestone
// version: the Delhi address, landmark and map link, "Egmore, Chennai" (no full address yet, so no directions link), the phone with its hours,
// and the admissions email. No WhatsApp (the current site's link is a placeholder).

const PHONE = "080-6220-6330";
const EMAIL = "admissions@vajiramandravi.com";
const DELHI_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060";

const U = 10; // map units per grid cell
const W = G.cols * U;
const H = G.rows * U;
const at = (lon: number, lat: number) => ({ x: ((lon - G.lon0) / G.dlon) * U, y: ((G.lat1 - lat) / G.step) * U });

// the dots as one path of zero-length segments with round caps (one element instead of 675)
const DOT_PATH = Array.from({ length: INDIA_DOTS.length / 2 }, (_, i) => `M${INDIA_DOTS[i * 2] * U + U / 2} ${INDIA_DOTS[i * 2 + 1] * U + U / 2}h.01`).join("");

const places = [
  { id: "delhi", label: "New Delhi", ...at(77.209, 28.614) },
  { id: "chennai", label: "Chennai", ...at(80.27, 13.083) },
] as const;
type PlaceId = (typeof places)[number]["id"];

const Arrow = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

export default function ContactMap() {
  const [active, setActive] = useState<PlaceId | null>("delhi");
  const on = (id: PlaceId) => () => setActive(id);

  return (
    <div className="rs-cm">
      <div className="rs-cm-map">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Dotted map of India with our campuses in New Delhi and Chennai">
          <path d={DOT_PATH} className="rs-cm-dots" />
          {places.map((p) => (
            <g key={p.id} transform={`translate(${p.x} ${p.y})`} className={`rs-cm-pinwrap ${active === p.id ? "is-on" : ""}`}>
              <circle r="9" className="rs-cm-pulse" />
              <circle r="7" className="rs-cm-pin" />
              <circle r="2.6" className="rs-cm-pinc" />
            </g>
          ))}
        </svg>
        {places.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`rs-cm-label ${active === p.id ? "is-on" : ""}`}
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
            onMouseEnter={on(p.id)}
            onFocus={on(p.id)}
            onClick={on(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ul className="rs-cm-list">
        <li className={`rs-cm-item ${active === "delhi" ? "is-on" : ""}`} onMouseEnter={on("delhi")}>
          <p className="rs-cm-tag">New Delhi · Head campus</p>
          <h4>Old Rajinder Nagar</h4>
          <p>1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi – 110060</p>
          <p className="rs-cm-near">Adjacent to Gate 5, Karol Bagh Metro Station &amp; Pillar no. 103</p>
          <a href={DELHI_MAPS} target="_blank" rel="noopener noreferrer" className="rs-cm-link" onFocus={on("delhi")}>
            Get directions
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
              <path d="M4 12 12 4M5.5 4H12v6.5" />
            </svg>
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </li>
        <li className={`rs-cm-item ${active === "chennai" ? "is-on" : ""}`} onMouseEnter={on("chennai")}>
          <p className="rs-cm-tag">Chennai · Campus</p>
          <h4>Egmore</h4>
          <p>Egmore, Chennai.</p>
          <p className="rs-cm-near">Ask a counsellor for the full address and the current batches in Chennai.</p>
          <a href="#enrol" className="rs-cm-link" onFocus={on("chennai")}>
            Ask a counsellor
            <Arrow />
          </a>
        </li>
        <li className="rs-cm-item rs-cm-chan">
          <div>
            <p className="rs-cm-tag">Talk to us</p>
            <h4>{PHONE}</h4>
            <p className="rs-cm-near">Mon – Sat, 9 AM – 7 PM</p>
          </div>
          <a href="tel:+918062206330" className="rs-cm-link">
            Call now
            <Arrow />
          </a>
        </li>
        <li className="rs-cm-item rs-cm-chan">
          <div>
            <p className="rs-cm-tag">Email us</p>
            <h4 className="rs-cm-mail">{EMAIL}</h4>
            <p className="rs-cm-near">Admissions and course questions</p>
          </div>
          <a href={`mailto:${EMAIL}`} className="rs-cm-link">
            Send an email
            <Arrow />
          </a>
        </li>
      </ul>
    </div>
  );
}
