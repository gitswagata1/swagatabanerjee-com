"use client";

import Link from "next/link";
import { useState } from "react";
import { profile, isPlaceholder } from "@/content/profile";

const { skills, projects } = profile;
const norm = (s: string) => s.toLowerCase();
const uses = (stack: readonly string[], skill: string) => stack.some((s) => norm(s) === norm(skill));
const linked = new Set(projects.flatMap((p) => p.stack.filter((s) => !isPlaceholder(s)).map(norm)));

/** Hover, focus or tap a skill to light up the projects that use it — and the other way round. */
export function SkillsBoard() {
  const [skill, setSkill] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const activeProject = projects.find((p) => p.slug === project);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-7 lg:col-span-8">
        {skills.map((g) => (
          <div key={g.group}>
            <h3 className="sheet-label">{g.group.toUpperCase()}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {g.items.map((item) => {
                const hasProjects = linked.has(norm(item));
                const lit = skill === item || (activeProject ? uses(activeProject.stack, item) : false);
                return (
                  <li key={item}>
                    {hasProjects ? (
                      <button
                        type="button"
                        aria-pressed={skill === item}
                        onMouseEnter={() => setSkill(item)}
                        onMouseLeave={() => setSkill(null)}
                        onFocus={() => setSkill(item)}
                        onBlur={() => setSkill(null)}
                        onClick={() => setSkill((s) => (s === item ? null : item))}
                        className={`min-h-9 border px-3 py-1.5 text-sm transition-colors duration-150 ${
                          lit ? "border-accent bg-accent text-on-accent" : "border-ink bg-paper hover:border-accent"
                        }`}
                      >
                        {item}
                      </button>
                    ) : (
                      <span className="inline-flex min-h-9 items-center border border-line bg-paper px-3 py-1.5 text-sm">
                        {item}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="lg:col-span-4">
        <div className="border border-line bg-paper p-5 lg:sticky lg:top-24">
          <p className="sheet-label">USED IN</p>
          <ul className="mt-3 space-y-1">
            {projects.map((p) => {
              const lit = skill ? uses(p.stack, skill) : project === p.slug;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/work/${p.slug}`}
                    onMouseEnter={() => setProject(p.slug)}
                    onMouseLeave={() => setProject(null)}
                    onFocus={() => setProject(p.slug)}
                    onBlur={() => setProject(null)}
                    className={`grid grid-cols-[2rem_1fr] items-baseline py-1.5 transition-colors duration-150 ${
                      lit ? "text-accent" : skill ? "text-ink-2" : ""
                    }`}
                  >
                    <span className="font-mono text-xs">{p.index}</span>
                    <span className={`font-display text-lg ${lit ? "font-semibold" : ""}`}>{p.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-ink-2" aria-live="polite">
            {skill
              ? `${skill}: ${projects.filter((p) => uses(p.stack, skill)).length} project(s)`
              : "Outlined skills link to projects. Hover or tap one."}
          </p>
        </div>
      </div>
    </div>
  );
}
