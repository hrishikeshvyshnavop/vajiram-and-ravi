import Image from "next/image";

// "Hear from students" (storyline section 10, success stories). Restored from the original homepage design (apps/Vajiram-ravi SuccessStories: "Hear it
// from our students" + "Honest words from students who prepared with us, in the classroom and LIVE-Online"): quote cards that each show the student's
// photo with a rank badge and the exam, the quote, the name and the programme. User 2026-11-09: "hear from students is missing in v5 design", and, when asked,
// "replace the slider". It replaces the single-quote slider ("In their own words", after a testimonial slider the user shared on 2026-11-07), which is in
// apps/my-app/backup/removed-sections/RecipeStories.slider.tsx.bak.
// Rule from the storyline: ONLY verified students. The two quotes below are the ones on the current homepage (apps/Vajiram-ravi data/toppers.ts); add more
// only when the client confirms the student and the wording. (The live site's own testimonial list is empty and its video strip is mentor sessions, not students.)

const stories = [
  {
    name: "Anuj Agnihotri",
    air: 1,
    img: "anuj-agnihotri",
    exam: "CSE 2025",
    took: "Interview Guidance Programme",
    quote: "The mock interviews felt closer to the real board than anything else I tried. The feedback after each round was honest and specific.",
  },
  {
    name: "Rajeshwari Suve M",
    air: 2,
    img: "rajeshwari-suve-m",
    exam: "CSE 2025",
    took: "PowerUp Prelims Test Series, IGP and Mains Test Series",
    quote: "The test series showed me exactly where I was losing marks. By the last few papers I was finishing on time and still checking my answers.",
  },
];

export default function RecipeStories() {
  return (
    <section id="stories" className="rs-tq rs-hs" aria-labelledby="hs-title">
      <div className="relative mx-auto max-w-[var(--rs-max)] px-7">
        <p data-pop="" className="rs-hs-eyebrow">
          <span className="l-en">Success stories · </span><span lang="hi" className="rs-hi normal-case">सफलता की कहानियाँ</span>
        </p>
        <h2 id="hs-title" data-pop="">Hear from students</h2>
        <p data-pop="" className="rs-hs-lead">Honest words from students who prepared with us, in the classroom and LIVE online.</p>

        <ul className="rs-hs-grid">
          {stories.map((s) => (
            <li key={s.name} data-pop="">
              <figure className="rs-hs-card">
                <div className="rs-hs-photo">
                  <Image src={`/v3/images/toppers-bw/${s.img}.webp`} alt={`${s.name}, AIR ${s.air} in ${s.exam}`} fill sizes="(min-width: 1024px) 220px, 40vw" className="object-cover object-top" />
                  <span className="rs-hs-badge">AIR {s.air}</span>
                  <span className="rs-hs-exam">{s.exam}</span>
                </div>
                <div className="rs-hs-body">
                  <svg viewBox="0 0 32 24" className="rs-hs-quote-mark" aria-hidden>
                    <path d="M0 24V14C0 6 4 1 12 0l1 3C8 4.500 6.500 7 6.500 10H12v14H0Zm18 0V14c0-8 4-13 12-14l1 3c-5 1.500-6.500 4-6.500 7H30v14H18Z" fill="currentColor" />
                  </svg>
                  <blockquote>{s.quote}</blockquote>
                  <figcaption>
                    <b>{s.name}</b>
                    <span>{s.took}</span>
                  </figcaption>
                </div>
              </figure>
            </li>
          ))}
        </ul>

        <p className="rs-hs-ask">
          Want to hear it from someone who has been through it? <a href="#enrol" className="rs-bt-ask">Ask a counsellor</a>
        </p>
      </div>
    </section>
  );
}
