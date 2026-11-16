import { profile } from "@/content/profile";
import { Section } from "@/components/ui/Section";

export function Recognition() {
  const { recognition, certifications } = profile;
  return (
    <Section id="recognition" sheet={profile.sheets.recognition} title="Recognition">
      <ul className="tints grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recognition.map((r, i) => (
          <li
            key={r.title}
            className={`relative flex flex-col border border-line bg-paper p-5 transition-transform duration-300 ease-spring hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--shadow)] ${
              r.detail ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
            }`}
          >
            <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-display text-xl font-semibold leading-snug">{r.title}</h3>
            {r.period && <p className="mt-1 font-mono text-xs text-ink-2">{r.period}</p>}
            {r.detail && <p className="mt-3 text-sm leading-relaxed text-ink-2">{r.detail}</p>}
          </li>
        ))}
      </ul>

      <h3 className="sheet-label mt-14">CERTIFICATIONS</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {certifications.map((c) => (
          <li key={c} className="border border-line bg-paper px-3 py-1.5 text-sm">
            {c}
          </li>
        ))}
      </ul>
    </Section>
  );
}
