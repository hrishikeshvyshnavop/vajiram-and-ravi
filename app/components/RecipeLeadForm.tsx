"use client";

import { useId, useRef, useState } from "react";

// Lead form for /v5 ("Get your recipe"), styled like the programme facts label.
// Collects what a counsellor needs for the first call: name, mobile, email, where and what the
// aspirant wants to study, medium, target year and consent to be contacted.
// TODO: send `lead` to the client's CRM / lead API. Until an endpoint exists, submitting only
// validates and shows the thank-you state; nothing leaves the browser.

export type Lead = {
  name: string;
  mobile: string;
  email: string;
  centre: string;
  programme: string;
  medium: string;
  year: string;
  consent: boolean;
};

const centres = ["New Delhi", "Chennai", "Online"];
const mediums = ["English", "Hindi"];
const years = ["2027", "2028"];
const programmes = [
  "GS Prelims cum Mains 2027",
  "2-Year PCM Fledgling Programme 2028",
  "Prelims Test Series",
  "Mains Test Series",
  "Optional subject",
  "Interview Guidance Programme",
  "Mentorship",
  "Not sure yet",
];

const empty: Lead = { name: "", mobile: "", email: "", centre: "", programme: "", medium: "", year: "", consent: false };

function validate(l: Lead) {
  const e: Partial<Record<keyof Lead, string>> = {};
  if (l.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[6-9]\d{9}$/.test(l.mobile.replace(/\D/g, "").slice(-10)) || l.mobile.replace(/\D/g, "").length < 10) e.mobile = "Enter a 10-digit Indian mobile number.";
  if (l.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.email)) e.email = "Check the email address.";
  if (!l.centre) e.centre = "Pick where you want to study.";
  if (!l.programme) e.programme = "Pick a programme, or 'Not sure yet'.";
  if (!l.consent) e.consent = "We need your OK to call you back.";
  return e;
}

function Chips({ name, options, value, onChange, error }: { name: string; options: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-invalid={!!error || undefined}>
      {options.map((o) => {
        const on = value === o;
        return (
          <label
            key={o}
            className={`rs-display inline-flex h-10 cursor-pointer items-center rounded-full border-2 px-4 text-[13px] tracking-normal transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--rs-orange)] ${
              on ? "border-[var(--rs-deep)] bg-[var(--rs-deep)] text-[var(--rs-saffron)]" : "border-[var(--rs-deep)]/30 hover:border-[var(--rs-deep)]"
            }`}
          >
            <input type="radio" name={name} value={o} checked={on} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        );
      })}
    </div>
  );
}

function Err({ id, k, msg }: { id: string; k: keyof Lead; msg?: string }) {
  return msg ? (
    <p id={`${id}-${k}-err`} className="mt-1.5 pl-2 text-[13px] font-semibold text-[var(--rs-orange)]">
      {msg}
    </p>
  ) : null;
}

function Lbl({ htmlFor, children, opt }: { htmlFor?: string; children: React.ReactNode; opt?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="rs-small mb-2 block text-[12px]">
      {children}
      {opt && <span className="ml-1.5 opacity-50">optional</span>}
    </label>
  );
}

const fieldCls =
  "h-12 w-full rounded-full border-2 border-[var(--rs-deep)]/30 bg-white/70 px-5 text-[16px] text-[var(--rs-deep)] outline-none transition-colors placeholder:text-[var(--rs-deep)]/40 focus:border-[var(--rs-deep)] aria-[invalid=true]:border-[var(--rs-orange)]";

export default function RecipeLeadForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [lead, setLead] = useState<Lead>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const [sent, setSent] = useState<Lead | null>(null);
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => {
    setLead((l) => ({ ...l, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(lead);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] select`)?.focus();
      return;
    }
    // TODO: POST `lead` to the lead endpoint here.
    setSent(lead);
  };

  if (sent) {
    return (
      <div className="rs-label rounded-xl p-8 text-[var(--rs-deep)] md:p-10" role="status">
        <p className="rs-small">Order received</p>
        <p className="rs-display mt-4 text-[clamp(48px,6vw,88px)] leading-[0.86]">Got it, {sent.name.trim().split(" ")[0]}!</p>
        <div className="mt-6 border-t-8 border-[var(--rs-deep)]">
          {[
            ["Programme", sent.programme],
            ["Study", sent.centre],
            ["Medium", sent.medium || "Not chosen"],
            ["Target", sent.year || "Not chosen"],
            ["We'll call", `+91 ${sent.mobile.replace(/\D/g, "").slice(-10)}`],
          ].map(([k, v]) => (
            <div key={k} className="rs-label-row">
              <span>{k}</span>
              <span className="rs-display text-right text-[15px] tracking-normal">{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-lg leading-snug">A Vajiram &amp; Ravi counsellor will get in touch to help you pick the right programme.</p>
        <button
          type="button"
          className="rs-pill mt-8 !bg-[var(--rs-deep)] !text-[var(--rs-saffron)]"
          onClick={() => {
            setSent(null);
            setLead(empty);
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="rs-label rounded-xl p-7 text-[var(--rs-deep)] md:p-9" aria-label="Request a callback">
      <div className="flex items-baseline justify-between gap-4">
        <p className="rs-display text-[40px] leading-none">Callback order</p>
        <p className="rs-small text-[11px] opacity-60">Free · no obligation</p>
      </div>
      <div className="mt-4 border-t-8 border-[var(--rs-deep)]" />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div data-field="name" className="sm:col-span-2">
          <Lbl htmlFor={`${id}-name`}>Full name</Lbl>
          <input id={`${id}-name`} className={fieldCls} autoComplete="name" value={lead.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? `${id}-name-err` : undefined} placeholder="Your name" />
          <Err id={id} k="name" msg={errors.name} />
        </div>
        <div data-field="mobile">
          <Lbl htmlFor={`${id}-mobile`}>Mobile</Lbl>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-[16px] font-semibold opacity-60">+91</span>
            <input id={`${id}-mobile`} className={`${fieldCls} !pl-14`} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} value={lead.mobile} onChange={(e) => set("mobile", e.target.value)} aria-invalid={!!errors.mobile || undefined} aria-describedby={errors.mobile ? `${id}-mobile-err` : undefined} placeholder="98765 43210" />
          </div>
          <Err id={id} k="mobile" msg={errors.mobile} />
        </div>
        <div data-field="email">
          <Lbl htmlFor={`${id}-email`} opt>
            Email
          </Lbl>
          <input id={`${id}-email`} className={fieldCls} type="email" autoComplete="email" value={lead.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? `${id}-email-err` : undefined} placeholder="you@example.com" />
          <Err id={id} k="email" msg={errors.email} />
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--rs-deep)]/35 pt-5" data-field="centre">
        <Lbl>Where do you want to study?</Lbl>
        <Chips name={`${id}-centre`} options={centres} value={lead.centre} onChange={(v) => set("centre", v)} error={errors.centre} />
        <Err id={id} k="centre" msg={errors.centre} />
      </div>

      <div className="mt-5" data-field="programme">
        <Lbl htmlFor={`${id}-programme`}>Programme</Lbl>
        <div className="relative">
          <select id={`${id}-programme`} className={`${fieldCls} appearance-none pr-12`} value={lead.programme} onChange={(e) => set("programme", e.target.value)} aria-invalid={!!errors.programme || undefined} aria-describedby={errors.programme ? `${id}-programme-err` : undefined}>
            <option value="" disabled>
              Choose one
            </option>
            {programmes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2" aria-hidden>
            ▾
          </span>
        </div>
        <Err id={id} k="programme" msg={errors.programme} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div data-field="medium">
          <Lbl opt>Medium</Lbl>
          <Chips name={`${id}-medium`} options={mediums} value={lead.medium} onChange={(v) => set("medium", v)} />
        </div>
        <div data-field="year">
          <Lbl opt>Target attempt</Lbl>
          <Chips name={`${id}-year`} options={years} value={lead.year} onChange={(v) => set("year", v)} />
        </div>
      </div>

      <div className="mt-6 border-t-4 border-[var(--rs-deep)] pt-5" data-field="consent">
        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug">
          <input type="checkbox" checked={lead.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--rs-deep)]" aria-invalid={!!errors.consent || undefined} aria-describedby={errors.consent ? `${id}-consent-err` : undefined} />
          I agree to be contacted by Vajiram &amp; Ravi by call, SMS or WhatsApp about programmes and admissions.
        </label>
        <Err id={id} k="consent" msg={errors.consent} />
      </div>

      <button type="submit" className="rs-pill mt-7 !h-14 w-full justify-center !bg-[var(--rs-deep)] !text-[16px] !text-[var(--rs-saffron)]">
        Request a callback →
      </button>
    </form>
  );
}
