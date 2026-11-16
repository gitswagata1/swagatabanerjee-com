import { getRepos } from "@/lib/github";

/** "Also built": public GitHub repos. Hidden entirely if there is nothing to show. */
export async function AlsoBuilt() {
  const repos = await getRepos();
  if (!repos.length) return null;

  return (
    <div className="mt-16">
      <h3 className="sheet-label">ALSO BUILT / FROM GITHUB</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((r) => (
          <li key={r.name}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col border border-line bg-paper p-4 transition-transform duration-300 ease-spring hover:-translate-y-1 hover:border-accent"
            >
              <span className="font-mono text-sm font-medium">{r.name}</span>
              {r.description && <span className="mt-2 line-clamp-3 text-sm text-ink-2">{r.description}</span>}
              <span className="mt-auto flex gap-4 pt-4 font-mono text-[11px] text-ink-2">
                {r.language && <span>{r.language}</span>}
                {r.stars > 0 && <span>★ {r.stars}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
