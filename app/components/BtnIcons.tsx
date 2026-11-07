// Icons for the /v5 button system (user 2026-11-06: "the buttons in /v5 should be consistent").
// Primary = .rs-hdr-cta (square block, Roll label, ArrowUpRight). Secondary = .rs-hdr-link (text, Roll
// label, one of the other icons). All 16-unit, 2px square-cap strokes in currentColor.

const base = { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "square" as const, "aria-hidden": true };

export function ArrowUpRight() {
  return (
    <svg {...base} className="rs-hdr-cta-arrow size-3.5">
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg {...base} className="rs-hdr-down size-3.5">
      <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" className="rs-hdr-icon size-3.5">
      <path d="M3 2.5h3l1.2 3.2-1.7 1.2a8 8 0 0 0 3.6 3.6l1.2-1.7 3.2 1.2v3a1 1 0 0 1-1 1A11.5 11.5 0 0 1 2 3.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg {...base} className="rs-hdr-icon size-3.5">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}
