"use client";

import { useEffect } from "react";

// Iteration 3: the interactions of the current Vajiram & Ravi site, attached to its ported
// markup (the sections are static server components generated from that site's HTML).
// Timings and geometry were measured on kevin-vajiram.netlify.app.

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Dots: active is size-2 brand, the next one size-2 grey, the rest size-1 grey (as on the site).
function paintDots(dots: HTMLElement[], active: number) {
  dots.forEach((d, i) => {
    const on = i === active;
    const near = i === (active + 1) % dots.length;
    d.setAttribute("aria-selected", String(on));
    d.classList.remove("size-1", "size-2", "bg-brand-500", "bg-control");
    d.classList.add(on || near ? "size-2" : "size-1", on ? "bg-brand-500" : "bg-control");
  });
}

// Scroll reveal: [data-reveal] fades up once; children of [data-reveal-group] stagger in.
function setupReveal(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      const el = child as HTMLElement;
      el.setAttribute("data-reveal", "true");
      el.style.setProperty("--d", `${i * 60}ms`);
    });
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// Header gains a soft shadow once the page scrolls.
function setupHeader(root: HTMLElement) {
  const hdr = root.querySelector<HTMLElement>("#hdr");
  if (!hdr) return () => {};
  const onScroll = () => {
    hdr.style.boxShadow = window.scrollY > 4 ? "0 6px 20px -12px rgba(28,25,23,.18)" : "";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

// Announcement ticker: the track holds its items twice; scroll by one copy at ~42px/s.
function setupTicker(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>("#annTrack");
  if (!track || reduceMotion()) return () => {};
  const measure = () => {
    const dist = track.scrollWidth / 2;
    track.style.setProperty("--dist", `${dist}px`);
    track.style.setProperty("--dur", `${dist / 42}s`);
    track.classList.add("run");
  };
  measure();
  window.addEventListener("resize", measure);
  return () => window.removeEventListener("resize", measure);
}

type CoverflowGeom = (offset: number) => { left: number; width: number };

// Looping carousel of absolutely positioned [data-k] panels, laid out around the centre.
// `geom` maps a panel's offset from the active one to its left (from 50%) and width.
function setupCoverflow(section: HTMLElement, geom: CoverflowGeom, autoplayMs: number) {
  const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-k]"));
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[role="tablist"] [role="tab"]'));
  const n = dots.length || 1;
  if (!panels.length) return () => {};
  const keys = panels.map((p) => Number(p.dataset.k));
  const minK = Math.min(...keys);
  const span = panels.length;
  // Each panel's content repeats every n keys; keep one template per content index so a panel
  // that wraps around can take the right content.
  const mod = (a: number, b: number) => ((a % b) + b) % b;
  let activeK = keys[panels.findIndex((p) => p.dataset.active === "true")] ?? 0;
  const contentIdx = (k: number) => mod(k - activeK, n);
  const templates = new Map<number, string>();
  panels.forEach((p, i) => {
    const idx = contentIdx(keys[i]);
    if (!templates.has(idx)) templates.set(idx, p.innerHTML);
  });
  const baseActive = activeK;
  // Dot of the initially active panel, read once (the dots repaint as the carousel moves).
  const baseDot = Math.max(0, dots.findIndex((d) => d.getAttribute("aria-selected") === "true"));
  const dotIndexOf = (k: number) => mod(k - baseActive + baseDot, n);

  const layout = (instant: boolean[] = []) => {
    panels.forEach((p, i) => {
      const k = Number(p.dataset.k);
      const off = k - activeK;
      const { left, width } = geom(off);
      if (instant[i]) p.style.transition = "none";
      p.style.left = `calc(50% + ${left}px)`;
      p.style.width = `${width}px`;
      p.dataset.active = String(off === 0);
      p.setAttribute("aria-hidden", String(off !== 0));
      if (instant[i]) {
        void p.offsetWidth;
        p.style.transition = "";
      }
    });
    paintDots(dots, dotIndexOf(activeK));
  };

  const go = (delta: number) => {
    activeK += delta;
    const instant = panels.map(() => false);
    // Keep panels within [activeK + minRel, activeK + minRel + span): wrap the ones that fell out.
    const minRel = minK - baseActive;
    panels.forEach((p, i) => {
      let k = Number(p.dataset.k);
      let wrapped = false;
      while (k < activeK + minRel) {
        k += span;
        wrapped = true;
      }
      while (k >= activeK + minRel + span) {
        k -= span;
        wrapped = true;
      }
      if (wrapped) {
        p.dataset.k = String(k);
        const tpl = templates.get(mod(k - baseActive, n));
        if (tpl !== undefined) p.innerHTML = tpl;
        instant[i] = true;
      }
    });
    layout(instant);
  };

  const goTo = (dotIdx: number) => {
    const current = dotIndexOf(activeK);
    let delta = dotIdx - current;
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    if (delta) go(delta);
  };

  const cleanups: Array<() => void> = [];
  const on = (el: Element | null, type: string, fn: EventListener) => {
    if (!el) return;
    el.addEventListener(type, fn);
    cleanups.push(() => el.removeEventListener(type, fn));
  };

  dots.forEach((d, i) => on(d, "click", () => goTo(i)));
  const prev = section.querySelector('[aria-label^="Previous"]');
  const next = section.querySelector('[aria-label^="Next"]');
  on(prev, "click", () => go(-1));
  on(next, "click", () => go(1));
  panels.forEach((p) =>
    on(p, "click", () => {
      const off = Number(p.dataset.k) - activeK;
      if (off) go(off);
    }),
  );

  // Arrow buttons sit at the active panel's edges and appear on hover.
  const showArrows = (show: boolean) =>
    [prev, next].forEach((b) => {
      if (!b) return;
      (b as HTMLElement).classList.toggle("pointer-events-none", !show);
      (b as HTMLElement).style.opacity = show ? "1" : "";
    });
  const stage = panels[0].parentElement?.parentElement ?? section;
  on(stage, "mouseenter", () => showArrows(true));
  on(stage, "mouseleave", () => showArrows(false));

  // Swipe
  let startX: number | null = null;
  on(stage, "pointerdown", (e) => (startX = (e as PointerEvent).clientX));
  on(stage, "pointerup", (e) => {
    if (startX === null) return;
    const dx = (e as PointerEvent).clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });

  let timer: ReturnType<typeof setInterval> | undefined;
  const play = () => {
    if (autoplayMs && !reduceMotion()) timer = setInterval(() => go(1), autoplayMs);
  };
  const pause = () => clearInterval(timer);
  on(section, "mouseenter", pause);
  on(section, "mouseleave", () => {
    pause();
    play();
  });
  play();

  layout();
  return () => {
    pause();
    cleanups.forEach((c) => c());
  };
}

// Paged card row (educators, stories): one card per step, dots for pages, arrows hide at ends.
function setupPager(section: HTMLElement) {
  const track = section.querySelector<HTMLElement>(".flex.w-max");
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[role="tablist"] [role="tab"]'));
  const prev = section.querySelector<HTMLElement>('[aria-label^="Previous"]');
  const next = section.querySelector<HTMLElement>('[aria-label^="Next"]');
  if (!track || !dots.length) return () => {};
  const pages = dots.length;
  let page = 0;

  const step = () => {
    const first = track.children[0] as HTMLElement | undefined;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first ? first.getBoundingClientRect().width + gap : 0;
  };
  const toggle = (btn: HTMLElement | null, show: boolean) => {
    if (!btn) return;
    btn.classList.toggle("opacity-0", !show);
    btn.classList.toggle("pointer-events-none", !show);
    btn.classList.toggle("opacity-100", show);
    btn.classList.toggle("pointer-events-auto", show);
  };
  const render = () => {
    track.style.transform = page ? `translateX(${-page * step()}px)` : "";
    paintDots(dots, page);
    toggle(prev, page > 0);
    toggle(next, page < pages - 1);
  };
  const go = (p: number) => {
    page = Math.max(0, Math.min(pages - 1, p));
    render();
  };

  const handlers: Array<[Element, string, EventListener]> = [];
  const on = (el: Element | null, type: string, fn: EventListener) => {
    if (!el) return;
    el.addEventListener(type, fn);
    handlers.push([el, type, fn]);
  };
  on(prev, "click", () => go(page - 1));
  on(next, "click", () => go(page + 1));
  dots.forEach((d, i) => on(d, "click", () => go(i)));
  on(window as unknown as Element, "resize", () => render());
  render();
  return () => handlers.forEach(([el, t, fn]) => el.removeEventListener(t, fn));
}

// Toppers year tabs: restyle the selected pill and replay the grid's swap animation.
function setupYearTabs(section: HTMLElement) {
  const tabs = Array.from(section.querySelectorAll<HTMLElement>('[role="tablist"] [role="tab"]'));
  const panel = section.querySelector<HTMLElement>('[role="tabpanel"]');
  const onCls = tabs.find((t) => t.getAttribute("aria-selected") === "true")?.className ?? "";
  const offCls = tabs.find((t) => t.getAttribute("aria-selected") === "false")?.className ?? "";
  const handlers = tabs.map((tab) => {
    const fn = () => {
      tabs.forEach((t) => {
        const sel = t === tab;
        t.setAttribute("aria-selected", String(sel));
        t.className = sel ? onCls : offCls;
      });
      if (panel) {
        panel.setAttribute("aria-label", `UPSC CSE ${tab.textContent?.trim()} toppers`);
        panel.classList.remove("swap");
        void panel.offsetWidth;
        panel.classList.add("swap");
      }
    };
    tab.addEventListener("click", fn);
    return () => tab.removeEventListener("click", fn);
  });
  return () => handlers.forEach((h) => h());
}

// FAQ accordion: one open at a time, grid-rows 0fr/1fr with the plus/minus icon.
function setupFaq(section: HTMLElement) {
  const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>("button[aria-controls]"));
  const set = (btn: HTMLButtonElement, open: boolean) => {
    btn.setAttribute("aria-expanded", String(open));
    const region = section.querySelector<HTMLElement>(`#${btn.getAttribute("aria-controls")}`);
    region?.classList.toggle("grid-rows-[1fr]", open);
    region?.classList.toggle("grid-rows-[0fr]", !open);
    // The vertical bar of the plus collapses when open.
    const bar = btn.querySelector<SVGPathElement>("path.origin-\\[12px_12px\\]");
    bar?.classList.toggle("scale-y-0", open);
    bar?.classList.toggle("rotate-90", open);
  };
  const handlers = buttons.map((btn) => {
    const fn = () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      buttons.forEach((b) => set(b, b === btn ? open : false));
    };
    btn.addEventListener("click", fn);
    return () => btn.removeEventListener("click", fn);
  });
  return () => handlers.forEach((h) => h());
}

// Locations: sliding pill between city tabs, and map zoom 1× → 1.8× in 0.2 steps.
function setupLocations(section: HTMLElement) {
  const list = section.querySelector<HTMLElement>("#cityTabs");
  const pill = list?.querySelector<HTMLElement>("span[aria-hidden]");
  const tabs = Array.from(list?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
  const onCls = tabs.find((t) => t.getAttribute("aria-selected") === "true")?.className ?? "";
  const offCls = tabs.find((t) => t.getAttribute("aria-selected") === "false")?.className ?? "";
  const movePill = (tab: HTMLElement) => {
    if (!pill) return;
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
  };
  const cleanups: Array<() => void> = [];
  tabs.forEach((tab) => {
    const fn = () => {
      tabs.forEach((t) => {
        const sel = t === tab;
        t.setAttribute("aria-selected", String(sel));
        t.className = sel ? onCls : offCls;
      });
      movePill(tab);
    };
    tab.addEventListener("click", fn);
    cleanups.push(() => tab.removeEventListener("click", fn));
  });
  const first = tabs.find((t) => t.getAttribute("aria-selected") === "true");
  if (first) movePill(first);

  const zIn = section.querySelector<HTMLButtonElement>("#zIn");
  const zOut = section.querySelector<HTMLButtonElement>("#zOut");
  const mapWrap = section.querySelector<HTMLImageElement>("img")?.parentElement;
  let zoom = 1;
  const applyZoom = () => {
    if (mapWrap) {
      mapWrap.style.transform = zoom === 1 ? "" : `scale(${zoom.toFixed(1)})`;
      mapWrap.style.transition = "transform .4s var(--ease-smooth)";
    }
    if (zIn) zIn.disabled = zoom >= 1.8 - 1e-6;
    if (zOut) zOut.disabled = zoom <= 1 + 1e-6;
  };
  const zi = () => {
    zoom = Math.min(1.8, zoom + 0.2);
    applyZoom();
  };
  const zo = () => {
    zoom = Math.max(1, zoom - 0.2);
    applyZoom();
  };
  zIn?.addEventListener("click", zi);
  zOut?.addEventListener("click", zo);
  cleanups.push(() => zIn?.removeEventListener("click", zi), () => zOut?.removeEventListener("click", zo));
  return () => cleanups.forEach((c) => c());
}

// Lead form: client-side check and a toast, as on the site.
// TODO: connect to the client's lead system; until then nothing is sent anywhere.
function setupForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>("#leadForm");
  const toast = root.querySelector<HTMLElement>("#toast");
  if (!form) return () => {};
  let hide: ReturnType<typeof setTimeout> | undefined;
  const showToast = (msg: string) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.replace("translate-y-5", "translate-y-0");
    toast.classList.replace("opacity-0", "opacity-100");
    clearTimeout(hide);
    hide = setTimeout(() => {
      toast.classList.replace("translate-y-0", "translate-y-5");
      toast.classList.replace("opacity-100", "opacity-0");
    }, 3200);
  };
  const onSubmit = (e: Event) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    const fields: Array<[string, boolean]> = [
      ["f-name", name.length > 1],
      ["f-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)],
      ["f-phone", /^\d{10}$/.test(phone)],
    ];
    fields.forEach(([id, ok]) => {
      const input = form.querySelector<HTMLElement>(`#${id}`);
      input?.setAttribute("aria-invalid", String(!ok));
      input?.classList.toggle("border-[#d93a1b]", !ok);
    });
    if (fields.some(([, ok]) => !ok)) {
      showToast("Please add your name, email and a 10-digit number");
      return;
    }
    form.reset();
    showToast("Thanks! A counsellor will call you shortly.");
  };
  form.addEventListener("submit", onSubmit);
  return () => {
    form.removeEventListener("submit", onSubmit);
    clearTimeout(hide);
  };
}

// Below 1440px the site has no separate small-screen layout: it scales the whole 1440px
// design to fit by setting `zoom` on <html> (page width without scrollbar ÷ 1440). Removed
// again on unmount so other routes aren't scaled after client-side navigation.
function setupFitToWidth() {
  const html = document.documentElement;
  const fit = () => {
    html.style.zoom = "";
    const w = html.clientWidth;
    if (w < 1440) html.style.zoom = String(Math.round((w / 1440) * 1e6) / 1e6);
  };
  fit();
  window.addEventListener("resize", fit);
  return () => {
    window.removeEventListener("resize", fit);
    html.style.zoom = "";
  };
}

export default function V3Behaviors() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".v3");
    if (!root) return;
    const cleanups: Array<() => void> = [setupFitToWidth()];
    const section = (sel: string) => root.querySelector<HTMLElement>(sel);

    cleanups.push(setupReveal(root), setupHeader(root), setupTicker(root), setupForm(root));

    const hero = section('section[aria-label="Welcome"]');
    // Hero banners: 1258px wide, 12px apart, active centred; advances every 5s.
    if (hero) cleanups.push(setupCoverflow(hero, (o) => ({ left: -629 + o * 1270, width: 1258 }), 5000));

    const why = section('[aria-labelledby="why-h"]');
    // Gallery: active panel 792px, others 588px, 12px apart.
    if (why)
      cleanups.push(
        setupCoverflow(
          why,
          (o) =>
            o === 0
              ? { left: -396, width: 792 }
              : o > 0
                ? { left: 408 + (o - 1) * 600, width: 588 }
                : { left: -996 + (o + 1) * 600, width: 588 },
          0,
        ),
      );

    const toppers = section("#toppers");
    if (toppers) cleanups.push(setupYearTabs(toppers));
    const educators = section('[aria-labelledby="fac-h"]');
    if (educators) cleanups.push(setupPager(educators));
    const stories = section('[aria-labelledby="st-h"]');
    if (stories) cleanups.push(setupPager(stories));
    const faq = section("#faq");
    if (faq) cleanups.push(setupFaq(faq));
    const loc = section("#location");
    if (loc) cleanups.push(setupLocations(loc));

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
