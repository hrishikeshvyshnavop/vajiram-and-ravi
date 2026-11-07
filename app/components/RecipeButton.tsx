import type { ReactNode } from "react";

// The one button used across /v5 (user 2026-11-07: "make all buttons consistent as the About section").
// Look taken from the About section's call-to-action: a boxed label and a separate square arrow box with a small gap, the label in
// small-caps League Spartan. Variants follow the ground it sits on:
//   light   cream boxes, dark text      - for dark and rust grounds (hero, About, counselling)
//   ink     dark boxes, cream text      - for light grounds (footer, FAQ, team collage, newsprint)
//   saffron saffron boxes, dark text    - for the header, which sits over every ground
// Hover turns both boxes saffron. size="sm" is the compact version (header, newsletter field).

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "light" | "ink" | "saffron";
  size?: "md" | "sm";
  as?: "span";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  target?: string;
  rel?: string;
};

export default function Btn({ children, href, variant = "light", size = "md", as, type = "button", disabled, onClick, ariaLabel, className = "", target, rel }: Props) {
  const cls = `rs-btn rs-btn--${variant} ${size === "sm" ? "rs-btn--sm" : ""} ${className}`.trim();
  const inner = (
    <>
      <span className="rs-btn-label">{children}</span>
      <span className="rs-btn-arrow" aria-hidden>
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
          <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
      </span>
    </>
  );
  if (as === "span") return <span className={cls}>{inner}</span>;
  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel} target={target} rel={rel} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cls} aria-label={ariaLabel} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}
