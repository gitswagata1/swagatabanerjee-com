export type AvatarState = "wave" | "idle" | "walk" | "point" | "talk" | "think" | "celebrate" | "sleep" | "jump";

/**
 * Mini Swagata — SVG character driven by a `data-state` attribute; all motion is CSS
 * (see "Mini Swagata" in globals.css). State names match the planned Rive state machine,
 * so a .riv asset can replace this component without touching callers.
 * Signature details (hair, glasses, outfit, prop) are pending reference photos:
 * see profile.avatar.details.
 */
export function MiniSwagata({
  state = "idle",
  className = "",
  decorative = false,
}: {
  state?: AvatarState;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      data-state={state}
      className={`ms ${className}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Mini Swagata"}
      fill="none"
      stroke="var(--ink)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="ms-root">
        <path d="M30 40c-4-16 6-26 18-26s22 10 18 26c-2-8-8-13-18-13s-16 5-18 13z" fill="var(--ink)" />
        <circle cx="48" cy="36" r="15" fill="var(--paper)" />
        <path d="M33 33c3-8 9-11 15-11s12 3 15 11c-5-3-10-4-15-4s-10 1-15 4z" fill="var(--ink)" />
        <g className="ms-eyes">
          <circle className="ms-eye" cx="42" cy="38" r="1.6" fill="var(--ink)" stroke="none" />
          <circle className="ms-eye" cx="54" cy="38" r="1.6" fill="var(--ink)" stroke="none" />
        </g>
        <path className="ms-mouth" d="M43 44c3 3 7 3 10 0" />
        <circle cx="38" cy="43" r="2.2" fill="var(--accent)" stroke="none" opacity=".55" />
        <circle cx="58" cy="43" r="2.2" fill="var(--accent)" stroke="none" opacity=".55" />

        <path d="M35 58c0-4 4-6 13-6s13 2 13 6v18H35z" fill="var(--paper)" />
        <path d="M41 53l7 7 7-7" stroke="var(--accent)" />
        <path className="ms-arm-l" d="M35 60l-8 10" />
        <path className="ms-arm-r" d="M61 59l12-14" />
        <path className="ms-leg-l" d="M43 76v10" />
        <path className="ms-leg-r" d="M53 76v10" />

        <g className="ms-think" fill="var(--accent)" stroke="none">
          <circle cx="70" cy="22" r="2" />
          <circle cx="77" cy="15" r="2.6" />
          <circle cx="86" cy="8" r="3.2" />
        </g>
        <text className="ms-zzz" x="68" y="20" fill="var(--ink-2)" stroke="none" fontSize="12" fontFamily="var(--font-mono)">
          zzz
        </text>
      </g>
    </svg>
  );
}
