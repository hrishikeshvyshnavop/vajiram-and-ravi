"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";

// The /v5 enrol section as a chat with a V&R counsellor (user choice 2026-11-06, replacing the
// "Get your recipe" callback form). Same lead data and the same rules as the old form: name and a
// 10-digit Indian mobile are required, email is optional, centre and programme are required, medium
// and target year are optional, and consent is required. The counsellor asks one thing at a time;
// you answer by typing or with quick-reply chips. Any answer can be edited, which rewinds the chat.
// TODO: send `lead` to the client's CRM / lead API. Until an endpoint exists, finishing the chat
// only shows the summary; nothing leaves the browser.

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

const empty: Lead = { name: "", mobile: "", email: "", centre: "", programme: "", medium: "", year: "", consent: false };

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

const first = (name: string) => name.trim().split(/\s+/)[0] || "";
const digits = (m: string) => m.replace(/\D/g, "").slice(-10);

type Step = {
  key: keyof Lead;
  ask: (l: Lead) => string;
  kind: "text" | "tel" | "email" | "chips" | "consent";
  options?: string[];
  optional?: boolean;
  placeholder?: string;
  check?: (v: string) => string | null;
  show: (l: Lead) => string; // how the answer reads in your bubble
};

const steps: Step[] = [
  {
    key: "name",
    ask: () => "Namaste! I'm a counsellor at Vajiram & Ravi. What's your name?",
    kind: "text",
    placeholder: "Your full name",
    check: (v) => (v.trim().length < 2 ? "Could you tell me your full name?" : null),
    show: (l) => l.name.trim(),
  },
  {
    key: "mobile",
    ask: (l) => `Nice to meet you, ${first(l.name)}. Which mobile number should I call you on?`,
    kind: "tel",
    placeholder: "98765 43210",
    check: (v) => (/^[6-9]\d{9}$/.test(digits(v)) && v.replace(/\D/g, "").length >= 10 ? null : "That doesn't look like a 10-digit Indian mobile number. Could you check it?"),
    show: (l) => `+91 ${digits(l.mobile)}`,
  },
  {
    key: "email",
    ask: () => "Would you like the programme details on email too? You can skip this.",
    kind: "email",
    optional: true,
    placeholder: "you@example.com",
    check: (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Hmm, that email address doesn't look right." : null),
    show: (l) => l.email || "Skip",
  },
  { key: "centre", ask: () => "Where would you like to study?", kind: "chips", options: centres, show: (l) => l.centre },
  { key: "programme", ask: () => "Which programme are you looking at? 'Not sure yet' is fine too; that's what the call is for.", kind: "chips", options: programmes, show: (l) => l.programme },
  { key: "medium", ask: () => "English or Hindi medium?", kind: "chips", options: mediums, optional: true, show: (l) => l.medium || "Skip" },
  { key: "year", ask: () => "And which attempt are you aiming for?", kind: "chips", options: years, optional: true, show: (l) => l.year || "Skip" },
  {
    key: "consent",
    ask: () => "Last thing: may we contact you by call, SMS or WhatsApp about programmes and admissions?",
    kind: "consent",
    show: (l) => (l.consent ? "Yes, that's fine" : "No"),
  },
];

export default function RecipeCounsellorChat() {
  const id = useId();
  const [lead, setLead] = useState<Lead>(empty);
  const [step, setStep] = useState(0); // the question being asked; steps.length = done
  const [shown, setShown] = useState(-1); // the last question whose "typing" has finished
  const typing = shown !== step;
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const interacted = useRef(false);
  const done = step >= steps.length;
  const current = steps[step];

  // the counsellor "types" for a moment before each question: a question is shown once `shown`
  // catches up with `step`, so typing is derived rather than set inside the effect
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShown(step), reduce ? 0 : 650);
    return () => clearTimeout(t);
  }, [step]);

  // keep the newest message in view (inside the chat only, never the page)
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [step, typing, error, declined]);

  // focus the composer for typed answers, but only after the visitor has started chatting
  useEffect(() => {
    if (!typing && interacted.current && current && current.kind !== "chips" && current.kind !== "consent") inputRef.current?.focus();
  }, [typing, current]);

  const answer = (v: string) => {
    interacted.current = true;
    const s = steps[step];
    const msg = s.check?.(v) ?? null;
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    setLead((l) => ({ ...l, [s.key]: s.key === "mobile" ? digits(v) : v.trim() }));
    setDraft("");
    setStep((n) => n + 1);
  };

  const consent = (yes: boolean) => {
    interacted.current = true;
    if (!yes) {
      setDeclined(true);
      return;
    }
    setDeclined(false);
    setLead((l) => ({ ...l, consent: true }));
    // TODO: POST the lead to the lead endpoint here.
    setStep(steps.length);
  };

  const editAt = (i: number) => {
    interacted.current = true;
    setError(null);
    setDeclined(false);
    const k = steps[i].key;
    setDraft(k === "name" || k === "mobile" || k === "email" ? String(lead[k] ?? "") : "");
    setStep(i);
  };

  const restart = () => {
    setLead(empty);
    setDraft("");
    setError(null);
    setDeclined(false);
    setStep(0);
  };

  const textStep = current && (current.kind === "text" || current.kind === "tel" || current.kind === "email");

  return (
    <div className="rs-chat">
      {/* header */}
      <div className="rs-chat-head">
        <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--rs-saffron)]">
          <Image src="/v3/images/counsellor.webp" alt="" fill sizes="44px" className="object-cover object-top" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">V&amp;R Counsellor</p>
          <p className="flex items-center gap-1.5 text-[12px] opacity-80">
            <span className="size-2 rounded-full bg-[#4ade80]" aria-hidden /> {typing && !done ? "typing…" : "online · replies in English & हिंदी"}
          </p>
        </div>
        <span className="rs-small hidden text-[10px] opacity-70 sm:inline">Free · no obligation</span>
      </div>

      {/* messages */}
      <div ref={logRef} className="rs-chat-log" role="log" aria-live="polite" aria-label="Chat with a Vajiram & Ravi counsellor">
        <p className="rs-chat-day">Today</p>
        {steps.slice(0, Math.min(step + 1, steps.length)).map((s, i) => {
          const answered = i < step;
          const isCurrent = i === step && !done;
          if (isCurrent && typing) return <Typing key={s.key} />;
          return (
            <div key={s.key} className="flex flex-col gap-2">
              <Bubble from="them">{s.ask(lead)}</Bubble>
              {/* quick replies under the current question */}
              {isCurrent && s.kind === "chips" && (
                <div className="rs-chat-chips" role="group" aria-label={s.ask(lead)}>
                  {s.options!.map((o) => (
                    <button key={o} type="button" className="rs-chat-chip" onClick={() => answer(o)}>
                      {o}
                    </button>
                  ))}
                  {s.optional && (
                    <button type="button" className="rs-chat-chip rs-chat-chip--ghost" onClick={() => answer("")}>
                      Skip
                    </button>
                  )}
                </div>
              )}
              {isCurrent && s.kind === "consent" && (
                <>
                  {declined && (
                    <Bubble from="them">No problem. We can only call back with your OK, so you&apos;re welcome to call us instead on 080-6220-6330 (Mon to Sat, 9 AM to 7 PM).</Bubble>
                  )}
                  <div className="rs-chat-chips" role="group" aria-label="Consent to be contacted">
                    <button type="button" className="rs-chat-chip" onClick={() => consent(true)}>
                      Yes, that&apos;s fine
                    </button>
                    {!declined && (
                      <button type="button" className="rs-chat-chip rs-chat-chip--ghost" onClick={() => consent(false)}>
                        No
                      </button>
                    )}
                  </div>
                </>
              )}
              {isCurrent && error && <Bubble from="them" tone="error">{error}</Bubble>}
              {answered && (
                <Bubble from="me" onEdit={() => editAt(i)} editLabel={`Change your answer: ${s.show(lead)}`}>
                  {s.show(lead)}
                </Bubble>
              )}
            </div>
          );
        })}

        {done && (
          <div className="flex flex-col gap-2">
            <Bubble from="them">
              Thank you, {first(lead.name)}! Here&apos;s what I&apos;ve noted. A Vajiram &amp; Ravi counsellor will call you on <b>+91 {digits(lead.mobile)}</b> to help you pick the right programme.
            </Bubble>
            <div className="rs-chat-summary">
              {[
                ["Programme", lead.programme],
                ["Study", lead.centre],
                ["Medium", lead.medium || "Not chosen"],
                ["Target", lead.year || "Not chosen"],
                ["Email", lead.email || "Not given"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-t border-[var(--rs-deep)]/15 py-1.5 first:border-t-0">
                  <span className="opacity-60">{k}</span>
                  <span className="text-right font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="rs-chat-chips">
              <button type="button" className="rs-chat-chip rs-chat-chip--ghost" onClick={restart}>
                Start over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* composer */}
      <form
        className="rs-chat-compose"
        onSubmit={(e) => {
          e.preventDefault();
          if (textStep && !typing) answer(draft);
        }}
      >
        <label htmlFor={`${id}-msg`} className="sr-only">
          {textStep ? current.ask(lead) : "Message"}
        </label>
        {current?.kind === "tel" && <span className="pl-4 text-[15px] font-semibold opacity-60">+91</span>}
        <input
          ref={inputRef}
          id={`${id}-msg`}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          disabled={!textStep || typing}
          type={current?.kind === "email" ? "email" : current?.kind === "tel" ? "tel" : "text"}
          inputMode={current?.kind === "tel" ? "numeric" : undefined}
          autoComplete={current?.kind === "tel" ? "tel-national" : current?.kind === "email" ? "email" : current?.kind === "text" ? "name" : "off"}
          maxLength={current?.kind === "tel" ? 14 : 80}
          placeholder={done ? "Chat complete" : textStep ? current.placeholder : "Choose an option above"}
          className="min-w-0 flex-1 bg-transparent px-4 text-[16px] outline-none placeholder:text-[var(--rs-deep)]/40 disabled:cursor-not-allowed"
        />
        {textStep && current.optional && !typing && (
          <button type="button" className="rs-small px-3 text-[11px] opacity-70 hover:opacity-100" onClick={() => answer("")}>
            Skip
          </button>
        )}
        <button type="submit" disabled={!textStep || typing} className="rs-chat-send" aria-label="Send">
          ➤
        </button>
      </form>
    </div>
  );
}

function Bubble({ from, children, tone, onEdit, editLabel }: { from: "them" | "me"; children: React.ReactNode; tone?: "error"; onEdit?: () => void; editLabel?: string }) {
  return (
    <div className={`flex ${from === "me" ? "justify-end" : "justify-start"}`}>
      <div className={`rs-chat-bubble ${from === "me" ? "rs-chat-bubble--me" : ""} ${tone === "error" ? "rs-chat-bubble--error" : ""}`}>
        {children}
        {onEdit && (
          <button type="button" className="rs-chat-edit" onClick={onEdit} aria-label={editLabel}>
            Change
          </button>
        )}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-start" aria-label="Counsellor is typing">
      <div className="rs-chat-bubble rs-chat-typing">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
