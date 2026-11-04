import HeroConstitution from "../components/HeroConstitution";
import SmoothScroll from "../components/SmoothScroll";

// Iteration 8: the Constitution of India cover hero (after ten.375.studio). Scrolling opens the
// book and grows the open spread to fill the screen, then the scroll turns horizontal and a plain white
// screen slides in from the right (the blank start of a planned horizontal-scroll site), so the vertical
// landing sections are left out of this route. No header either; it would sit on top of the book.
export default function ConstitutionBook() {
  return (
    <main className="flex flex-1 flex-col">
      <SmoothScroll>
        <HeroConstitution />
      </SmoothScroll>
    </main>
  );
}
