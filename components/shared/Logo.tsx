/**
 * Veritas logomark.
 *
 * A solid rounded tile holding one mark that reads two ways at once:
 * a V (for Veritas) and a check (for verified). One idea, drawn cleanly -
 * the way a real brand mark is built, not decorated.
 */

interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 30 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Veritas"
    >
      {/* Tile */}
      <rect x="0" y="0" width="32" height="32" rx="9" fill="#12A06F" />
      {/* Soft top highlight for a little depth, not a gradient blob */}
      <rect x="0" y="0" width="32" height="16" rx="9" fill="#ffffff" opacity="0.07" />
      {/* The V / check mark */}
      <path
        d="M8.5 12.5 L15.5 22 L23.5 8.5"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

interface LogoFullProps {
  size?: number;
  fontSize?: number;
  textColor?: string;
}

export function LogoFull({ size = 30, fontSize = 19, textColor }: LogoFullProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      <span
        className="font-display"
        style={{
          fontSize,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: textColor ?? 'currentColor',
          lineHeight: 1,
        }}
      >
        Veritas
      </span>
    </span>
  );
}
