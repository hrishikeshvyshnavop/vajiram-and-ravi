export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3 17V11a7 7 0 0 1 14 0v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 17v-6a3 3 0 0 1 6 0v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
