// Brand primary button, matching the current Vajiram & Ravi site: orange pill with a white icon disc.
type Props = {
  href?: string;
  children: React.ReactNode;
  icon?: "phone" | "arrow";
  size?: "md" | "lg";
  className?: string;
  tabIndex?: number;
};

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out group-hover/btn:-rotate-12 group-hover/btn:scale-[1.06]"
    >
      <path
        d="M12.08 9.8 9.33 10.33C7.48 9.4 6.33 8.33 5.67 6.67l.51-2.75-.97-2.58h-2.5c-.75 0-1.34.62-1.23 1.36.28 1.86 1.1 5.22 3.52 7.64 2.54 2.54 6.19 3.64 8.2 4.07.78.17 1.47-.44 1.47-1.23v-2.39L12.08 9.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5"
    >
      <path d="M2 8h12M8.33 13.67 14 8 8.33 2.33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PrimaryCta({ href = "#", children, icon = "arrow", size = "md", className = "", tabIndex }: Props) {
  const sizing = size === "lg" ? "h-14 pl-6 text-[18px] leading-[25px]" : "h-12 pl-[18px] text-[16px] leading-[23px]";
  return (
    <a
      href={href}
      tabIndex={tabIndex}
      className={`group/btn inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#e57512] py-1.5 pr-1.5 font-display font-semibold text-white transition-[background-color,scale] duration-200 hover:bg-[#d1570e] active:scale-[0.98] ${sizing} ${className}`}
    >
      <span>{children}</span>
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[#e57512]">
        {icon === "phone" ? <PhoneIcon /> : <ArrowIcon />}
      </span>
    </a>
  );
}
