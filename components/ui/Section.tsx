import type { ReactNode } from "react";
import { isPlaceholder } from "@/content/profile";

/** A drawing sheet: mono sheet label, display title, ruler-tick divider. */
export function Section({
  id,
  sheet,
  title,
  note,
  children,
}: {
  id: string;
  sheet: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="sheet mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="sheet-label">{sheet}</p>
          <h2 id={`${id}-title`} className="mt-2 font-display text-4xl font-semibold tracking-[-0.01em] sm:text-6xl">
            {title}
          </h2>
        </div>
        {note && <p className="sheet-label pb-2 text-right">{note}</p>}
      </div>
      <div className="ticks mt-6" aria-hidden="true" />
      <div className="mt-8 sm:mt-12">{children}</div>
    </section>
  );
}

/** Renders text, or a visible placeholder tag when the content file has a gap. */
export function Text({ value, className = "" }: { value: string; className?: string }) {
  if (isPlaceholder(value) || value.includes("[CONFIRM"))
    return <span className={`placeholder-tag ${className}`}>{value}</span>;
  return <span className={className}>{value}</span>;
}
