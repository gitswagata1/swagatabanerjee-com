import Link from "next/link";
import { ViewTransition } from "react";
import { profile, isPlaceholder } from "@/content/profile";
import { Section } from "@/components/ui/Section";
import { AlsoBuilt } from "./AlsoBuilt";

const { projects } = profile;

export function Projects() {
  return (
    <Section
      id="projects"
      sheet={profile.sheets.projects}
      title="Projects"
      note={`${String(projects.length).padStart(2, "0")} ITEMS`}
    >
      <ol className="border-t border-line">
        {projects.map((p) => (
          <li key={p.slug} className="group relative border-b border-line">
            <Link
              href={`/work/${p.slug}`}
              className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-5 transition-colors duration-150 hover:bg-paper-2 focus-visible:bg-paper-2 sm:grid-cols-[4rem_1fr_auto] sm:px-3 sm:py-7"
            >
              <span className="font-mono text-sm text-ink-2 transition-colors duration-150 group-hover:text-accent">
                {p.index}
              </span>
              <span>
                <ViewTransition name={`project-${p.slug}`}>
                  <span className="block font-display text-2xl font-semibold leading-tight sm:text-4xl">{p.name}</span>
                </ViewTransition>
                <span className="mt-1 block text-sm text-ink-2">{p.tagline}</span>
                <span className="mt-1 block font-mono text-xs text-ink-2 sm:hidden">{p.context}</span>
              </span>
              <span className="flex items-center gap-4">
                <span className="hidden font-mono text-xs text-ink-2 sm:inline">{p.context}</span>
                <span
                  aria-hidden="true"
                  className="font-mono text-lg transition-transform duration-300 ease-spring group-hover:translate-x-1 group-hover:text-accent"
                >
                  →
                </span>
              </span>
            </Link>

            {/* Hover reveal: a taped-in drawing card (desktop, pointer devices only). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-64 top-1/2 z-10 hidden w-60 -translate-y-1/2 rotate-2 scale-95 border border-line bg-paper p-4 opacity-0 shadow-[5px_5px_0_var(--line)] transition-[opacity,transform] duration-300 ease-calm group-hover:rotate-[-2deg] group-hover:scale-100 group-hover:opacity-100 lg:block"
            >
              <span className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-[-3deg] bg-accent/30" />
              <p className="sheet-label">DWG {p.index} / STACK</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {p.stack
                  .filter((s) => !isPlaceholder(s))
                  .slice(0, 6)
                  .map((s) => (
                    <li key={s} className="border border-line px-1.5 py-0.5 font-mono text-[11px]">
                      {s}
                    </li>
                  ))}
              </ul>
              {p.hasDemo && <p className="mt-3 font-mono text-[11px] text-accent">▶ INTERACTIVE DEMO INSIDE</p>}
            </div>
          </li>
        ))}
      </ol>

      <AlsoBuilt />
    </Section>
  );
}
