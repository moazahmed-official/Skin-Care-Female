/**
 * Typographic wordmark drawn as paths-free SVG text so it keeps the
 * display face's optical sizing without shipping a logo bitmap.
 * The ampersand sits in a ruled lozenge — the brand's one ornament.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 268 26" className={className} role="img" aria-label="Lumen & Salt">
      <text
        x="0"
        y="19.5"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="21"
        letterSpacing="1.2"
        fill="currentColor"
      >
        LUMEN
      </text>
      <g>
        <rect
          x="86"
          y="3"
          width="26"
          height="20"
          rx="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
        <text
          x="99"
          y="18"
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="13"
          fontStyle="italic"
          fill="currentColor"
        >
          &amp;
        </text>
      </g>
      <text
        x="120"
        y="19.5"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="21"
        letterSpacing="1.2"
        fill="currentColor"
      >
        SALT
      </text>
    </svg>
  );
}
