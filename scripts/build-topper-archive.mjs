// One-off generator (2026-11-09): reads the official toppers data embedded in vajiramandravi.com/ias-selections-from-vajiram (saved as __NEXT_DATA__ json
// by the harness), downloads each topper's photo, makes it a 360px-wide grayscale webp in public/v5/archive/<year>/, and writes
// app/components/topperArchive.ts. Nothing is invented: name, rank and programmes come straight from the page's Strapi records.
import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "E:/workflows/rtest/archive/next_data.json";
const OUT_IMG = "public/v5/archive";
const OUT_TS = "app/components/topperArchive.ts";

const d = JSON.parse(fs.readFileSync(SRC, "utf8"));
const attrs = d.props.pageProps.data.iasToppersPage.data.attributes;
const lists = attrs.ToppersList;
const topTwo = attrs.TopTwoToppers.data.map((x) => x.attributes);

const clean = (name) =>
  name
    .replace(/[,;]+$/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => (/^[a-z]/.test(w) ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const byYear = {};
const add = (a, fallbackYear) => {
  const m = /(?:air|rank)\s*0*(\d+)/i.exec(a.Summary || "");
  if (!m) return;
  const year = Number(a.Year) || fallbackYear || Number((/(20\d\d)/.exec(a.Summary || "") || [])[1]);
  const rank = Number(m[1]);
  const name = clean(a.Name);
  const prog = /\(([^)]*)\)\s*$/.exec((a.Summary || "").replace(/\s+/g, " "));
  const url = a.Image?.data?.attributes?.url;
  (byYear[year] ||= []);
  if (byYear[year].some((x) => x.rank === rank && x.name === name)) return;
  byYear[year].push({ year, rank, name, programmes: prog ? prog[1].trim() : "", url });
};
lists.forEach((y) => y.Toppers.data.forEach((t) => add(t.attributes, Number((/^(20\d\d)/.exec(y.Title) || [])[1]))));
topTwo.forEach(add);

let count = 0, failed = 0;
const jobs = [];
for (const [year, arr] of Object.entries(byYear)) {
  arr.sort((a, b) => a.rank - b.rank);
  fs.mkdirSync(`${OUT_IMG}/${year}`, { recursive: true });
  for (const t of arr) {
    const file = `${year}/${String(t.rank).padStart(2, "0")}-${slug(t.name)}.webp`;
    t.img = `/v5/archive/${file}`;
    jobs.push(async () => {
      try {
        if (!t.url) throw new Error("no url");
        const res = await fetch(t.url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf).resize({ width: 360, height: 450, fit: "cover", position: "top" }).grayscale().webp({ quality: 74 }).toFile(`${OUT_IMG}/${file}`);
        count++;
      } catch (e) {
        failed++;
        t.img = "";
        console.log("image failed:", year, t.rank, t.name, String(e).slice(0, 60));
      }
    });
  }
}
// small pool
const pool = 6;
let i = 0;
await Promise.all(Array.from({ length: pool }, async () => { while (i < jobs.length) await jobs[i++](); }));

const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);
const body = years
  .map((y) => `  ${y}: [\n${byYear[y].map((t) => `    { rank: ${t.rank}, name: ${JSON.stringify(t.name)}, programmes: ${JSON.stringify(t.programmes)}, img: ${JSON.stringify(t.img)} },`).join("\n")}\n  ],`)
  .join("\n");
const ts = `// Generated 2026-11-09 by build-archive.mjs from the official toppers page https://vajiramandravi.com/ias-selections-from-vajiram/ (its embedded Strapi data).
// Name, rank and programmes are exactly as published there (names tidied: trailing commas removed, first letters capitalised); the page has no 2015 list.
// Photos are 360x450 grayscale webp copies of the page's own images in public/v5/archive/<year>/. "programmes" is empty where the page names none (2016 to 2022).
export type ArchiveTopper = { rank: number; name: string; programmes: string; img: string };

export const ARCHIVE_YEARS = [${years.join(", ")}] as const;

export const ARCHIVE: Record<number, ArchiveTopper[]> = {
${body}
};
`;
fs.writeFileSync(OUT_TS, ts);
console.log("years", years.join(","), "| entries", Object.values(byYear).reduce((a, b) => a + b.length, 0), "| images ok", count, "failed", failed);
console.log(years.map((y) => `${y}:${byYear[y].length}`).join("  "));
