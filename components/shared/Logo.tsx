/**
 * Veritas logomark.
 *
 * The brand mark (a V that reads as a check, with a road running through it)
 * lives in public/logo-mark.png, generated from the source artwork by
 * scripts/gen-icons.mjs. It sits on a rounded white tile so it reads cleanly
 * on both the light site and the dark dashboard.
 */
import Image from 'next/image';

interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 30 }: LogoMarkProps) {
  return (
    <Image
      src="/logo-mark.png"
      width={size}
      height={size}
      alt="Veritas"
      priority
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.26),
        display: 'block',
      }}
    />
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
