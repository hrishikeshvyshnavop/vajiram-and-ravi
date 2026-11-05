import { Anton, Archivo, Hanken_Grotesk, Libre_Caslon_Display, Newsreader } from "next/font/google";

// Free look-alikes for the five licensed CANALS faces (user decision, 2026-11-05):
//   Caslon Graphique  -> Libre Caslon Display  (giant years and numerals)
//   Grifinito M       -> Newsreader            (large editorial paragraphs, menu, loader line)
//   Graphik (+Italic) -> Hanken Grotesk        (captions, small body)
//   Maelstrom Sans Bd -> Archivo, wide + bold  (loader counter, labels, letter-spaced titles)
//   Coign 37B         -> Anton                 (numbers inside the circles)
export const caslon = Libre_Caslon_Display({ weight: "400", subsets: ["latin"], variable: "--bs-caslon" });
export const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--bs-serif" });
export const hanken = Hanken_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--bs-sans" });
export const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--bs-wide" });
export const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--bs-cond" });

export const brandStoryFonts = [caslon, newsreader, hanken, archivo, anton].map((f) => f.variable).join(" ");
