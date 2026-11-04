import CtaShader from "./CtaShader";
import PrimaryCta from "./PrimaryCta";

// Closing call to action: a dark rounded panel with a centred headline and buttons,
// after primefold's final CTA. Copy follows the current V&R site's closing message.
export default function FinalCta() {
  return (
    <section className="relative z-10 bg-white pb-24 md:pb-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-[72px]">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#1a1814] px-6 py-16 text-center text-white md:px-12 md:py-20">
          {/* Static glow is the fallback if WebGL is unavailable; the shader paints over it. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20"
            style={{ background: "radial-gradient(60% 90% at 50% 120%, rgba(229,117,18,0.22), transparent 70%)" }}
          />
          <CtaShader />
          <div aria-hidden className="hero-grain absolute inset-0 -z-10 opacity-[0.06]" />

          <h2 className="font-headline mx-auto max-w-[620px] text-[34px] leading-[1.15] tracking-[0.02em] md:text-5xl md:leading-[56px]">
            Start where
            <br />
            the toppers started.
          </h2>
          <p className="mx-auto mt-4 max-w-[380px] text-sm leading-5 text-white/85">
            Admissions for 2027 are open.
            <br />
            Talk to a counsellor and find the course that fits you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <PrimaryCta icon="phone">Talk to a counsellor</PrimaryCta>
            <a
              href="#"
              className="glass-pill inline-flex h-12 items-center rounded-full px-5 font-display font-semibold transition hover:bg-white/30"
            >
              Find your course
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
