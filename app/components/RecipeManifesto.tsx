import Link from "next/link";

// Manifesto (storyline section 4). The emotional beat, kept short and skippable: three lines that open the full
// manifesto film at /manifesto (its own page, so nothing here can trap the visitor or hide the header).
// Lines are the manifesto page's own title text: "Read the nation. Write with conviction. Serve with integrity."

export default function RecipeManifesto() {
  return (
    <section id="manifesto" className="relative overflow-hidden bg-[var(--rs-saffron)] px-7 py-24 text-[var(--rs-deep)]">
      <div className="relative mx-auto grid max-w-[var(--rs-max)] gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p data-pop="" className="rs-small text-[14px] opacity-80">
            Our manifesto · <span lang="hi" className="rs-hi normal-case">हमारा घोषणापत्र</span>
          </p>
          <h2 data-pop="" className="rs-display mt-4 text-[clamp(48px,7vw,124px)]">
            Read the nation.
            <br />
            Write with conviction.
            <br />
            <span className="text-[var(--rs-rust)]">Serve with integrity.</span>
          </h2>
        </div>
        <div data-pop="" className="flex flex-col items-start gap-6">
          <p className="max-w-[420px] text-xl leading-snug">Five decades of shaping India&rsquo;s civil servants, and what we believe about how it should be done.</p>
          <Link href="/manifesto" className="rs-cta !bg-[var(--rs-deep)] !text-[var(--rs-saffron)]">
            Read the manifesto
          </Link>
        </div>
      </div>
    </section>
  );
}
