// Round arrow badge for pill CTAs: on hover of the parent `group/cta`, the arrow slides out
// up-right while a second one slides in from the bottom-left.
function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 11 11 3M4.5 3H11v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ArrowCircle({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}>
      <span className="absolute transition-transform duration-300 ease-out group-hover/cta:translate-x-[200%] group-hover/cta:-translate-y-[200%]">
        <Arrow />
      </span>
      <span className="absolute -translate-x-[200%] translate-y-[200%] transition-transform duration-300 ease-out group-hover/cta:translate-x-0 group-hover/cta:translate-y-0">
        <Arrow />
      </span>
    </span>
  );
}
