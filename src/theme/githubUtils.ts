import type { GitHubLabel, ItemSource, RoadmapItem } from "../types.js";

// ── Cache types ──

export type CacheEntry = {
  etag: string;
  timestamp: number;
  items: RoadmapItem[];
};

export const CACHE_TTL_MS = 5 * 60 * 1000;

// ── Helpers ──

export function extractExcerpt(body: string | null): string {
  if (!body) return "";
  const plain = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_~`>]/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
  const sentences = plain.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(" ").slice(0, 280);
}

export function parseItem(
  raw: Record<string, unknown>,
  source: ItemSource,
): RoadmapItem {
  const labels = (raw.labels as Record<string, unknown>[]).map((l) => ({
    name: l.name as string,
    color: l.color as string,
  }));

  return {
    number: raw.number as number,
    title: raw.title as string,
    excerpt: extractExcerpt(raw.body as string | null),
    type: raw.pull_request ? "pr" : "issue",
    status: (raw.state as string) === "open" ? "open" : "closed",
    source,
    labels: labels.filter((l) => l.name !== "roadmap"),
    updatedAt: raw.updated_at as string,
    createdAt: raw.created_at as string,
    url: raw.html_url as string,
  };
}

export function readCache(cacheKey: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

export function writeCache(cacheKey: string, entry: CacheEntry): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch {
    // storage full or unavailable
  }
}

// ── Fetch with ETag caching ──

export type FetchResult =
  | { status: "ok"; items: RoadmapItem[] }
  | { status: "cached"; items: RoadmapItem[] }
  | { status: "error"; items: RoadmapItem[]; message: string };

export async function cachedFetch(
  apiUrl: string,
  cacheKey: string,
  parseItems: (data: unknown) => RoadmapItem[],
): Promise<FetchResult> {
  const cache = readCache(cacheKey);

  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return { status: "cached", items: cache.items };
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (cache?.etag) {
    headers["If-None-Match"] = cache.etag;
  }

  try {
    const response = await fetch(apiUrl, { headers });

    if (response.status === 304 && cache) {
      const refreshed: CacheEntry = { ...cache, timestamp: Date.now() };
      writeCache(cacheKey, refreshed);
      return { status: "cached", items: cache.items };
    }

    if (!response.ok) {
      const msg =
        response.status === 403
          ? "GitHub rate limit reached. Showing cached data."
          : `GitHub API returned ${response.status}`;
      return { status: "error", items: cache?.items ?? [], message: msg };
    }

    const data = await response.json();
    const items = parseItems(data);
    const etag = response.headers.get("etag") ?? "";

    writeCache(cacheKey, { etag, timestamp: Date.now(), items });
    return { status: "ok", items };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return {
      status: "error",
      items: cache?.items ?? [],
      message: `Could not reach GitHub: ${message}`,
    };
  }
}

/** Parse a GitHub issue or PR URL into repo + number. Returns null if unparseable. */
export function parseIssueUrl(
  url: string,
): { repo: string; number: number } | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(
      /^\/([^/]+\/[^/]+)\/(?:issues|pull)\/(\d+)/,
    );
    if (!match) return null;
    return { repo: match[1], number: Number.parseInt(match[2], 10) };
  } catch {
    return null;
  }
}

/** Fetch a single issue/PR by URL and return partial metadata. */
export async function fetchIssueMetadata(
  url: string,
): Promise<{
  status: "open" | "closed";
  type: "issue" | "pr";
  labels: GitHubLabel[];
} | null> {
  const parsed = parseIssueUrl(url);
  if (!parsed) return null;

  const apiUrl = `https://api.github.com/repos/${parsed.repo}/issues/${parsed.number}`;
  try {
    const resp = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!resp.ok) return null;
    const raw = (await resp.json()) as Record<string, unknown>;
    const labels = (raw.labels as Record<string, unknown>[]).map((l) => ({
      name: l.name as string,
      color: l.color as string,
    }));
    return {
      status: (raw.state as string) === "open" ? "open" : "closed",
      type: raw.pull_request ? "pr" : "issue",
      labels: labels.filter((l) => l.name !== "roadmap"),
    };
  } catch {
    return null;
  }
}
