"use client";

import { useEffect, useState } from "react";

// English / हिंदी switcher for the header (user request 2026-11-09). Scope chosen by the user: "switcher only", so this sets the language
// and nothing is translated that was not already in Hindi on the page.
//   - The choice is stored in localStorage ("rs-lang") and written to <html data-lang="en|hi">; a custom event keeps the desktop and the
//     phone copies of the switch in step. html[lang] is left as "en" on purpose: most of the page is still English.
//   - CSS (recipe-story.css, "language switch" block) does the swapping: `.l-en` is hidden in Hindi, `.l-hi` is hidden in English.
//     Today that means: the section eyebrows show only their Hindi half in Hindi, and the hero swaps its English sub-lines for the Hindi line.
//   - To make a block switch, put .l-en on its English version and .l-hi on its Hindi version.

type Lang = "en" | "hi";
const KEY = "rs-lang";
const EVENT = "rs-lang-change";

const read = (): Lang => {
  try {
    return localStorage.getItem(KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
};

export default function LangSwitch({ className = "" }: { className?: string }) {
  const [lang, setLang] = useState<Lang>("en");

  // pick up the stored choice after mount (the server always renders English) and follow the other copy of the switch
  useEffect(() => {
    const apply = (l: Lang) => {
      setLang(l);
      document.documentElement.dataset.lang = l;
    };
    apply(read());
    const onChange = (e: Event) => apply((e as CustomEvent<Lang>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const choose = (l: Lang) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* private mode: the choice just lasts for this visit */
    }
    window.dispatchEvent(new CustomEvent<Lang>(EVENT, { detail: l }));
  };

  return (
    <div role="group" aria-label="Language" className={`rs-lang ${className}`.trim()}>
      <button type="button" aria-pressed={lang === "en"} onClick={() => choose("en")} className={lang === "en" ? "is-on" : ""}>
        <span aria-hidden>EN</span>
        <span className="sr-only">English</span>
      </button>
      <button type="button" aria-pressed={lang === "hi"} onClick={() => choose("hi")} className={lang === "hi" ? "is-on" : ""} lang="hi">
        <span aria-hidden>हिं</span>
        <span className="sr-only">हिंदी (Hindi)</span>
      </button>
    </div>
  );
}
