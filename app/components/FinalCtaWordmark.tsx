import PrimaryCta from "./PrimaryCta";
import WordmarkField from "./WordmarkField";

// Closing call to action (Figma "Section · CTA — Option B"), after tines.com's
// "Start today" section: a full-width living wordmark on warm paper, soft orange circles
// behind it, then the tagline and buttons.
export default function FinalCtaWordmark() {
  return (
    <section id="cta" className="relative z-10 overflow-hidden bg-[#fbf8f3] py-24 md:py-32">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 md:px-[72px]">
        <h2 className="relative w-full">
          <span className="sr-only">Start today</span>
          <span aria-hidden className="cta-orb absolute left-[10%] top-[-12%] -z-10 aspect-square w-[13%] rounded-full bg-[#e57512]/20" />
          <span aria-hidden className="cta-orb absolute left-[70%] top-[40%] -z-10 aspect-square w-[14%] rounded-full bg-[#e57512]/20 [animation-delay:-4s]" />
          <WordmarkField />
        </h2>

        <p className="mt-10 max-w-[30ch] text-center text-lg leading-7 text-balance text-[#1a1814]/80 md:text-xl md:leading-7">
          Admissions for 2027 are open. Talk to a counsellor or find the course that fits you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <PrimaryCta icon="phone">Talk to a counsellor</PrimaryCta>
          <a
            href="#"
            className="inline-flex h-12 items-center rounded-full bg-[#1a1814] px-5 font-display font-semibold text-white transition-[background-color,scale] duration-200 hover:bg-black active:scale-[0.98]"
          >
            Find your course
          </a>
        </div>
      </div>
    </section>
  );
}
