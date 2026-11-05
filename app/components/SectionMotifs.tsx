import { useId } from "react";
import { Lotus, Paisley } from "./IndianArt";

// Background motifs for /v5. Every section gets its own Indian pattern and composition, so the page
// no longer repeats one paisley-and-lotus scatter. All line art, currentColor, aria-hidden; the
// caller sets colour/opacity with a text class. Drawn here, no source art.
//   newsprint: torn newspaper cuttings + ink splashes (from Sharon's v-sharon hero art), tinted
//              into the section colour with a luminosity blend
//   scatter  : paisley + lotus, loose
//   jaali    : lattice screen of interlocking quatrefoils, as a full tile
//   chakra   : two large 24-spoke wheels bleeding off opposite corners
//   kolam    : dot grid with looped kolam lines joining the dots
//   buti     : sparse block-print flower tile, offset rows
//   rangoli  : radial rangoli rosettes in two corners

export type MotifVariant = "newsprint" | "scatter" | "jaali" | "chakra" | "kolam" | "buti" | "rangoli";

function Newsprint() {
  // Two copies, the left one mirrored, fading toward the centre so headlines stay readable.
  const base = "absolute top-0 h-full w-[60%] bg-[url(/v5/newsprint.webp)] bg-cover mix-blend-luminosity";
  return (
    <>
      <div className={`${base} right-0 bg-left opacity-[0.15] [mask-image:linear-gradient(to_left,#000_45%,transparent_100%)]`} />
      <div className={`${base} left-0 -scale-x-100 bg-left opacity-[0.1] [mask-image:linear-gradient(to_left,#000_30%,transparent_95%)]`} />
    </>
  );
}

function Scatter() {
  const items = [
    { C: Paisley, x: "-4%", y: "8%", s: 22, r: -18 },
    { C: Lotus, x: "78%", y: "4%", s: 20, r: 12 },
    { C: Paisley, x: "86%", y: "52%", s: 26, r: 160 },
    { C: Lotus, x: "4%", y: "64%", s: 18, r: -8 },
    { C: Paisley, x: "40%", y: "78%", s: 14, r: 40 },
  ];
  return (
    <>
      {items.map(({ C, x, y, s, r }, i) => (
        <div key={i} className="absolute" style={{ left: x, top: y, width: `${s}vw`, transform: `rotate(${r}deg)` }}>
          <C className="h-auto w-full" />
        </div>
      ))}
    </>
  );
}

function Tile({ id, size, children }: { id: string; size: number; children: React.ReactNode }) {
  return (
    <svg className="absolute inset-0 h-full w-full">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          {children}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Jaali({ id }: { id: string }) {
  // Quatrefoil lattice: four arcs per cell meet the neighbours' arcs into a continuous screen.
  return (
    <Tile id={id} size={56}>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M28 4 A12 12 0 0 1 28 28 A12 12 0 0 1 28 4Z" />
        <path d="M28 28 A12 12 0 0 1 28 52 A12 12 0 0 1 28 28Z" />
        <path d="M4 28 A12 12 0 0 1 28 28 A12 12 0 0 1 4 28Z" />
        <path d="M28 28 A12 12 0 0 1 52 28 A12 12 0 0 1 28 28Z" />
        <circle cx="28" cy="28" r="3" />
        <circle cx="0" cy="0" r="5" />
        <circle cx="56" cy="0" r="5" />
        <circle cx="0" cy="56" r="5" />
        <circle cx="56" cy="56" r="5" />
      </g>
    </Tile>
  );
}

// Rounded so server and client render identical attribute strings (no hydration mismatch).
const r2 = (n: number) => Math.round(n * 100) / 100;

function Wheel({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="0.8">
      <circle r="96" />
      <circle r="88" />
      <circle r="14" />
      <circle r="6" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI * 2) / 24;
        const b = a + Math.PI / 24;
        return (
          <g key={i}>
            <line x1={r2(Math.cos(a) * 14)} y1={r2(Math.sin(a) * 14)} x2={r2(Math.cos(a) * 88)} y2={r2(Math.sin(a) * 88)} />
            <circle cx={r2(Math.cos(b) * 92)} cy={r2(Math.sin(b) * 92)} r="2" />
          </g>
        );
      })}
    </svg>
  );
}

function Chakra() {
  return (
    <>
      <Wheel className="absolute -top-[18vw] -right-[14vw] w-[46vw] animate-[spin_120s_linear_infinite]" />
      <Wheel className="absolute -bottom-[22vw] -left-[16vw] w-[40vw] animate-[spin_160s_linear_infinite_reverse]" />
    </>
  );
}

function Kolam({ id }: { id: string }) {
  // Pulli kolam: a dot grid with loops weaving around alternate dots.
  return (
    <Tile id={id} size={48}>
      <g fill="currentColor">
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="36" cy="12" r="1.6" />
        <circle cx="12" cy="36" r="1.6" />
        <circle cx="36" cy="36" r="1.6" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M24 0 C34 6 34 18 24 24 C14 30 14 42 24 48" />
        <path d="M0 24 C6 14 18 14 24 24 C30 34 42 34 48 24" />
        <circle cx="12" cy="12" r="7" />
        <circle cx="36" cy="36" r="7" />
      </g>
    </Tile>
  );
}

function Buti({ id }: { id: string }) {
  // Block-print buti: small four-petal flowers in offset rows, lots of air between them.
  const flower = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="1.1">
      {[0, 90, 180, 270].map((r) => (
        <path key={r} transform={`rotate(${r})`} d="M0 -2 C4 -6 4 -12 0 -15 C-4 -12 -4 -6 0 -2Z" />
      ))}
      {[45, 135, 225, 315].map((r) => (
        <circle key={r} transform={`rotate(${r})`} cx="0" cy="-9" r="1.2" fill="currentColor" stroke="none" />
      ))}
      <circle r="2" />
    </g>
  );
  return (
    <Tile id={id} size={120}>
      {flower(30, 30)}
      {flower(90, 90)}
    </Tile>
  );
}

function Rosette({ className }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      {[0, 1, 2].map((ring) => {
        const n = [8, 12, 16][ring];
        const r = [26, 52, 80][ring];
        const len = [24, 22, 18][ring];
        return Array.from({ length: n }, (_, i) => (
          <path key={`${ring}-${i}`} transform={`rotate(${(360 / n) * i + ring * 11})`} d={`M0 -${r - len} C${len * 0.45} -${r - len * 0.5} ${len * 0.45} -${r} 0 -${r + 4} C-${len * 0.45} -${r} -${len * 0.45} -${r - len * 0.5} 0 -${r - len}Z`} />
        ));
      })}
      <circle r="10" />
      <circle r="92" strokeDasharray="2 6" />
    </svg>
  );
}

function Rangoli() {
  return (
    <>
      <Rosette className="absolute -top-[10vw] -left-[10vw] w-[34vw]" />
      <Rosette className="absolute -right-[12vw] -bottom-[12vw] w-[40vw]" />
    </>
  );
}

export default function SectionMotif({ variant, className = "" }: { variant: MotifVariant; className?: string }) {
  const id = `m-${variant}-${useId().replace(/:/g, "")}`;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden text-black/25 ${className}`} aria-hidden>
      {variant === "newsprint" && <Newsprint />}
      {variant === "scatter" && <Scatter />}
      {variant === "jaali" && <Jaali id={id} />}
      {variant === "chakra" && <Chakra />}
      {variant === "kolam" && <Kolam id={id} />}
      {variant === "buti" && <Buti id={id} />}
      {variant === "rangoli" && <Rangoli />}
    </div>
  );
}
