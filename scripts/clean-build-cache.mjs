// Runs before `next build`. Vercel restores .next/cache from the previous deploy, and Turbopack
// reused the old compiled globals.css from it (the vintage-paper styles never reached production).
// Clearing it costs a little build time and guarantees the CSS matches the source.
import { rmSync } from "node:fs";

rmSync(".next/cache", { recursive: true, force: true });
