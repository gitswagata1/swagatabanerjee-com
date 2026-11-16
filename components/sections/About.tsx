import Image from "next/image";
import { profile } from "@/content/profile";
import { IstClock } from "@/components/ui/IstClock";
import { Section, Text } from "@/components/ui/Section";
import { LetterToy } from "./AboutClient";

const { about, identity, photos } = profile;

export function About() {
  return (
    <Section id="about" sheet={profile.sheets.about} title="About">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* "Swagata in a text message" */}
        <div className="lg:col-span-5">
          <div className="mx-auto max-w-sm rounded-[2rem] border border-line bg-paper p-4 shadow-[6px_6px_0_var(--shadow)]">
            <p className="text-center font-mono text-[11px] text-ink-2">
              {identity.shortName} · <IstClock />
            </p>
            <ul className="mt-3 space-y-2">
              {about.textMessage.map((m, i) => (
                <li
                  key={m.k}
                  className={`w-fit max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
                    i % 2 ? "ml-auto rounded-br-sm bg-accent text-on-accent" : "rounded-bl-sm bg-paper-2"
                  }`}
                >
                  <span className="block font-mono text-[11px]">{m.k}</span>
                  {i % 2 ? m.v.startsWith("[") ? <span className="font-mono text-xs">{m.v}</span> : m.v : <Text value={m.v} />}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-7">
          <div className="border border-line bg-paper p-5">
            <p className="sheet-label flex items-center gap-2">
              <span className="status-dot" aria-hidden="true" /> NOW
            </p>
            <p className="mt-2">
              <Text value={about.now} />
            </p>
          </div>

          <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
            <p>{identity.positioning}</p>
            {about.story.map((para) => (
              <p key={para}>
                <Text value={para} />
              </p>
            ))}
          </div>

          <p className="font-mono text-xs text-ink-2">
            {identity.education.degree} · {identity.education.school} · {identity.education.period}
          </p>
        </div>
      </div>

      <div className="mt-14">
        <LetterToy />
      </div>

      <div className="mt-14">
        <h3 className="sheet-label">GALLERY</h3>
        {photos.gallery.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {photos.gallery.map((ph, i) => (
              <li key={ph.src} className="border border-line bg-paper p-2" style={{ transform: `rotate(${(i % 3) - 1}deg)` }}>
                <Image src={ph.src} alt={ph.alt} width={480} height={480} loading="lazy" className="aspect-square w-full object-cover" />
                <p className="mt-2 font-mono text-[11px] text-ink-2">{ph.caption}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder-tag mt-3">[PLACEHOLDER — photos in /public/photos, with short captions]</p>
        )}
      </div>
    </Section>
  );
}
