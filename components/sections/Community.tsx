import { profile } from "@/content/profile";
import { Section } from "@/components/ui/Section";

export function Community() {
  const { community, talks, testimonials, writing, identity } = profile;
  const [lead, ...rest] = community;

  return (
    <Section id="community" sheet={profile.sheets.community} title="Leadership & community">
      <div className="grid gap-8 lg:grid-cols-12">
        <article className="border border-line bg-paper p-6 lg:col-span-7">
          <p className="font-mono text-xs text-accent">01</p>
          <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{lead.org}</h3>
          <p className="mt-1 text-sm font-medium">{lead.role}</p>
          <p className="mt-1 font-mono text-xs text-ink-2">{lead.period}</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-2">{lead.detail}</p>
        </article>

        <ul className="divide-y divide-line border-y border-line lg:col-span-5">
          {rest.map((c, i) => (
            <li key={c.org} className="grid grid-cols-[2.5rem_1fr] py-4">
              <span className="font-mono text-xs text-accent">{String(i + 2).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-lg font-semibold">{c.org}</h3>
                <p className="text-sm">{c.role}</p>
                {c.period && <p className="mt-1 font-mono text-xs text-ink-2">{c.period}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Talks strip: the brand is real, the session list is still to come. */}
      <div className="mt-14">
        <h3 className="sheet-label">TALKS & SESSIONS / {identity.personalBrand.toUpperCase()}</h3>
        {talks.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {talks.map((t) => (
              <li key={t.title} className="border border-line bg-paper p-4">
                <p className="font-medium">{t.title}</p>
                <p className="mt-1 text-sm text-ink-2">{t.audience}</p>
                <p className="mt-2 font-mono text-xs text-ink-2">{t.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder-tag mt-3">[PLACEHOLDER — session titles, audiences, dates, photos]</p>
        )}
      </div>

      {/* Kind words and writing render only when real entries exist in profile.ts. */}
      {testimonials.length > 0 && (
        <div className="mt-14">
          <h3 className="sheet-label">KIND WORDS</h3>
          <ul className="mt-4 grid gap-4 lg:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.name} className="border border-line bg-paper p-5">
                <blockquote className="font-display text-lg leading-snug">“{t.quote}”</blockquote>
                <p className="mt-3 text-sm font-medium">{t.name}</p>
                <p className="font-mono text-xs text-ink-2">{t.role}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {writing.length > 0 && (
        <div className="mt-14">
          <h3 className="sheet-label">WRITING</h3>
          <ul className="mt-3 space-y-2">
            {writing.map((w) => (
              <li key={w.href}>
                <a href={w.href} className="underline underline-offset-4 hover:text-accent">
                  {w.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
