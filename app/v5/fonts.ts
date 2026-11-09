import { Anek_Devanagari, Hanken_Grotesk, League_Spartan, Playfair_Display } from "next/font/google";

// eathungrytiger.com look-alikes for small type:
//   Graphik X Medium (body)              -> Hanken Grotesk
//   Salmond (pills, tags, small labels)  -> League Spartan
// Headlines + Hindi lines: Anek (Ek Type, Mumbai), Devanagari build, which carries matching Latin.
// Variable weight and width; headlines use it bold and slightly condensed. User decision 2026-11-06,
// replacing Yatra One (its Devanagari-styled Latin read as religious rather than Indian).
export const spartan = League_Spartan({ subsets: ["latin"], variable: "--rs-display" });
export const hankenRs = Hanken_Grotesk({ subsets: ["latin"], variable: "--rs-body" });
// Perf (2026-11-06): the variable Devanagari file (all weights x widths) was 709 KB and only the small
// Hindi lines use it. Headlines keep the variable Latin (width axis); Hindi lines get a single static
// weight-500 Devanagari instance (--rs-hi-font) of the same family, so they look the same.
export const anek = Anek_Devanagari({ subsets: ["latin"], axes: ["wdth"], variable: "--rs-head" });
export const anekHindi = Anek_Devanagari({ subsets: ["devanagari"], weight: "500", variable: "--rs-hi-font", preload: false });

export const paperHead = Playfair_Display({ subsets: ["latin"], weight: "700", variable: "--rs-paper-head" });
// Headings (2026-11-07): the whole page uses the hero face, Anek (--rs-head), bold and condensed. Martel was removed.

export const recipeFonts = `${spartan.variable} ${hankenRs.variable} ${anek.variable} ${anekHindi.variable} ${paperHead.variable}`;

// Type system for /v5 (2026-11-09, "make all fonts used consistent"): Hanken Grotesk for headings and body, League Spartan for labels, eyebrows and
// buttons, Anek Devanagari for Hindi, Playfair Display (--rs-paper-head) only for the hero title and the header logo. Sizes snap to
// 12 13 14 16 18 20 22 24 28 32 40 48 56 64 px (responsive headings keep their clamp()); weights are 500 body, 600 emphasis, 700 headings.
