import CoverImage from "./CoverImage";
import BrailleSpinner from "./BrailleSpinner";

// "Choose how you prepare": three programme cards, each a light tray holding a white card
// with a dark scene on top, after primefold's product-card row.

type Programme = {
  badge: { label: string; color: string };
  name: string;
  status: { text: string; color: string };
  title: string;
  description: string;
  scene: React.ReactNode;
};

function ClassroomScene() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl">
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
        <CoverImage src="/hero/classroom.jpg" sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-[#282622]/90 p-3.5 text-white backdrop-blur">
        <p className="text-sm font-medium">Classroom programme, Delhi</p>
        <p className="mt-1 text-xs leading-4 text-white/70">
          Prelims-cum-Mains General Studies, taught in person by V&amp;R faculty.
        </p>
        <span className="mt-3 inline-flex rounded-full bg-[#3dd6b5]/15 px-2 py-0.5 text-[11px] font-medium text-[#7fe8d0]">
          Admission open
        </span>
      </div>
    </div>
  );
}

function OnlineScene() {
  const lessons = [
    { name: "Indian Polity · Lecture 14", done: true },
    { name: "Economy · Lecture 9", done: true },
    { name: "Modern History · Lecture 6", done: false },
  ];
  return (
    <div className="flex h-full flex-col rounded-2xl bg-[#282622] p-3 text-white">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#1a1814]">
        <div className="absolute inset-0 opacity-50 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <CoverImage src="/hero/prelims.jpg" sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw" />
        </div>
        <span className="relative flex size-11 items-center justify-center rounded-full bg-white/90 text-[#1a1814]">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M3 1.8v10.4L12 7 3 1.8Z" fill="currentColor" />
          </svg>
        </span>
        <span className="absolute inset-x-3 bottom-2.5 h-1 rounded-full bg-white/20">
          <span className="block h-full w-2/5 rounded-full bg-[#e57512]" />
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 text-xs">
        {lessons.map((l) => (
          <li key={l.name} className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-2">
            <span
              className={`flex size-4 items-center justify-center rounded-full text-[9px] ${
                l.done ? "bg-[#3dd6b5] text-[#1a1814]" : "border border-white/30"
              }`}
            >
              {l.done && "✓"}
            </span>
            <span className={l.done ? "text-white/60" : "text-white"}>{l.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const subjects = ["Polity", "Economy", "History", "Geography", "Environment", "Science", "IR", "Ethics", "Society"];

function SubjectIcon({ i }: { i: number }) {
  // Simple distinct glyphs; swap for real subject icons later.
  const paths = [
    "M3 13h10M4 11V6M8 11V6M12 11V6M2 5l6-3 6 3",
    "M2 13h12M4 11V8M8 11V4M12 11V6",
    "M8 2v3M4 14l1-6h6l1 6M6 8V5h4v3",
    "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12",
    "M8 14V7M8 7c0-3 2-5 5-5 0 3-2 5-5 5ZM8 9C8 6 6 4 3 4c0 3 2 5 5 5Z",
    "M6 2v4l-3 7h10l-3-7V2M5 2h6",
    "M2 8h12M8 2l3 6-3 6-3-6 3-6Z",
    "M8 2v12M3 5h10M3 5l-1.5 4h3L3 5ZM13 5l-1.5 4h3L13 5Z",
    "M5.5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM10.5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM2 13c0-2 1.5-4 3.5-4S9 11 9 13M7 13c0-2 1.5-4 3.5-4s3.5 2 3.5 4",
  ];
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d={paths[i]} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TestSeriesScene() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid grid-cols-3 gap-x-4 gap-y-3">
        {subjects.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.08] text-white/80 transition-colors duration-300 group-hover:bg-white/[0.12]">
              <SubjectIcon i={i} />
            </span>
            <span className="text-[10px] text-white/50">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const programmes: Programme[] = [
  {
    badge: { label: "GS", color: "#1f8a6b" },
    name: "Classroom GS PCM 2027",
    status: { text: "Admission open", color: "#1f8a6b" },
    title: "Classroom GS PCM",
    description: "Prelims-cum-Mains General Studies in the classroom, with study material and regular tests.",
    scene: <ClassroomScene />,
  },
  {
    badge: { label: "ON", color: "#d9771f" },
    name: "Online GS PCM 2027",
    status: { text: "Admission open", color: "#ca7b57" },
    title: "Online GS PCM",
    description: "The same programme online, so you can prepare from wherever you are.",
    scene: <OnlineScene />,
  },
  {
    badge: { label: "PT", color: "#6c5ce7" },
    name: "Prelims Test Series",
    status: { text: "Every GS subject", color: "#594aff" },
    title: "Prelims Test Series",
    description: "Topic-wise and full-length tests with detailed explanations.",
    scene: <TestSeriesScene />,
  },
];

export default function Programmes({ leading = false }: { leading?: boolean }) {
  return (
    <section
      className={`relative z-10 bg-[#faf9f8] py-24 text-[#212121] md:py-32 ${
        // First section after a pinned hero: rounded top as it slides over the hero.
        leading ? "rounded-t-2xl will-change-transform" : "cv-auto"
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-[72px]">
        <div className="mx-auto max-w-[600px] text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-[#616161]">
            <BrailleSpinner /> One institute. Every stage of the exam.
          </p>
          <h2 className="font-headline mt-3 text-[34px] leading-[1.15] tracking-[0.02em] md:text-5xl md:leading-[56px]">
            Choose how
            <br />
            you prepare.
          </h2>
          <p className="mt-4 text-sm text-[#545454]">
            Each programme has its own faculty, material and test schedule.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {programmes.map((p) => (
            <a key={p.name} href="#" className="group rounded-[18px] bg-black/[0.04] p-[2px]">
              <div className="flex items-center justify-between gap-3 px-3.5 py-[15px]">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded text-[9px] font-semibold text-white"
                    style={{ background: p.badge.color }}
                  >
                    {p.badge.label}
                  </span>
                  <span className="truncate font-medium text-[#1a1814]">{p.name}</span>
                </span>
                <span className="shrink-0 text-sm font-medium" style={{ color: p.status.color }}>
                  {p.status.text}
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
                <div className="h-[376px] rounded-2xl bg-[#1a1814] p-[14px] pt-[33px]">{p.scene}</div>
                <div className="px-6 pb-6 pt-6">
                  <p className="text-xl leading-7 text-[#1a1814]">{p.title}</p>
                  <p className="mt-2 text-sm leading-5 text-[#54524e]">{p.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
