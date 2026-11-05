import { Hanken_Grotesk, League_Spartan, Yatra_One } from "next/font/google";

// eathungrytiger.com look-alikes for small type:
//   Graphik X Medium (body)              -> Hanken Grotesk
//   Salmond (pills, tags, small labels)  -> League Spartan
// Headlines: Yatra One (after Indian hand-painted signage; Latin + Devanagari). User decision 2026-11-05.
// (Tiro Devanagari Hindi was used for the vintage study-kit book, now replaced by the team's hero collage.)
export const spartan = League_Spartan({ subsets: ["latin"], variable: "--rs-display" });
export const hankenRs = Hanken_Grotesk({ subsets: ["latin"], variable: "--rs-body" });
export const yatra = Yatra_One({ weight: "400", subsets: ["latin", "devanagari"], variable: "--rs-head" });

export const recipeFonts = `${spartan.variable} ${hankenRs.variable} ${yatra.variable}`;
