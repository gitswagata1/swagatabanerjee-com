import type { CSSProperties, ReactNode } from "react";

/**
 * The fun background: soft pastel glows plus doodle "stickers" floating at the page edges.
 * Each doodle bobs on its own; on desktop they also drift with the cursor at different depths
 * (components/Cursor.tsx sets --px / --py on .backdrop). Stars and sparks twinkle.
 * Pure CSS transforms and opacity, fixed behind all content, decorative only.
 * With reduced motion everything sits still.
 */
const SHAPES: Record<string, { closed: boolean; d: ReactNode }> = {
  star: { closed: true, d: <path d="M12 2l2.6 6.9L22 10l-5.6 4.6L18 22l-6-4-6 4 1.6-7.4L2 10l7.4-1.1z" /> },
  heart: { closed: true, d: <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" /> },
  ring: { closed: true, d: <circle cx="12" cy="12" r="8" /> },
  triangle: { closed: true, d: <path d="M12 4l9 15H3z" /> },
  smiley: {
    closed: true,
    d: (
      <>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8.3 14.2c2 2.3 5.4 2.3 7.4 0M9 9.6v.6M15 9.6v.6" fill="none" />
      </>
    ),
  },
  squiggle: { closed: false, d: <path d="M2 12c2.5-6 4.5 6 7 0s4.5 6 7 0 4 3 6 2" /> },
  zigzag: { closed: false, d: <path d="M2 15l4-6 4 6 4-6 4 6 4-6" /> },
  spark: { closed: false, d: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" /> },
};

type Doodle = {
  s: keyof typeof SHAPES;
  x: number; // % of viewport width
  y: number; // % of viewport height
  size: number;
  r: number; // resting rotation, deg
  depth: number; // cursor parallax, px
  wide?: boolean; // hidden on phones
  twinkle?: boolean;
};

// Kept to the left and right margins so nothing sits behind text.
const DOODLES: Doodle[] = [
  { s: "star", x: 3, y: 16, size: 30, r: -12, depth: 30, wide: true, twinkle: true },
  { s: "heart", x: 93, y: 20, size: 26, r: 10, depth: 18 },
  { s: "ring", x: 95, y: 36, size: 22, r: 0, depth: 40, wide: true },
  { s: "squiggle", x: 2, y: 54, size: 40, r: -8, depth: 22, wide: true },
  { s: "smiley", x: 91, y: 56, size: 34, r: 8, depth: 34, wide: true },
  { s: "triangle", x: 4, y: 76, size: 22, r: 18, depth: 26, wide: true },
  { s: "spark", x: 93, y: 82, size: 28, r: 0, depth: 20, twinkle: true },
  { s: "zigzag", x: 86, y: 93, size: 34, r: -6, depth: 14, wide: true },
  { s: "star", x: 7, y: 93, size: 20, r: 14, depth: 36, wide: true, twinkle: true },
];

const FILLS = ["var(--pink)", "var(--aqua)", "var(--sky)", "var(--lav)"];
const STROKES = ["var(--peri)", "var(--sky)", "var(--lav)"];

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="blob blob-a" />
      <span className="blob blob-b" />
      <span className="blob blob-c" />
      {DOODLES.map((d, i) => {
        const shape = SHAPES[d.s];
        return (
          <span
            key={i}
            className={`parallax ${d.wide ? "hidden md:block" : ""}`}
            style={{ left: `${d.x}%`, top: `${d.y}%`, "--depth": d.depth } as CSSProperties}
          >
            <svg
              viewBox="0 0 24 24"
              width={d.size}
              height={d.size}
              className={`doodle ${d.twinkle ? "twinkle" : ""}`}
              fill={shape.closed ? FILLS[i % FILLS.length] : "none"}
              stroke={shape.closed ? "var(--peri)" : STROKES[i % STROKES.length]}
              strokeWidth={shape.closed ? 1.4 : 2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={
                {
                  "--r": `${d.r}deg`,
                  "--d": `${8 + (i % 4) * 1.5}s`,
                  animationDelay: `${-i * 1.3}s`,
                } as CSSProperties
              }
            >
              {shape.d}
            </svg>
          </span>
        );
      })}
    </div>
  );
}
