/**
 * Fixed-window rate limit: LIMIT requests per WINDOW per key (IP).
 *
 * On Vercel, serverless instances don't share memory, so set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN (free tier is plenty) for a limit that actually holds.
 * Without them this falls back to an in-memory counter: fine for local dev, best-effort in production.
 */
export const LIMIT = 10;
export const WINDOW_SECONDS = 10 * 60;

const memory = new Map<string, { count: number; resetAt: number }>();

async function upstash(key: string): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, WINDOW_SECONDS, "NX"],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const [incr] = (await res.json()) as { result: number }[];
    return typeof incr?.result === "number" ? incr.result : null;
  } catch {
    return null;
  }
}

export async function allow(ip: string): Promise<boolean> {
  const key = `chat:${ip}`;
  const remote = await upstash(key);
  if (remote !== null) return remote <= LIMIT;

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    if (memory.size > 5000) memory.clear(); // cap memory; this path is best-effort anyway
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= LIMIT;
}
