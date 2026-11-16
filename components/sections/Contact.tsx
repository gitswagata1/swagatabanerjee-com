import { profile } from "@/content/profile";
import { CopyEmail } from "./AboutClient";

const { contact, resumes, identity, sheets } = profile;

export function Contact() {
  const link = "inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm font-medium hover:bg-ink hover:text-paper";
  return (
    <footer id="contact" aria-labelledby="contact-title" className="footer-wash border-t border-line bg-paper-2">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <p className="sheet-label">{sheets.contact}</p>
        <h2 id="contact-title" className="mt-3 max-w-4xl font-display text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
          {contact.headline}
        </h2>

        <div className="mt-10">
          <CopyEmail />
        </div>

        <ul className="mt-8 flex flex-wrap gap-3">
          <li>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer me" className={link}>
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a href={contact.github} target="_blank" rel="noopener noreferrer me" className={link}>
              GitHub ↗
            </a>
          </li>
          {resumes.map((r) => (
            <li key={r.id}>
              {r.ready ? (
                <a href={r.href} download data-celebrate className={link}>
                  {r.label} ↓
                </a>
              ) : (
                <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed border-ink-2 px-5 text-sm text-ink-2">
                  {r.label} <span className="placeholder-tag">[PLACEHOLDER — PDF]</span>
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="ticks mt-16" aria-hidden="true" />
        <p className="mt-4 flex flex-wrap justify-between gap-2 font-mono text-xs text-ink-2">
          <span>
            © {new Date().getFullYear()} {identity.name}
          </span>
          <span>
            {identity.location} · {identity.timeZoneLabel}, UTC+5:30
          </span>
        </p>
      </div>
    </footer>
  );
}
