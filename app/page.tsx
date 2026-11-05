import Link from "next/link";
import LivePreview from "./components/LivePreview";
import Logo from "./components/Logo";

// `name` is the descriptive title; `tag` keeps the original iteration number for reference.
type Route = { href: string; name: string; tag: string; summary: string };

// Primary iterations, shown first under "Storytelling mode". Add a new iteration here once its
// route exists; move it to `archive` when it is no longer a candidate.
const primary: Route[] = [
  {
    href: "/v5",
    name: "Your UPSC journey (bold Indian)",
    tag: "Iteration 10",
    summary: "Rust-and-saffron landing with Indian type and Hindi lines: the team's India collage reacts to the mouse, tilts and breaks into the GS syllabus on scroll; toppers, faculty, FAQ, lead form and a Parliament footer (after eathungrytiger.com).",
  },
  {
    href: "/v4",
    name: "Brand story (editorial)",
    tag: "Iteration 9",
    summary: "Loader counter, then a horizontal editorial scroll through the V&R story: Origin 1976, Method, Results 2025, Reach, Credits (after canals-amsterdam.com).",
  },
  {
    href: "/constitution-book",
    name: "Constitution book",
    tag: "Iteration 8",
    summary: "The Constitution of India cover tilts toward the cursor; scrolling opens it on the Preamble and dives into the page, then the site follows (after ten.375.studio).",
  },
  {
    href: "/v1",
    name: "Slider hero",
    tag: "Iteration 1",
    summary: "Frosted header and a four-slide hero with tabs.",
  },
  {
    href: "/hero-parliament",
    name: "Parliament scroll story",
    tag: "Iteration 5",
    summary: "Preloader, then a Parliament scroll story: the camera dives into the colonnade, and through smoke the chamber appears (after untillabs.com).",
  },
];

// Everything else stays reachable at its own URL, listed under Archive.
const archivedIterations: Route[] = [
  {
    href: "/v2",
    name: "Full-bleed hero",
    tag: "Iteration 2",
    summary: "Thin header, single full-bleed hero, toppers statement and marquee under the hero, topper portraits.",
  },
  {
    href: "/v3",
    name: "Current site (baseline)",
    tag: "Iteration 3",
    summary: "The current Vajiram & Ravi site (kevin-vajiram.netlify.app), ported section by section as the baseline.",
  },
  {
    href: "/lidar-amazon",
    name: "LiDAR forest",
    tag: "Iteration 6",
    summary: "Procedural LiDAR point-cloud forest with a scroll-driven camera and editorial overlays.",
  },
  {
    href: "/parliament-particles",
    name: "Parliament particles",
    tag: "Iteration 7",
    summary: "The supplied Parliament image converted into an animated point-cloud experience.",
  },
];

// Standalone sections built for review, also archived.
const archivedSections: Route[] = [
  {
    href: "/pattern-intro",
    name: "Pattern band",
    tag: "Section · About",
    summary: "Indian kolam and buti tile band over a label and large statement, after the AI in Design 2026 report.",
  },
  {
    href: "/cta-start-today",
    name: "Start today",
    tag: "Section · CTA",
    summary: "Living wordmark on warm paper with two buttons, after tines.com.",
  },
  {
    href: "/scroll-demo",
    name: "Hero to toppers",
    tag: "Section · Scroll",
    summary: "Hero pins, the photo clips into a card and a year counter runs 1976 → 2026 before the toppers section.",
  },
];

// One card per route, its cover a live, scaled-down view of the page itself.
function RouteCards({ items, columns }: { items: Route[]; columns: 2 | 3 }) {
  return (
    <ul className={`mt-8 grid gap-6 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((it) => (
        <li key={it.href}>
          <Link
            href={it.href}
            className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]"
          >
            <div className="border-b border-neutral-200">
              <LivePreview src={it.href} title={it.name} />
            </div>
            <div className="flex items-start gap-4 p-5">
              <span className="flex-1">
                <span className="block font-mono text-xs uppercase tracking-wide text-neutral-400">{it.tag}</span>
                <span className="mt-1 block text-lg font-medium">{it.name}</span>
                <span className="mt-1 block text-sm text-neutral-500">{it.summary}</span>
                <span className="mt-2 block font-mono text-xs text-neutral-400">{it.href}</span>
              </span>
              <span className="shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900">
                →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Iterations() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <Logo />
        Vajiram &amp; Ravi
      </div>
      <h1 className="mt-4 font-headline text-4xl tracking-tight">Homepage iterations</h1>
      <p className="mt-2 text-neutral-500">Pick an iteration to open it.</p>

      <h2 className="mt-14 font-headline text-3xl tracking-tight">Storytelling mode</h2>
      <p className="mt-2 text-neutral-500">The primary iterations.</p>
      <RouteCards items={primary} columns={2} />

      <h2 className="mt-20 font-headline text-3xl tracking-tight text-neutral-500">Archive</h2>
      <p className="mt-2 text-neutral-500">Earlier iterations and single sections, kept for reference at their own URLs.</p>
      <h3 className="mt-10 text-sm font-medium uppercase tracking-wide text-neutral-400">Iterations</h3>
      <RouteCards items={archivedIterations} columns={3} />
      <h3 className="mt-10 text-sm font-medium uppercase tracking-wide text-neutral-400">Sections</h3>
      <RouteCards items={archivedSections} columns={3} />
    </main>
  );
}
