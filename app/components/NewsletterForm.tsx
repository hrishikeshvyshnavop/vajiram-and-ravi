"use client";

// Email signup pill (input with the button inside), after primefold's footer.
// TODO: connect to the client's mailing list; until then submitting does nothing.
export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex h-12 w-full max-w-[340px] items-center rounded-full bg-white pl-4 pr-1.5 shadow-[0_0_0_1px_rgba(38,57,90,0.16),0_1px_2px_rgba(38,57,91,0.1)] focus-within:shadow-[0_0_0_2px_rgba(229,117,18,0.6)]"
    >
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        required
        placeholder="you@example.com"
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#44423e] outline-none placeholder:text-[#9a9895]"
      />
      <button
        type="submit"
        className="h-9 shrink-0 rounded-full bg-[#1a1814] px-4 text-[13px] font-medium text-white transition hover:bg-[#2d2a25]"
      >
        Subscribe
      </button>
    </form>
  );
}
