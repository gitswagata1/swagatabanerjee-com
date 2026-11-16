import type { CSSProperties } from "react";

/**
 * The fun background: slow violet glows plus hand-drawn doodles floating on the blueprint grid.
 * Pure CSS, transform-only animations (compositor), fixed behind all content, decorative.
 * With reduced motion everything simply sits still.
 */
const SHAPES = {
  star: <path d="M12 2l2.6 6.9L22 10l-5.6 4.6L18 22l-6-4-6 4 1.6-7.4L2 10l7.4-1.1z" />,
  plus: <path d="M12 3v18M3 12h18" />,
  ring: <circle cx="12" cy="12" r="8" />,
  squiggle: <path d="M2 12c2.5-6 4.5 6 7 0s4.5 6 7 0 4 3 6 2" />,
  triangle: <path d="M12 4l9 15H3z" />,
  spark: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />,
  bracket: <path d="M9 3H5v18h4M15 3h4v18h-4" />,
} as const;

type Doodle = { s: keyof typeof SHAPES; x: number; y: number; size: number; r: number; d: number; o: number; wide?: boolean };

const CLOSED = new Set<keyof typeof SHAPES>(["star", "ring", "triangle"]);
const FILLS = ["var(--pink)", "var(--aqua)", "var(--sky)", "var(--lav)"];
const STROKES = ["var(--peri)", "var(--sky)", "var(--lav)"];

// x / y are percentages of the viewport; `wide` doodles only show on larger screens.
const DOODLES: Doodle[] = [
  { s: "star", x: 6, y: 18, size: 34, r: -12, d: 9, o: 0.5 },
  { s: "plus", x: 91, y: 14, size: 26, r: 10, d: 7, o: 0.45 },
  { s: "ring", x: 82, y: 38, size: 44, r: 0, d: 11, o: 0.3, wide: true },
  { s: "squiggle", x: 12, y: 62, size: 56, r: -8, d: 10, o: 0.4, wide: true },
  { s: "triangle", x: 94, y: 70, size: 30, r: 18, d: 8, o: 0.35 },
  { s: "spark", x: 70, y: 86, size: 36, r: 0, d: 12, o: 0.45, wide: true },
  { s: "bracket", x: 3, y: 86, size: 30, r: 6, d: 9, o: 0.3 },
  { s: "plus", x: 44, y: 8, size: 18, r: 20, d: 6, o: 0.35, wide: true },
  { s: "star", x: 58, y: 54, size: 20, r: 14, d: 8, o: 0.25, wide: true },
  { s: "ring", x: 28, y: 90, size: 22, r: 0, d: 7, o: 0.35, wide: true },
  { s: "spark", x: 24, y: 34, size: 22, r: 0, d: 10, o: 0.3, wide: true },
  { s: "squiggle", x: 62, y: 22, size: 40, r: 10, d: 13, o: 0.3, wide: true },
];

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="blob blob-a" />
      <span className="blob blob-b" />
      <span className="blob blob-c" />
      {DOODLES.map((d, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={d.size}
          height={d.size}
          className={`doodle ${d.wide ? "hidden md:block" : ""}`}
          fill={CLOSED.has(d.s) ? FILLS[i % FILLS.length] : "none"}
          stroke={CLOSED.has(d.s) ? "var(--peri)" : STROKES[i % STROKES.length]}
          strokeWidth={CLOSED.has(d.s) ? 1.4 : 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            {
              left: `${d.x}%`,
              top: `${d.y}%`,
              opacity: Math.min(1, d.o + 0.45),
              "--r": `${d.r}deg`,
              "--d": `${d.d}s`,
              animationDelay: `${-i * 1.3}s`,
            } as CSSProperties
          }
        >
          {SHAPES[d.s]}
        </svg>
      ))}
    </div>
  );
}
