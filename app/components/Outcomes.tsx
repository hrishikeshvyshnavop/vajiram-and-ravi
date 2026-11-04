import CoverImage from "./CoverImage";
import BrailleSpinner from "./BrailleSpinner";

// "Real results. Real ranks.": a 2×2 bento of photo cards with a headline figure, after
// primefold's Outcomes section. Every figure comes from the current V&R site (or is counted
// directly from its topper list), so nothing here is invented.

type Outcome = {
  metric: string;
  statement: string;
  source: string;
  detail: string;
  image: string;
  brightness?: number;
  wide: boolean;
};

const outcomes: Outcome[] = [
  {
    metric: "59",
    statement: "Questions in UPSC Prelims 2025 reflected from our Prelims Test Series.",
    source: "V&R Prelims Test Series",
    detail: "UPSC Prelims 2025",
    image: "/hero/prelims.jpg",
    brightness: 0.75,
    wide: false,
  },
  {
    metric: "Top 10",
    statement: "Ranks 1 to 10 in UPSC CSE 2025 all prepared with Vajiram & Ravi.",
    source: "Civil Services Examination 2025",
    detail: "Each took at least one V&R programme",
    image: "/hero/classroom.jpg",
    wide: true,
  },
  {
    metric: "5 decades",
    statement: "Of taking aspirants from their first class to the interview.",
    source: "Vajiram & Ravi",
    detail: "Classroom, test series and interview guidance",
    image: "/hero/mains.jpg",
    brightness: 0.6,
    wide: true,
  },
  {
    metric: "9 of 10",
    statement: "Of the CSE 2025 top 10 took our Interview Guidance Programme.",
    source: "Interview Guidance Programme",
    detail: "CSE 2025 toppers",
    image: "/hero/classroom-empty.jpg",
    brightness: 0.7,
    wide: false,
  },
];

export default function Outcomes() {
  return (
    <section className="cv-auto relative z-10 bg-white pb-24 text-[#212121] md:pb-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-[72px]">
        <p className="flex items-center gap-1.5 text-sm font-medium text-[#616161]">
          <BrailleSpinner /> Results
        </p>
        <h2 className="font-headline mt-3 text-[34px] leading-[1.15] tracking-[0.02em] md:text-5xl md:leading-[56px]">
          Real results.
          <br />
          Real ranks.
        </h2>
        <p className="mt-4 max-w-[420px] text-sm leading-5 text-[#545454]">
          What aspirants achieved after preparing with us.
        </p>

        {/* Two rows: narrow + wide, then wide + narrow. */}
        <div className="mt-12 flex flex-col gap-4">
          {[outcomes.slice(0, 2), outcomes.slice(2)].map((row, r) => (
            <div key={r} className={`grid gap-4 ${r === 0 ? "lg:grid-cols-[500fr_764fr]" : "lg:grid-cols-[764fr_500fr]"}`}>
              {row.map((o) => (
                <a
                  key={o.metric}
                  href="#"
                  className="group relative isolate flex h-[440px] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white md:h-[492px] md:p-10"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  >
                    <CoverImage
                      src={o.image}
                      sizes={o.wide ? "(min-width: 1024px) 764px, 100vw" : "(min-width: 1024px) 500px, 100vw"}
                      brightness={o.brightness}
                    />
                  </div>
                  <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/25 to-black/70" />

                  <p className="font-headline text-[56px] leading-none tracking-[0.01em] md:text-[72px]">{o.metric}</p>

                  <div className={o.wide ? "max-w-[454px]" : "max-w-[420px]"}>
                    <h3 className="font-headline text-2xl leading-8 tracking-[0.01em] md:text-[32px] md:leading-10">
                      {o.statement}
                    </h3>
                    <p className="mt-8 font-medium leading-6">{o.source}</p>
                    <p className="text-sm leading-5 text-white/85">{o.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
