import { profile } from "@/content/profile";
import { Section, Text } from "@/components/ui/Section";
import { BeforeVit, Scroller } from "./JourneyClient";

const { journey } = profile;

export function Journey() {
  const last = journey.semesters.length - 1;
  return (
    <Section id="journey" sheet={profile.sheets.journey} title="The Journey" note="SEM 1 → SEM 8">
      <Scroller>
        <ol className="flex flex-col gap-6 lg:w-max lg:flex-row lg:gap-0">
          <li className="lg:w-72 lg:shrink-0 lg:snap-start lg:pr-6">
            <div className="ticks hidden lg:block" aria-hidden="true" />
            <p className="font-mono text-xs text-ink-2 lg:mt-3">PROLOGUE</p>
            <h3 className="mt-1 font-display text-2xl font-semibold">{journey.beforeVit.label}</h3>
            <p className="mt-2 text-sm text-ink-2">Where it started.</p>
            <BeforeVit />
          </li>

          {journey.semesters.map((s, i) => (
            <li key={s.id} className="border-l border-line pl-4 lg:w-80 lg:shrink-0 lg:snap-start lg:border-l-0 lg:pl-0 lg:pr-6">
              <div className="ticks hidden lg:block" aria-hidden="true" />
              <p className="font-mono text-xs text-ink-2 lg:mt-3">
                <span className={i === last ? "text-accent" : ""}>{String(i + 1).padStart(2, "0")}</span> · {s.term}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold">{s.label}</h3>
              <ul className="mt-3 space-y-2">
                {s.items.map((item, k) => (
                  <li
                    key={item}
                    className="border border-line bg-paper px-3 py-2 text-sm"
                    style={{ transform: `rotate(${((i + k) % 3) - 1}deg)` }}
                  >
                    <Text value={item} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Scroller>
    </Section>
  );
}
