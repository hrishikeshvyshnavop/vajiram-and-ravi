import PatternField from "./PatternField";

// "About" intro, after the AI in Design 2026 report: a full-bleed pattern band (Indian buti and
// kolam motifs instead of their pixel cross-stitch), then a mono label on the left and a large
// statement with a short follow-up on the right.
export default function PatternIntro() {
  return (
    <section id="about" className="relative bg-white">
      <PatternField className="h-[200px] md:h-[300px]" />

      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 pb-24 pt-8 md:grid-cols-12 md:px-[72px] md:pb-32 md:pt-10">
        <div className="flex flex-col justify-between md:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#1a1814]">About Vajiram &amp; Ravi</p>
          <p aria-hidden className="mt-auto hidden font-mono text-xs uppercase tracking-[0.08em] text-[#1a1814]/60 md:block">
            (Scroll)
          </p>
        </div>

        <div className="md:col-span-7">
          <h2 className="font-headline text-[32px]/[1.1] tracking-[-0.02em] text-balance text-[#1a1814] md:text-[48px]/[1.08]">
            Since 1976, Vajiram &amp; Ravi has prepared aspirants for every stage of the UPSC Civil Services
            Examination: Prelims, Mains and the interview.
          </h2>
          <p className="mt-12 max-w-[34ch] text-lg leading-7 text-[#1a1814]/80 md:mt-20">
            Five decades on, the method is the same: a structured syllabus, regular tests and{" "}
            <a href="#" className="underline decoration-[#e57512] decoration-2 underline-offset-4 hover:text-[#e57512]">
              mentors who know the exam
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
