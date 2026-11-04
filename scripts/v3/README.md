# Iteration 3 sync scripts

`/v3` is the current Vajiram & Ravi site (kevin-vajiram.netlify.app) ported into this app. These
scripts regenerate `app/v3/sections/*.tsx` from that site's server-rendered HTML.

1. Download the page and its stylesheet into a scratch folder (not inside the project):
   `curl -o index.html https://kevin-vajiram.netlify.app/`
2. Split it into top-level parts: `python -I split_site.py <scratch folder>` (writes `<scratch>/parts/`)
3. Convert parts to JSX: `python -I html2jsx.py <scratch>/parts ../../app/v3/sections`
4. Download any new images under `/images/...` into `public/v3/images/` (same paths).

Behaviour (carousels, ticker, tabs, FAQ, map zoom, form, scroll reveal, fit-to-width zoom) is
hand-written in `app/v3/V3Behaviors.tsx`; design tokens live in `app/globals.css` (`.v3` scope).
