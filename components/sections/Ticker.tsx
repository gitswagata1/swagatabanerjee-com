import { profile } from "@/content/profile";

export function Ticker() {
  const items = profile.ticker;
  return (
    <section aria-label="Highlights" className="marquee overflow-hidden bg-[var(--band)] py-3 text-[var(--on-band)]">
      <ul className="sr-only">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((t) => (
              <span key={t} className="flex items-center whitespace-nowrap font-mono text-sm">
                <span className="px-6">{t}</span>
                <span className="text-[var(--peri)]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
