// How we get you there (new section, user request 2026-11-07), straight under "Our why".
//   Why says "six reasons, each a method"; How answers "so what does the preparation actually look like?" as four steps.
// No reference layout was given, so it follows the Why section's type (Hanken Grotesk medium, tight) on the rust ground used
// elsewhere on the page: a left-aligned eyebrow and headline, then four numbered steps joined by a dashed line.
// Copy is drafted from programmes already on the current homepage (GS foundation, Prelims and Mains test series, mentorship,
// Interview Guidance Programme). It states no numbers or outcomes; the client should confirm the order and wording.

const steps = [
  { n: "01", title: "Learn", text: "General Studies foundation in the classroom or LIVE online, with the study material and notes for every paper.", tag: "GS foundation" },
  { n: "02", title: "Practise", text: "Topic-wise and full-length tests for Prelims and Mains, with detailed explanations after each one.", tag: "Test series" },
  { n: "03", title: "Get feedback", text: "A plan shaped around your strengths and weak areas, and a mentor who reviews how you are doing.", tag: "Mentorship" },
  { n: "04", title: "Face the board", text: "Mock interviews that feel like the real Personality Test, with honest, specific feedback after every round.", tag: "Interview guidance" },
];

export default function RecipeHow() {
  return (
    <section id="how" className="rs-how" aria-labelledby="how-title">
      <div className="rs-how-wrap">
        <p data-pop="" className="rs-how-eyebrow">Our how</p>
        <h2 id="how-title" data-pop="" className="rs-how-title">
          Four steps from
          <br />
          first class to final interview.
        </h2>

        <ol className="rs-how-steps">
          {steps.map((s) => (
            <li key={s.n} data-pop="" className="rs-how-step">
              <span className="rs-how-num">{s.n}</span>
              <h3 className="rs-how-name">{s.title}</h3>
              <p className="rs-how-text">{s.text}</p>
              <span className="rs-how-tag">{s.tag}</span>
            </li>
          ))}
        </ol>

        <p className="rs-how-cta">
          Not sure where you fit?{" "}
          <a href="#enrol" className="rs-bt-ask">Ask a counsellor</a>
        </p>
      </div>
    </section>
  );
}
