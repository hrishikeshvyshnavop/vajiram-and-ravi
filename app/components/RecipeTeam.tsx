import Image from "next/image";
import Btn from "./RecipeButton";
import SectionMotif from "./SectionMotifs";
import type { Specialist } from "./RecipeFacultyTeam";

// Faculty / team section, layout 5 (user 2026-11-09: "need another idea for the Faculty section"). An arcade: the six specialists stand side by side in
// arch-topped frames (the same arch as the mehrab, the milestone and the earlier stage card), each on a numbered plinth, with the name, subject and level
// beneath. The arches sit at slightly different heights, so the row has a skyline; on hover or keyboard focus an arch lifts and fills with saffron.
// Built from the site's own vocabulary only (cream paper, faint block-print motif, grain, Hanken headline, rust, saffron, pill chips, the square Btn).
// Earlier versions are in backup/removed-sections: the pinned monument.tv team (RecipeFacultyTeam.pinned.*), Courses-style cards (RecipeTeam.coursesStyle.*),
// the blackboard (RecipeTeam.blackboard.*) and the featured card with a ruled list (RecipeTeam.layout4-stage-list.*).
// Keeps id="faculty" and an opaque ground: RecipeStory's scroll logic (held hero, toppers backdrop) is anchored on #faculty.
// Only facts already on the page: names, subjects and levels from the specialists list, and "the same faculty in the classroom and LIVE online" from the
// domain overview. No bios or credentials are invented.

export default function RecipeTeam({ specialists }: { specialists: readonly Specialist[] }) {
  const pad = (k: number) => String(k).padStart(2, "0");
  return (
    <section id="faculty" className="rs-tl rs-ar-section" aria-labelledby="tl-title">
      <SectionMotif variant="buti" className="!text-black/[0.05]" />
      <div className="rs-tl-wrap">
        <header className="rs-tl-head">
          <p data-pop="" className="rs-tl-eyebrow">
            <span className="l-en">Faculty · </span><span lang="hi" className="rs-hi normal-case">विषय विशेषज्ञ</span>
          </p>
          <h2 id="tl-title" data-pop="" className="rs-tl-title">Learn from the specialists</h2>
          <p data-pop="" className="rs-ar-lead">{specialists.length} subject specialists, teaching in the classroom and LIVE online.</p>
        </header>

        <ul className="rs-ar">
          {specialists.map((f, i) => (
            <li key={f.name} data-pop="" className="rs-ar-item">
              <figure className="rs-ar-fig" tabIndex={0}>
                <div className="rs-ar-arch">
                  <Image
                    src={`/v3/images/faculty/${f.img}.webp`}
                    alt={`${f.name}, ${f.subject} faculty`}
                    fill
                    sizes="(min-width: 1100px) 16vw, (min-width: 600px) 30vw, 44vw"
                    className="object-cover object-top"
                    priority={i < 3}
                  />
                </div>
                <div className="rs-ar-plinth" aria-hidden>
                  <span>{pad(i + 1)}</span>
                </div>
                <figcaption>
                  <b>{f.name}</b>
                  <span className="rs-ar-subject">{f.subject}</span>
                  <span className="rs-ar-level">{f.detail}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="rs-ar-foot">
          <span className="rs-tl-chips">
            <span>Classroom</span>
            <span>LIVE online</span>
          </span>
          <p>The same faculty in both. Want to know who teaches your subject?</p>
          <Btn href="#enrol" variant="ink">Ask a counsellor</Btn>
        </div>
      </div>
    </section>
  );
}
