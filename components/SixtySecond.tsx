"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";

const { identity, contact, projects, sixtySecond, resumes } = profile;
const top = sixtySecond.topProjectSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p) => p !== undefined);

/** Recruiter fast-lane: one clean screen, no animation. */
export function SixtySecond() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="h-11 rounded-full border border-ink px-4 text-xs font-medium text-ink hover:bg-ink hover:text-paper sm:text-sm"
      >
        <span className="sm:hidden">60 sec</span>
        <span className="hidden sm:inline">60-second version</span>
      </button>

      <dialog
        ref={ref}
        aria-labelledby="sixty-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto max-h-[92dvh] w-[min(44rem,94vw)] overflow-y-auto rounded-lg border border-line bg-paper p-0 text-ink backdrop:bg-black/60"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="sheet-label">60-SECOND VERSION</p>
              <h2 id="sixty-title" className="mt-1 font-display text-3xl font-semibold">
                {identity.name}
              </h2>
              <p className="mt-1 text-sm">
                {identity.title} @ {identity.company}
              </p>
              <p className="mt-1 text-sm text-ink-2">Open to: {identity.openTo}</p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-lg hover:bg-paper-2"
            >
              ×
            </button>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <section>
              <h3 className="sheet-label">TOP 3 PROJECTS</h3>
              <ul className="mt-2 space-y-3 text-sm">
                {top.map((p) => (
                  <li key={p.slug}>
                    <span className="font-medium">{p.name}</span>
                    <span className="text-ink-2"> · {p.context}</span>
                    <br />
                    <span className="text-ink-2">{p.tagline}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="sheet-label">TOP 5 ACHIEVEMENTS</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
                {sixtySecond.topAchievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm">
            <a className="text-accent underline" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <a className="underline" href={contact.linkedin}>
              LinkedIn
            </a>
            <a className="underline" href={contact.github}>
              GitHub
            </a>
            {resumes.map((r) =>
              r.ready ? (
                <a key={r.id} className="underline" href={r.href} download>
                  {r.label}
                </a>
              ) : (
                <span key={r.id} className="placeholder-tag">
                  [PLACEHOLDER — {r.label} PDF]
                </span>
              ),
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
