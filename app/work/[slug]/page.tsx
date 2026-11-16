import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";
import { profile, isPlaceholder } from "@/content/profile";
import { FdeDemo } from "@/components/demo/FdeDemo";
import { Text } from "@/components/ui/Section";
import { Architecture } from "@/components/work/Architecture";

const { projects, sheets, identity } = profile;

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.tagline} ${p.context}. A case study by ${identity.name}.`,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.name} — ${identity.name}`, description: p.tagline, url: `/work/${p.slug}` },
  };
}

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-line py-8 lg:grid-cols-12 lg:gap-8">
      <h2 className="flex items-baseline gap-3 lg:col-span-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-accent font-mono text-[11px] text-accent">
          {n}
        </span>
        <span className="font-display text-xl font-semibold">{title}</span>
      </h2>
      <div className="max-w-3xl leading-relaxed lg:col-span-9">{children}</div>
    </section>
  );
}

const List = ({ items }: { items: readonly string[] }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item} className="grid grid-cols-[1.5rem_1fr]">
        <span aria-hidden="true" className="font-mono text-accent">
          →
        </span>
        <Text value={item} />
      </li>
    ))}
  </ul>
);

const Missing = ({ what }: { what: string }) => <span className="placeholder-tag">[PLACEHOLDER — {what}]</span>;

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  let n = 0;

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-8 sm:pt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="sheet-label">
          {sheets.projects} / {p.index}
        </p>
        <Link href="/#projects" className="font-mono text-xs underline-offset-4 hover:text-accent hover:underline">
          ← All projects
        </Link>
      </div>

      <header className="pb-10 pt-8 sm:pt-12">
        <ViewTransition name={`project-${p.slug}`}>
          <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[1] tracking-[-0.02em]">
            {p.name}
          </h1>
        </ViewTransition>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{p.tagline}</p>
        <p className="mt-3 font-mono text-xs text-ink-2">{p.context}</p>
      </header>

      <Block n={++n} title="The problem">
        {p.problem ? <Text value={p.problem} /> : <Missing what="the problem" />}
      </Block>

      <Block n={++n} title="My role">
        {p.role ? <Text value={p.role} /> : <Missing what="my role" />}
        {p.origin && <p className="mt-3 text-sm text-ink-2">{p.origin}</p>}
      </Block>

      <Block n={++n} title="What I built">
        <List items={p.built} />
        {p.research && (
          <p className="mt-4 border-l-2 border-accent pl-3 text-sm">
            <span className="sheet-label block">RESEARCH</span>
            {p.research}
          </p>
        )}
      </Block>

      <Block n={++n} title="Architecture">
        {p.architecture ? <Architecture stages={p.architecture} /> : <Missing what="architecture diagram" />}
      </Block>

      {p.hasDemo && (
        <div className="border-t border-line py-8">
          <FdeDemo />
        </div>
      )}

      <Block n={++n} title="Impact">
        {p.impact ? <List items={p.impact} /> : <Missing what="impact numbers" />}
      </Block>

      <Block n={++n} title="What I learned">
        {p.learned ? <Text value={p.learned} /> : <Missing what="what I learned" />}
      </Block>

      <Block n={++n} title="Stack">
        <ul className="flex flex-wrap gap-2">
          {p.stack.map((s) =>
            isPlaceholder(s) ? (
              <li key={s} className="placeholder-tag">
                {s}
              </li>
            ) : (
              <li key={s} className="border border-line px-2 py-1 font-mono text-xs">
                {s}
              </li>
            ),
          )}
        </ul>
      </Block>

      <Block n={++n} title="Links">
        {p.links.length ? (
          <ul className="flex flex-wrap gap-4">
            {p.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <Missing what="links" />
        )}
      </Block>

      <Link
        href={`/work/${next.slug}`}
        className="group mt-6 flex items-baseline justify-between gap-4 border-y border-line py-8 hover:bg-paper-2 sm:px-3"
      >
        <span>
          <span className="sheet-label block">NEXT / {next.index}</span>
          <span className="mt-1 block font-display text-2xl font-semibold sm:text-4xl">{next.name}</span>
        </span>
        <span aria-hidden="true" className="font-mono text-xl transition-transform duration-300 ease-spring group-hover:translate-x-1 group-hover:text-accent">
          →
        </span>
      </Link>
    </main>
  );
}
