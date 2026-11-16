"use client";

import { useRef, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { Text } from "@/components/ui/Section";

/** Native horizontal scroll (no scroll-jacking) with arrow buttons for mouse users. */
export function Scroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollBy({ left: dir * 340, behavior: reduce ? "auto" : "smooth" });
  };
  const arrow = "grid size-11 place-items-center rounded-full border border-ink font-mono hover:bg-ink hover:text-paper";

  return (
    <>
      <div className="mb-4 hidden justify-end gap-2 lg:flex">
        <button type="button" onClick={() => move(-1)} aria-label="Earlier semesters" className={arrow}>
          ←
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Later semesters" className={arrow}>
          →
        </button>
      </div>
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Journey timeline, scrollable"
        className="lg:snap-x lg:overflow-x-auto lg:pb-6"
      >
        {children}
      </div>
    </>
  );
}

/** "Before VIT" opens as a scrapbook page. */
export function BeforeVit() {
  const ref = useRef<HTMLDialogElement>(null);
  const stop = profile.journey.beforeVit;

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="mt-3 inline-flex h-11 items-center rounded-full border border-ink px-4 text-sm font-medium hover:bg-ink hover:text-paper"
      >
        Open the scrapbook
      </button>
      <dialog
        ref={ref}
        aria-labelledby="before-vit-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(34rem,94vw)] -rotate-1 border border-line bg-paper-2 p-0 text-ink shadow-[8px_8px_0_var(--shadow)] backdrop:bg-black/60"
      >
        <div className="relative p-6 sm:p-8">
          <span aria-hidden="true" className="absolute -top-0 left-1/2 h-5 w-24 -translate-x-1/2 -translate-y-1/2 rotate-2 bg-accent/40" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="sheet-label">SHEET 07 / PROLOGUE</p>
              <h3 id="before-vit-title" className="mt-1 font-display text-3xl font-semibold">
                {stop.label}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-lg hover:bg-paper"
            >
              ×
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {stop.items.map((item, i) => (
              <li
                key={item}
                className="border border-line bg-paper p-3 text-sm"
                style={{ transform: `rotate(${i % 2 ? 0.8 : -0.6}deg)` }}
              >
                <Text value={item} />
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
