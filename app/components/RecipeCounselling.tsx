"use client";

import Btn from "./RecipeButton";
import { useEffect, useRef, useState } from "react";

// Counselling callback strip (storyline section 9: docs/STORYLINE_HOMEPAGE.md).
//   "I'd like to ask someone."  ->  the human fallback: name, mobile and a preferred time, nothing more to fill in.
// It owns the #enrol anchor, so every "Enrol for 2027" / "Talk to a counsellor" button on the page lands here.
//
// NOT CONNECTED YET: there is no backend in this project. Set NEXT_PUBLIC_CALLBACK_URL to an endpoint that accepts a JSON
// POST ({ name, phone, time, interest }) and the form sends there; until then nothing is sent and the form says so
// (SHOW_DEMO_NOTE). Do not remove the note before an endpoint is wired, or visitors would think a call was booked.
const ENDPOINT = process.env.NEXT_PUBLIC_CALLBACK_URL;
const SHOW_DEMO_NOTE = !ENDPOINT;

const TIMES = ["Morning · 9 AM – 12 PM", "Afternoon · 12 PM – 4 PM", "Evening · 4 PM – 7 PM"] as const;
const INTERESTS = ["Not sure yet", "Foundation", "Prelims", "Mains", "Interview"] as const;

type Errors = Partial<Record<"name" | "phone" | "time", string>>;
type Status = "idle" | "sending" | "sent" | "failed";

async function sendCallback(data: { name: string; phone: string; time: string; interest: string }) {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 500)); // demo: nothing leaves the browser
    return;
  }
  const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Callback request failed: ${res.status}`);
}

export default function RecipeCounselling() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState<string>("");
  const [interest, setInterest] = useState<string>(INTERESTS[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const doneRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  // Physics tear. Scroll only sets how hard the stub is being pulled (t, 0..1); the motion itself is a small simulation:
  //  - below RELEASE the stub is still attached: it strains a little (pulled to a few degrees) and shivers with scroll speed;
  //  - past RELEASE the perforation gives: the stub gets a kick of angular velocity, springs out to its torn pose, overshoots,
  //    flutters and settles (underdamped springs), while the slip recoils the other way;
  //  - scrolling back below REATTACH (hysteresis) pulls it home with the same springs, so it snaps shut.
  // Angle a (deg), offset x, y (px-ish, scaled in CSS per layout) and the slip's recoil m are written as CSS variables.
  // Skipped for prefers-reduced-motion: the slip stays whole.
  useEffect(() => {
    const el = slipRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const RELEASE = 0.45, REATTACH = 0.2, TORN = { a: 15, x: 26, y: 12 };
    const st = { a: 0, va: 0, x: 0, vx: 0, y: 0, vy: 0, m: 0, vm: 0, released: false, lastTop: el.getBoundingClientRect().top, kick: 0 };
    let raf = 0, last = 0;
    const pull = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (0.75 * vh - (r.top + r.height / 2)) / (0.4 * vh)));
    };
    const step = (now: number) => {
      const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
      last = now;
      const top = el.getBoundingClientRect().top;
      const scrollV = (top - st.lastTop) / Math.max(dt, 0.001); // px/s, negative when scrolling down
      st.lastTop = top;
      const t = pull();
      if (!st.released && t >= RELEASE) { st.released = true; st.va += 260; st.vx += 160; st.vy -= 40; st.vm -= 60; }
      else if (st.released && t <= REATTACH) { st.released = false; st.va -= 120; st.vm += 30; }
      const T = st.released ? TORN : { a: t * 5, x: t * 2, y: 0 };
      // spring-damper: acceleration = k (target - pos) - c vel; low damping on purpose so it overshoots and flutters
      const k = st.released ? 70 : 140, c = st.released ? 4.2 : 12;
      st.va += (k * (T.a - st.a) - c * st.va + (st.released ? 0 : Math.sin(now / 55) * Math.min(1, Math.abs(scrollV) / 1500) * 40 * t)) * dt;
      st.vx += (60 * (T.x - st.x) - 6 * st.vx) * dt;
      st.vy += (90 * (T.y - st.y) - 5 * st.vy + (st.released ? 40 : 0)) * dt; // a little gravity on the torn piece
      st.vm += (90 * (0 - st.m) - 9 * st.vm) * dt;
      st.a += st.va * dt; st.x += st.vx * dt; st.y += st.vy * dt; st.m += st.vm * dt;
      el.style.setProperty("--a", st.a.toFixed(2));
      el.style.setProperty("--x", st.x.toFixed(2));
      el.style.setProperty("--y", st.y.toFixed(2));
      el.style.setProperty("--m", st.m.toFixed(2));
      const rest = Math.abs(st.va) + Math.abs(st.vx) + Math.abs(st.vy) + Math.abs(st.vm) < 0.05 &&
        Math.abs(T.a - st.a) + Math.abs(T.x - st.x) + Math.abs(T.y - st.y) + Math.abs(st.m) < 0.05;
      if (rest) { raf = 0; last = 0; return; }
      raf = requestAnimationFrame(step);
    };
    const wake = () => { if (!raf) { last = 0; raf = requestAnimationFrame(step); } };
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(phone)) e.phone = "Enter a 10-digit Indian mobile number.";
    if (!time) e.time = "Choose a time that suits you.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      (e.name ? nameRef : e.phone ? phoneRef : null)?.current?.focus();
      return;
    }
    setStatus("sending");
    try {
      await sendCallback({ name: name.trim(), phone: `+91${phone}`, time, interest });
      setStatus("sent");
      setTimeout(() => doneRef.current?.focus(), 50);
    } catch {
      setStatus("failed");
    }
  };

  const sent = status === "sent";

  // Option B (user 2026-11-07 "show this section another option"): a centred, single-bar layout on saffron. The headline and
  // reassurance sit above one wide white bar (name, mobile, best time, button); the optional interest is a row of chips beneath it.
  // Option A (two columns: promise left, rust form card right) is kept in apps/my-app/backup/removed-sections.
  return (
    <section id="enrol" className="rs-cbb" aria-labelledby="cb-title">
      <div className="rs-cbb-wrap">
        <p data-pop="" className="rs-cbb-eyebrow">
          Free counselling · <span lang="hi" className="rs-hi normal-case">निःशुल्क परामर्श</span>
        </p>
        <h2 id="cb-title" data-pop="" className="rs-cbb-title">Talk to a counsellor</h2>
        <p data-pop="" className="rs-cbb-lead">
          Leave your number. A counsellor will call you back at the time you choose, map your stage, your optional and the mode that suits you, and help you pick the programme.
        </p>

        <div data-pop="" ref={slipRef} className="rs-cbb-panel rs-slip">
          <div className="rs-slip-main">
            <span className="rs-slip-grain" aria-hidden />
          {sent ? (
            <div role="status" className="rs-cbb-done">
              <span className="rs-cb-tick" aria-hidden>
                <svg viewBox="0 0 16 16" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
                  <path d="M2.5 8.5 6.5 12.5 13.5 4" />
                </svg>
              </span>
              <h3 ref={doneRef} tabIndex={-1} className="rs-cbb-done-title">Thank you, {name.trim().split(" ")[0]}</h3>
              <p>
                A counsellor will call +91 {phone} in the {time.split(" · ")[0].toLowerCase()} slot ({time.split(" · ")[1]}).
              </p>
              {SHOW_DEMO_NOTE && <p className="rs-cbb-demo">Demo: this form is not connected yet, so no call request was actually sent.</p>}
              <button type="button" className="rs-cb-link" onClick={() => setStatus("idle")}>Change my details</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-describedby={SHOW_DEMO_NOTE ? "cb-demo" : undefined}>
              <div className="rs-cbb-bar">
                <div className="rs-cbb-field">
                  <label htmlFor="cb-name">Your name</label>
                  <input ref={nameRef} id="cb-name" name="name" autoComplete="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "cb-name-err" : undefined} />
                </div>
                <div className="rs-cbb-field">
                  <label htmlFor="cb-phone">Mobile number</label>
                  <div className="rs-cbb-phone">
                    <span aria-hidden>+91</span>
                    <input ref={phoneRef} id="cb-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "cb-phone-err" : undefined} />
                  </div>
                </div>
                <div className="rs-cbb-field">
                  <label htmlFor="cb-time">Best time to call</label>
                  <select id="cb-time" name="time" value={time} onChange={(e) => setTime(e.target.value)} aria-invalid={!!errors.time}>
                    <option value="">Choose a slot</option>
                    {TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <Btn type="submit" variant="ink" disabled={status === "sending"} className="rs-cbb-go">{status === "sending" ? "Sending…" : "Request a call"}</Btn>
              </div>

              {(errors.name || errors.phone || errors.time) && (
                <div className="rs-cbb-errs" role="alert">
                  {errors.name && <p id="cb-name-err">{errors.name}</p>}
                  {errors.phone && <p id="cb-phone-err">{errors.phone}</p>}
                  {errors.time && <p>{errors.time}</p>}
                </div>
              )}

              <fieldset className="rs-cbb-interest">
                <legend>I am interested in <span>(optional)</span></legend>
                {INTERESTS.map((i) => (
                  <label key={i} className={`rs-cbb-chip ${interest === i ? "is-on" : ""}`}>
                    <input type="radio" name="interest" value={i} checked={interest === i} onChange={() => setInterest(i)} className="sr-only" />
                    {i}
                  </label>
                ))}
              </fieldset>

              {status === "failed" && <p role="alert" className="rs-cbb-fail">We could not send that. Please try again, or call 080-6220-6330.</p>}
              {SHOW_DEMO_NOTE && <p id="cb-demo" className="rs-cbb-demo">Demo: this form is not connected yet, so no call request is sent.</p>}
            </form>
          )}
          </div>

          {/* the tear-off stub: perforated edge, a FREE stamp and the facts a visitor wants before asking */}
          <aside className="rs-slip-stub" aria-label="About the call">
            <span className="rs-slip-grain" aria-hidden />
            <span className="rs-slip-stamp" aria-hidden>Free</span>
            <p className="rs-slip-kicker">Counselling slip</p>
            <ul className="rs-slip-facts">
              <li>About 15 minutes</li>
              <li>English and <span lang="hi">हिंदी</span></li>
              <li>New Delhi · Chennai · Online</li>
            </ul>
            <p className="rs-slip-call">
              Prefer to call?
              <a href="tel:+918062206330">080-6220-6330</a>
              <span>Mon – Sat, 9 AM – 7 PM</span>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
