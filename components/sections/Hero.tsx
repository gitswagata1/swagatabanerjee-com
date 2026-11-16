import type { CSSProperties } from "react";
import Image from "next/image";
import { profile, isPlaceholder } from "@/content/profile";
import { AskInput } from "@/components/chat/AskInput";
import { Counter } from "@/components/ui/Counter";
import { IstClock } from "@/components/ui/IstClock";

const { identity, stats, resumes, sheets, photos } = profile;
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Inline photo slot inside the headline. Shows a labelled placeholder until photos exist. */
function PhotoSlot({ n }: { n: 0 | 1 }) {
  const photo = photos.heroInline[n];
  if (!isPlaceholder(photo.src))
    return (
      <span className="relative mx-[0.12em] inline-block h-[0.72em] w-[1.25em] -rotate-2 overflow-hidden rounded-full border border-line align-middle">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 180px, 60px" priority className="object-cover" />
      </span>
    );
  return (
    <span
      aria-hidden="true"
      className="mx-[0.12em] inline-grid h-[0.72em] w-[1.25em] -rotate-2 place-items-center rounded-full border border-dashed border-ink-2 bg-paper-2 align-middle"
    >
      <span className="font-mono text-[10px] tracking-wider text-ink-2">PHOTO</span>
    </span>
  );
}

export function Hero() {
  const resume = resumes[0];
  const [build, design, lead] = identity.headline;

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-8 sm:pt-8">
      <div className="rise flex flex-wrap items-center justify-between gap-x-6 gap-y-2" style={i(0)}>
        <p className="sheet-label">{sheets.hero}</p>
        <p className="flex items-center gap-2 font-mono text-xs text-ink">
          <span className="status-dot" aria-hidden="true" />
          {identity.statusShort}
          <span className="text-ink-2" aria-hidden="true">
            |
          </span>
          <IstClock />
        </p>
      </div>

      <h1
        id="hero-title"
        className="rise mt-4 font-display text-[clamp(3rem,11vw,9rem)] font-semibold leading-[0.98] tracking-[-0.02em] sm:mt-8"
        style={i(1)}
      >
        <span className="sr-only">{identity.name} — </span>
        <span className="whitespace-nowrap">
          {build} <PhotoSlot n={0} />
        </span>{" "}
        <br className="sm:hidden" />
        <span className="doodle-underline">
          {design}
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
            <path d="M1 6 C 18 1, 30 9, 48 5 S 80 2, 99 6" vectorEffect="non-scaling-stroke" />
          </svg>
        </span>{" "}
        <br className="sm:hidden" />
        <span className="whitespace-nowrap">
          <PhotoSlot n={1} /> {lead}
        </span>
      </h1>

      <div className="mt-5 flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
        <div className="order-1 lg:col-span-7">
          <p className="rise text-sm font-medium sm:text-lg" style={i(2)}>
            {identity.name} — {identity.title} @ {identity.company}
          </p>
          <p className="rise mt-2 max-w-xl text-sm leading-relaxed text-ink-2 sm:text-base" style={i(3)}>
            {identity.subline}
          </p>

          <div className="rise mt-4 flex flex-wrap items-center gap-3 sm:mt-6" style={i(4)}>
            <a
              href="#projects"
              data-magnetic
              className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-transform duration-150 ease-spring hover:scale-[1.03]"
            >
              View my work
            </a>
            <a
              href={resume.ready ? resume.href : "#contact"}
              download={resume.ready || undefined}
              data-magnetic
              data-celebrate={resume.ready || undefined}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-ink bg-paper px-6 text-sm font-medium transition-transform duration-150 ease-spring hover:scale-[1.03]"
            >
              Download résumé
              {!resume.ready && <span className="placeholder-tag">[PLACEHOLDER]</span>}
            </a>
          </div>
        </div>

        {/* On phones the proof points come before the AI input so they stay above the fold. */}
        <div className="rise order-3 lg:order-2 lg:col-span-5 lg:pt-1" style={i(5)}>
          <AskInput />
        </div>

      <div className="rise order-2 lg:order-3 lg:col-span-12" style={i(6)}>
        <div className="ticks" aria-hidden="true" />
        <div className="pt-3 pr-14 sm:pr-28">
          <dl className="grid flex-1 grid-cols-3 gap-x-4 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-12">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-2">{s.label}</dt>
                <dd className="font-mono text-xl font-medium sm:text-3xl">
                  <Counter {...s} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      </div>
    </section>
  );
}
