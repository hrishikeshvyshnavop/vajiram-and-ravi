// Contact options and Locations (storyline sections 13 and 14).
//   13: "Let the visitor pick their channel."   14: "Make it physical: New Delhi and Chennai, with directions."
// Facts are the ones on the current site (apps/Vajiram-ravi data/site.ts and data/home.ts): phone, email, hours, the
// Delhi address, landmark and map link. The Chennai address is only "Egmore, Chennai" on the current site, so it
// has no directions link until the client gives the full address. There is no WhatsApp card on purpose: the current
// site's WhatsApp link is a placeholder ("#"), so no number is verified.
//
// Option D (user 2026-11-09: "need another", after the road and signposts version): everything is a milestone. The two campuses (larger, saffron
// head) and the three ways to reach us (smaller, rust head) are five stones in one row on a single road. Options A (cards), B (milestone + city
// tabs + ruled directory) and C (stones on a road + arrow signposts) are in apps/my-app/backup/removed-sections.

const PHONE = "080-6220-6330";
const EMAIL = "admissions@vajiramandravi.com";
const DELHI_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060";

type Stone = {
  id: string;
  kind: "campus" | "channel";
  tag: string; // small line on the saffron / rust head
  title: string; // the big word
  sub: string; // the line under it, still on the head
  lines: string[]; // the cream band
  cta: string;
  href: string;
  external?: boolean;
};

const stones: Stone[] = [
  {
    id: "delhi",
    kind: "campus",
    tag: "V&R · Head campus",
    title: "New Delhi",
    sub: "Old Rajinder Nagar",
    lines: ["1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi – 110060", "Adjacent to Gate 5, Karol Bagh Metro Station & Pillar no. 103"],
    cta: "Get directions",
    href: DELHI_MAPS,
    external: true,
  },
  {
    id: "chennai",
    kind: "campus",
    tag: "V&R · Campus",
    title: "Chennai",
    sub: "Egmore",
    lines: ["Egmore, Chennai.", "Ask a counsellor for the full address and the current batches in Chennai."],
    cta: "Ask a counsellor",
    href: "#enrol",
  },
  {
    id: "call",
    kind: "channel",
    tag: "Talk to us",
    title: "Call",
    sub: PHONE,
    lines: ["Mon – Sat, 9 AM – 7 PM"],
    cta: "Call now",
    href: "tel:+918062206330",
  },
  {
    id: "email",
    kind: "channel",
    tag: "Email us",
    title: "Email",
    sub: "Write to us",
    lines: [EMAIL, "Admissions and course questions"],
    cta: "Send an email",
    href: `mailto:${EMAIL}`,
  },
  {
    id: "callback",
    kind: "channel",
    tag: "Request a call",
    title: "Callback",
    sub: "We call you back",
    lines: ["Choose the time that suits you"],
    cta: "Book free counselling",
    href: "#enrol",
  },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

/** The milestone row (campuses first, then the ways to reach us). `omit` drops stones by id, e.g. the callback stone when the callback form is right above. */
export function CampusStones({ omit = [] }: { omit?: string[] }) {
  const list = stones.filter((x) => !omit.includes(x.id));
  // five milestones along one road: the campuses first, then the ways to reach us
  return (
    <ul className={`rs-mwf is-${list.length}`}>
      {list.map((s) => (
        <li key={s.id} data-pop="" className={`rs-mwf-item is-${s.kind}`}>
          <div className="rs-ms-stone rs-mwf-stone">
            <p className="rs-ms-top">{s.tag}</p>
            <h3>{s.title}</h3>
            <p className="rs-ms-place">{s.sub}</p>
            <div className="rs-ms-band">
              {s.lines.map((l, i) => (
                <p key={l} className={i > 0 ? "rs-ms-near" : undefined}>{l}</p>
              ))}
              <a href={s.href} {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="rs-ms-link">
                {s.cta}
                {s.external ? (
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
                    <path d="M4 12 12 4M5.5 4H12v6.5" />
                  </svg>
                ) : (
                  <Arrow />
                )}
                {s.external && <span className="sr-only"> (opens Google Maps in a new tab)</span>}
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function RecipeContactLocations() {
  return (
    <section id="visit" className="relative overflow-hidden bg-[var(--rs-cream)] px-7 py-28 text-[var(--rs-rust)]">
      <div className="relative mx-auto max-w-[var(--rs-max)]">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p data-pop="" className="rs-small text-[14px] opacity-80">
              <span className="l-en">Contact and campus · </span><span lang="hi" className="rs-hi normal-case">संपर्क</span>
            </p>
            <h2 data-pop="" className="rs-display mt-4 text-[clamp(52px,6.6vw,108px)]">
              Here to help,
              <br />
              any way
            </h2>
          </div>
          <p data-pop="" className="max-w-[460px] text-xl leading-snug text-[var(--rs-deep)]/85">
            Pick the channel that suits you, or visit us in New Delhi or Chennai.
          </p>
        </div>

        <CampusStones />
      </div>
    </section>
  );
}
