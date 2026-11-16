import { profile } from "@/content/profile";

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
}

/**
 * Public repos, fetched on the server at build time and cached for a day.
 * The browser never calls GitHub. If the request fails, the grid is simply hidden.
 */
export async function getRepos(limit = 6): Promise<Repo[]> {
  const featured = new Set(
    profile.projects.flatMap((p) => p.links.map((l) => l.href.split("/").pop()?.toLowerCase())),
  );
  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.contact.githubUser}/repos?per_page=100&sort=pushed`,
      {
        headers: { accept: "application/vnd.github+json", "user-agent": "portfolio-build" },
        next: { revalidate: 86_400 },
      },
    );
    if (!res.ok) return [];
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((r) => r && !r.fork && !r.archived && !r.private && typeof r.name === "string")
      .filter((r) => !featured.has(String(r.name).toLowerCase()))
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
      .slice(0, limit)
      .map((r) => ({
        name: String(r.name),
        description: typeof r.description === "string" ? r.description : null,
        language: typeof r.language === "string" ? r.language : null,
        stars: Number(r.stargazers_count) || 0,
        url: `https://github.com/${profile.contact.githubUser}/${encodeURIComponent(String(r.name))}`,
      }));
  } catch {
    return [];
  }
}
