# Vajiram & Ravi — homepage iterations

Next.js 16 (App Router, Turbopack) + Tailwind 4 + GSAP. The index page (`/`) lists every
homepage iteration with a live preview; each iteration is its own route.

| Route | What it is |
| --- | --- |
| `/manifesto` | Manifesto scroll film (Iteration 11, after manifesto.blandina.org; source in apps/manifesto, synced on dev/build) — primary |
| `/v5` | Your UPSC journey, bold Indian landing (Iteration 10, after eathungrytiger.com) — primary |
| `/v4` | Brand story, horizontal editorial scroll (Iteration 9, after canals-amsterdam.com) — primary |
| `/constitution-book` | Constitution book (Iteration 8) — primary |
| `/v1` | Slider hero (Iteration 1) — primary |
| `/hero-parliament` | Parliament scroll story (Iteration 5) — primary |
| `/v2`, `/v3`, `/lidar-amazon`, `/parliament-particles` | Archived iterations |
| `/pattern-intro`, `/cta-start-today`, `/scroll-demo` | Archived single sections |

## Project layout

```
app/              routes (one folder per iteration) + shared components in app/components
public/           images, brand assets, thumbnails (v3 images under public/v3; v5 collage, newsprint and footer art under public/v5)
scripts/          dev-only helpers (thumbnail capture, v3 HTML→JSX sync); not part of the build
next.config.ts    images, Turbopack CSS loader, cache components
```

## Run locally

Requires Node 20.9+. The workspace path contains `&`, which breaks npm's script shims on
Windows, so the scripts call Next directly:

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel

This folder is the whole app — deploy it as the project root.

1. Push this folder as a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel, **Add New → Project**, import the repository. Framework preset: **Next.js**
   (detected automatically). Build command `npm run build`, install command `npm install`,
   output directory default.
3. If the repository is the whole workspace instead (with this app at `apps/my-app`), set
   **Root Directory** to `apps/my-app` in the project settings.

No environment variables are required.
