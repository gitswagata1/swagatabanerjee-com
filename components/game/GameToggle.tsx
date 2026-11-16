"use client";

import { emit } from "@/lib/events";

/** Nav control: Game Mode is off until someone asks for it. */
export function GameToggle() {
  return (
    <button
      type="button"
      onClick={() => emit("game", true)}
      aria-label="Game Mode: play the journey"
      title="Game Mode"
      className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-paper-2"
    >
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2.5" y="7" width="19" height="11" rx="5.5" />
        <path d="M7 11v3M5.5 12.5h3M15.5 11.5h.01M18 13.5h.01" />
      </svg>
    </button>
  );
}
