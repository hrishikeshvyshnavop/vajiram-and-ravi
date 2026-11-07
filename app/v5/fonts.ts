import { Anek_Devanagari, Hanken_Grotesk, Kalam, League_Spartan, Old_Standard_TT, Playfair_Display, UnifrakturMaguntia } from "next/font/google";

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

// "Meet the toppers" as an old newspaper front page (RecipeToppersPaper.tsx): blackletter masthead,
// high-contrast condensed headlines and a 19th-century newsprint body face.
export const paperMast = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--rs-paper-mast" });
export const paperHead = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"], style: ["normal", "italic"], variable: "--rs-paper-head" });
export const paperBody = Old_Standard_TT({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--rs-paper-body" });

// "Tradition & results" as a bahi-khata ledger (RecipeLedger.tsx): Kalam (Indian Type Foundry) is a
// handwriting face with matching Latin and Devanagari, for the inked entries.
export const ledgerHand = Kalam({ subsets: ["latin", "devanagari"], weight: ["400", "700"], variable: "--rs-hand" });

// Headings (2026-11-07): the whole page uses the hero face, Anek (--rs-head), bold and condensed. Martel was removed.

export const recipeFonts = `${spartan.variable} ${hankenRs.variable} ${anek.variable} ${anekHindi.variable} ${paperMast.variable} ${paperHead.variable} ${paperBody.variable} ${ledgerHand.variable}`;
