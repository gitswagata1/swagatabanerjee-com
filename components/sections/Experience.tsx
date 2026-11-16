import { profile } from "@/content/profile";
import { Section } from "@/components/ui/Section";

export function Experience() {
  return (
    <Section id="experience" sheet={profile.sheets.experience} title="Experience">
      <ol className="space-y-14">
        {profile.experience.map((role, n) => (
          <li key={role.company} className="grid gap-4 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs text-accent">{String(n + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{role.company}</h3>
              <p className="mt-1 text-sm font-medium">{role.title}</p>
              {/* period drawn as a dimension line */}
              <p className="mt-3 flex items-center gap-2 font-mono text-xs text-ink-2">
                <span aria-hidden="true">├</span>
                {role.period}
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
                <span aria-hidden="true">┤</span>
              </p>
            </div>
            <div className="lg:col-span-8">
              {"summary" in role && role.summary && (
                <p className="mb-5 max-w-3xl text-sm leading-relaxed text-ink-2">{role.summary}</p>
              )}
              <ul className="max-w-3xl space-y-3">
                {role.bullets.map((b) => (
                  <li key={b} className="grid grid-cols-[1.5rem_1fr] text-[0.95rem] leading-relaxed">
                    <span aria-hidden="true" className="font-mono text-accent">
                      →
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
