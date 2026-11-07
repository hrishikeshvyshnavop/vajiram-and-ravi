// Letter-roll label used by the /v5 buttons (header, hero, newspaper, team, FAQ). Its own module so
// footer/FAQ can use it without an import cycle through RecipeHeader -> RecipeFooter.

// davidecarusio-style hover: the letters roll up one after another and a copy rolls in from below.
export function Roll({ text }: { text: string }) {
  const letters = text.split("");
  return (
    <span className="rs-roll" aria-label={text}>
      <span className="rs-roll-line" aria-hidden>
        {letters.map((c, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {c === " " ? "\u00a0" : c}
          </span>
        ))}
      </span>
      <span className="rs-roll-line rs-roll-line--in" aria-hidden>
        {letters.map((c, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {c === " " ? "\u00a0" : c}
          </span>
        ))}
      </span>
    </span>
  );
}
