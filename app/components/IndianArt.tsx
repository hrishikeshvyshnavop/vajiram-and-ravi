// Simple line-art Indian motifs for the Constitution hero: a paisley (buta) and a lotus. All are stroke-only and use currentColor, so
// the caller sets colour and opacity with text and opacity classes.

type ArtProps = { className?: string };

export function Paisley({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" className={className} aria-hidden>
      <path d="M60 112 C25 112 10 85 15 60 C20 35 45 15 72 12 C88 10 92 28 80 32 C72 35 68 26 74 22" />
      <path d="M80 32 C90 50 95 75 85 95 C78 107 70 112 60 112" />
      <path d="M58 100 C35 100 26 82 29 64 C32 46 48 34 66 34 C80 40 84 62 78 80 C74 92 67 100 58 100Z" />
      <path d="M56 88 C44 88 39 76 42 66 C45 56 54 50 64 52 C70 60 70 74 66 82 C63 86 60 88 56 88Z" />
      <circle cx={55} cy={70} r={3} />
      {[
        [20, 92],
        [12, 72],
        [16, 50],
        [28, 30],
        [48, 16],
        [92, 60],
        [93, 82],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx - (cx < 50 ? 7 : -5)} cy={cy} r={1.4} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

export function Lotus({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 90" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" className={className} aria-hidden>
      <path d="M50 72 C28 74 12 62 6 50 C22 48 40 56 50 72Z" />
      <path d="M50 72 C72 74 88 62 94 50 C78 48 60 56 50 72Z" />
      <path d="M50 70 C30 64 22 46 26 32 C40 38 48 54 50 70Z" />
      <path d="M50 70 C70 64 78 46 74 32 C60 38 52 54 50 70Z" />
      <path d="M50 18 C62 36 62 56 50 70 C38 56 38 36 50 18Z" />
      <path d="M18 80 Q50 88 82 80" strokeLinecap="round" />
    </svg>
  );
}
