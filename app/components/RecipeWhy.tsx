// Why choose Vajiram & Ravi (storyline section 3: docs/STORYLINE_HOMEPAGE.md), straight under the institute section.
//   Q2 "Why them and not another coaching?"  ->  six reasons, each a method, not an adjective.
// Layout after the "Our why" section the user shared (2026-11-07, Givingli): a cream page, a small spaced eyebrow, a very large
// centred headline, a short centred lead, then a row of plain columns, each a title, a short rule and two or three lines of text.
// The reference has four columns; we have six reasons, so they sit 3 x 2 (and 2 / 1 on smaller screens).
// Reasons are the six on the current homepage (apps/Vajiram-ravi data/home.ts). No illustrations or photos here on purpose;
// the earlier card version and the campus photo row were removed on request (2026-11-07).

const reasons: { title: string; text: string }[] = [
  { title: "Proven record", text: "Five decades of experience and a steady record of producing UPSC toppers." },
  { title: "Expert faculty", text: "Learn from subject specialists for every GS paper, optional and the essay." },
  { title: "Personal guidance", text: "A preparation plan shaped around your strengths and weak areas." },
  { title: "Complete material", text: "Detailed notes, test series and interview prep for every stage of the exam." },
  { title: "Prime location", text: "Study at our campus in Old Rajinder Nagar, the heart of UPSC preparation in Delhi." },
  { title: "Classroom or online", text: "Choose classroom or LIVE-online for any course, and learn from anywhere." },
];

export default function RecipeWhy() {
  return (
    <section id="why" className="rs-why" aria-labelledby="why-title">
      <div className="rs-why-wrap">
        <p data-pop="" className="rs-why-eyebrow">Our why</p>
        <h2 id="why-title" data-pop="" className="rs-why-title">
          Six reasons,
          <br />
          each one a method.
        </h2>
        <p data-pop="" className="rs-why-lead">
          Ranks are the result. Every part of the programme, from the faculty to the schedule to the study material, exists to get you there.
        </p>

        <ol className="rs-why-grid">
          {reasons.map((r) => (
            <li key={r.title} data-pop="" className="rs-why-item">
              <h3 className="rs-why-name">{r.title}</h3>
              <span className="rs-why-rule" aria-hidden />
              <p className="rs-why-text">{r.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
