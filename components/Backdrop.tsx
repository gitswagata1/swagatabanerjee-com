import type { CSSProperties, ReactNode } from "react";

/**
 * The background: soft pastel glows plus symmetric geometric shapes, placed as mirrored pairs
 * in the left and right page gutters. Each shape bobs gently; on desktop the pairs drift
 * with the cursor (components/Cursor.tsx sets --px / --py on .backdrop). The stars twinkle.
 * Pure CSS transforms and opacity, fixed behind all content, decorative only.
 * With reduced motion everything sits still.
 */
const SHAPES: Record<string, { closed: boolean; d: ReactNode }> = {
  star4: { closed: true, d: <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" /> },
  hexagon: { closed: true, d: <path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z" /> },
  diamond: { closed: true, d: <path d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12z" /> },
  octagon: { closed: true, d: <path d="M8.4 3h7.2L21 8.4v7.2L15.6 21H8.4L3 15.6V8.4z" /> },
  triangle: { closed: true, d: <path d="M12 3.5l9 15.5H3z" /> },
  square: { closed: true, d: <rect x="4.5" y="4.5" width="15" height="15" rx="1.5" transform="rotate(45 12 12)" /> },
  plus: { closed: false, d: <path d="M12 3v18M3 12h18" /> },
  target: {
    closed: false,
    d: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
      </>
    ),
  },
};

type Row = {
  s: keyof typeof SHAPES;
  y: number; // % of viewport height
  size: number;
  depth: number; // cursor parallax, px
  phone?: boolean; // also show the right-hand shape on phones
  twinkle?: boolean;
};

// Each row is drawn twice, mirrored on the left and right margins, so the composition is symmetric.
const ROWS: Row[] = [
  { s: "star4", y: 16, size: 22, depth: 10, phone: true, twinkle: true },
  { s: "hexagon", y: 32, size: 20, depth: 7 },
  { s: "plus", y: 47, size: 18, depth: 12 },
  { s: "diamond", y: 61, size: 20, depth: 8 },
  { s: "octagon", y: 75, size: 18, depth: 11 },
  { s: "target", y: 88, size: 22, depth: 6 },
];

const FILLS = ["var(--pink)", "var(--aqua)", "var(--sky)", "var(--lav)"];
const STROKES = ["var(--peri)", "var(--sky)", "var(--lav)"];
// Pinned inside the page gutter (content starts 32px from each edge on desktop), so shapes never touch text.
const SIDES = [
  { key: "l", pos: { left: "6px" } },
  { key: "r", pos: { right: "6px" } },
] as const;

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="blob blob-a" />
      <span className="blob blob-b" />
      <span className="blob blob-c" />
      {ROWS.flatMap((row, i) => {
        const shape = SHAPES[row.s];
        return SIDES.map((side) => (
          <span
            key={`${i}${side.key}`}
            className={`parallax ${row.phone && side.key === "r" ? "" : "hidden md:block"}`}
            style={{ ...side.pos, top: `${row.y}%`, ["--depth" as string]: row.depth } as CSSProperties}
          >
            <svg
              viewBox="0 0 24 24"
              width={row.size}
              height={row.size}
              className={`doodle ${row.twinkle ? "twinkle" : ""}`}
              fill={shape.closed ? FILLS[i % FILLS.length] : "none"}
              stroke={shape.closed ? "var(--peri)" : STROKES[i % STROKES.length]}
              strokeWidth={shape.closed ? 1.4 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={
                {
                  "--r": "0deg",
                  "--d": `${8 + (i % 3) * 1.5}s`,
                  // mirrored pairs bob in opposite phase
                  animationDelay: `${-i * 1.3 - (side.key === "r" ? 4 : 0)}s`,
                } as CSSProperties
              }
            >
              {shape.d}
            </svg>
          </span>
        ));
      })}
    </div>
  );
}
