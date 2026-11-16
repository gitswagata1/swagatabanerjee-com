import Image from "next/image";
import { profile } from "@/content/profile";
import { Counter } from "@/components/ui/Counter";
import { Section, Text } from "@/components/ui/Section";

const { google } = profile;

export function Google() {
  return (
    <Section id="google" sheet={profile.sheets.google} title="Google showcase">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <ul className="space-y-6 lg:col-span-7">
          {google.items.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-x-2">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{item.title}</h3>
                {item.period && <p className="mt-1 font-mono text-xs text-ink-2">{item.period}</p>}
                {item.detail && <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-ink-2">{item.detail}</p>}
              </div>
            </li>
          ))}
          <li className="grid grid-cols-[2.5rem_1fr] gap-x-2">
            <span className="font-mono text-sm text-accent">{String(google.items.length + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-display text-xl font-semibold sm:text-2xl">Merged Google contributions</h3>
              <p className="mt-2">
                <Text value={google.contributions} />
              </p>
            </div>
          </li>
        </ul>

        <div className="lg:col-span-5">
          <div className="border border-line bg-paper p-5">
            <p className="sheet-label">BADGE WALL</p>
            <p className="mt-1 font-mono text-5xl font-medium text-accent">
              <Counter value={google.badgeCount} suffix={google.badgeSuffix} />
            </p>
            <p className="font-mono text-xs text-ink-2">GOOGLE CLOUD SKILL BADGES</p>

            {google.badges.length ? (
              <ul className="mt-5 grid grid-cols-5 gap-2">
                {google.badges.map((b) => (
                  <li key={b.name} className="group relative">
                    <Image
                      src={b.src}
                      alt={b.name}
                      width={96}
                      height={96}
                      className="aspect-square w-full object-contain transition-transform duration-300 ease-spring group-hover:scale-110"
                    />
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-40 -translate-x-1/2 border border-line bg-paper px-2 py-1 font-mono text-[11px] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      {b.name} · {b.date}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <ul aria-hidden="true" className="mt-5 grid grid-cols-8 gap-1.5">
                  {Array.from({ length: 24 }, (_, i) => (
                    <li key={i} className="aspect-square border border-dashed border-line" />
                  ))}
                </ul>
                <p className="placeholder-tag mt-3">[PLACEHOLDER — badge images in /public/badges, with name and date]</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
