import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import styles from "../css/theme.module.css";
import type {
  GitHubLabel,
  ItemSource,
  ItemStatus,
  ItemType,
  RoadmapItem,
  SortKey,
} from "../types.js";
import RoadmapEntry from "./RoadmapEntry.js";

// ── Cache types ──

type CacheEntry = {
  etag: string;
  timestamp: number;
  items: RoadmapItem[];
};

const CACHE_TTL_MS = 5 * 60 * 1000;

// ── Helpers ──

function extractExcerpt(body: string | null): string {
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

function parseItem(raw: Record<string, unknown>, source: ItemSource): RoadmapItem {
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

function readCache(cacheKey: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function writeCache(cacheKey: string, entry: CacheEntry): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch {
    // storage full or unavailable
  }
}

// ── Fetch with ETag caching ──

type FetchResult =
  | { status: "ok"; items: RoadmapItem[] }
  | { status: "cached"; items: RoadmapItem[] }
  | { status: "error"; items: RoadmapItem[]; message: string };

async function cachedFetch(
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

function fetchRoadmapItems(
  repo: string,
  label: string,
  cacheKey: string,
): Promise<FetchResult> {
  const apiUrl = `https://api.github.com/repos/${repo}/issues?labels=${encodeURIComponent(label)}&state=all&per_page=100`;
  return cachedFetch(apiUrl, cacheKey, (data) =>
    (data as Record<string, unknown>[]).map((raw) => parseItem(raw, "labeled")),
  );
}

/**
 * Fetch specific issues/PRs by URL using individual GET requests.
 * Parses each URL to extract repo + number, fetches via GitHub API.
 * Results are cached together under a single cache key.
 */
async function fetchPinnedItems(
  pinnedUrls: string[],
  cacheKey: string,
): Promise<FetchResult> {
  const parsed = pinnedUrls
    .map(parseIssueUrl)
    .filter((p): p is { repo: string; number: number } => p !== null);

  if (parsed.length === 0) {
    return { status: "ok", items: [] };
  }

  const cache = readCache(cacheKey);
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return { status: "cached", items: cache.items };
  }

  try {
    const results = await Promise.all(
      parsed.map(async ({ repo, number: num }) => {
        const url = `https://api.github.com/repos/${repo}/issues/${num}`;
        const resp = await fetch(url, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (!resp.ok) return null;
        return (await resp.json()) as Record<string, unknown>;
      }),
    );

    const items = results
      .filter((r): r is Record<string, unknown> => r !== null)
      .map((raw) => parseItem(raw, "pinned"));

    writeCache(cacheKey, { etag: "", timestamp: Date.now(), items });
    return { status: "ok", items };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return {
      status: "error",
      items: cache?.items ?? [],
      message: `Could not fetch pinned issues: ${message}`,
    };
  }
}

/** Parse a GitHub/GitLab issue or PR URL into repo + number. Returns null if unparseable. */
function parseIssueUrl(url: string): { repo: string; number: number } | null {
  try {
    const u = new URL(url);
    // Matches: /owner/repo/issues/42 or /owner/repo/pull/42
    const match = u.pathname.match(/^\/([^/]+\/[^/]+)\/(?:issues|pull)\/(\d+)/);
    if (!match) return null;
    return { repo: match[1], number: Number.parseInt(match[2], 10) };
  } catch {
    return null;
  }
}

/** Merge two item arrays, deduplicating by issue number. Labeled items that are also pinned get source "both". */
function mergeItems(labeled: RoadmapItem[], pinned: RoadmapItem[]): RoadmapItem[] {
  const pinnedNumbers = new Set(pinned.map((p) => p.number));
  const result: RoadmapItem[] = [];
  const seen = new Set<number>();

  for (const item of labeled) {
    seen.add(item.number);
    result.push({
      ...item,
      source: pinnedNumbers.has(item.number) ? "pinned" : "labeled",
    });
  }
  for (const item of pinned) {
    if (!seen.has(item.number)) {
      seen.add(item.number);
      result.push(item);
    }
  }
  return result;
}

// ── Sort comparators ──

const SORT_FNS: Record<SortKey, (a: RoadmapItem, b: RoadmapItem) => number> = {
  updated: (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  oldest: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
};

// ── Filter UI sub-components ──

function LabelPill({
  label,
  active,
  onClick,
}: {
  label: GitHubLabel;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.roadmapLabelPill} ${active ? styles.roadmapLabelPillActive : ""}`}
      style={{ "--label-color": `#${label.color}` } as React.CSSProperties}
      onClick={onClick}
      title={`Filter by label: ${label.name}`}
    >
      <span className={styles.roadmapLabelDot} />
      {label.name}
    </button>
  );
}

function AboutRoadmap({ hasPinned }: { hasPinned: boolean }) {
  return (
    <details className={styles.roadmapDetails}>
      <summary className={styles.roadmapDetailsSummary} title="Learn more about this roadmap">
        About this roadmap
      </summary>
      <div className={styles.roadmapDetailsBody}>
        <p>
          This is a live view of the work happening on this project. Every item
          here is a real task being tracked by the team — you can click any card
          to see the full discussion, progress updates, and context.
        </p>
        <p>
          Use the filters above to find what you're looking for. You can narrow
          by type (issues vs pull requests), status (open vs closed),
          {hasPinned ? " source (labeled vs pinned)," : ""} or by label to
          see a specific category.
        </p>
        {hasPinned && (
          <p>
            Items marked <span className={styles.roadmapPinnedBadge}>pinned</span> are
            linked from a feature card in the docs; items
            marked <em>labeled</em> have the "roadmap" label on the repo.
          </p>
        )}
        <details>
          <summary>New to issues and pull requests?</summary>
          <div>
            <p>
              <strong>Issues</strong> are how we track ideas, bugs, and planned
              work. Think of them as to-do items with a conversation attached —
              anyone can comment, ask questions, or share updates.
            </p>
            <p>
              <strong>Pull requests</strong> (PRs) are proposed changes to the
              code. When someone finishes working on an issue, they submit a PR
              so the team can review the changes before they go live.
            </p>
            <p>
              <strong>Open</strong> means work is still in progress or planned.{" "}
              <strong>Closed</strong> means it's done (or was decided against).
            </p>
            <p>
              <strong>Labels</strong> are colored tags that categorize items —
              like "bug", "enhancement", or "documentation". Click a label pill
              above to filter by category.
            </p>
          </div>
        </details>
      </div>
    </details>
  );
}

// ── Main component ──

export default function RoadmapContent({
  repo,
  roadmapLabel = "roadmap",
  pinnedIssues = [],
}: {
  repo: string;
  roadmapLabel?: string;
  /** Issue/PR URLs to always include, even without the roadmap label */
  pinnedIssues?: string[];
}) {
  const labelCacheKey = `sk-roadmap-${repo}`;
  const pinnedCacheKey = `sk-roadmap-pinned-${repo}`;
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ItemType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ItemSource | "all">("all");
  const [labelFilter, setLabelFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("updated");

  const hasPinned = pinnedIssues.length > 0;

  useEffect(() => {
    Promise.all([
      fetchRoadmapItems(repo, roadmapLabel, labelCacheKey),
      fetchPinnedItems(pinnedIssues, pinnedCacheKey),
    ]).then(([labelResult, pinnedResult]) => {
      setItems(mergeItems(labelResult.items, pinnedResult.items));
      const errors: string[] = [];
      if (labelResult.status === "error") errors.push(labelResult.message);
      if (pinnedResult.status === "error") errors.push(pinnedResult.message);
      if (errors.length > 0) setError(errors.join("; "));
      setLoading(false);
    });
  }, [repo, roadmapLabel, labelCacheKey, pinnedCacheKey, pinnedIssues]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem(labelCacheKey);
      localStorage.removeItem(pinnedCacheKey);
    } catch {}
    Promise.all([
      fetchRoadmapItems(repo, roadmapLabel, labelCacheKey),
      fetchPinnedItems(pinnedIssues, pinnedCacheKey),
    ]).then(([labelResult, pinnedResult]) => {
      setItems(mergeItems(labelResult.items, pinnedResult.items));
      const errors: string[] = [];
      if (labelResult.status === "error") errors.push(labelResult.message);
      if (pinnedResult.status === "error") errors.push(pinnedResult.message);
      if (errors.length > 0) setError(errors.join("; "));
      setLoading(false);
    });
  }, [repo, roadmapLabel, labelCacheKey, pinnedCacheKey, pinnedIssues]);

  const allLabels = useMemo(() => {
    const map = new Map<string, GitHubLabel>();
    for (const item of items) {
      for (const label of item.labels) {
        if (!map.has(label.name)) {
          map.set(label.name, label);
        }
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items
      .filter((item) => {
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        if (statusFilter !== "all" && item.status !== statusFilter)
          return false;
        if (sourceFilter !== "all" && item.source !== sourceFilter)
          return false;
        if (labelFilter && !item.labels.some((l) => l.name === labelFilter))
          return false;
        if (
          q &&
          !item.title.toLowerCase().includes(q) &&
          !item.excerpt.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort(SORT_FNS[sort]);
  }, [items, search, typeFilter, statusFilter, sourceFilter, labelFilter, sort]);

  return (
    <div className={styles.roadmap}>
      <div className={styles.roadmapHeader}>
        <h1 className={styles.roadmapTitle}>Roadmap</h1>
        <p className={styles.roadmapSubtitle}>
          What we're working on and what's coming next. Click any item to see
          the full discussion and progress.
        </p>
      </div>

      {error && (
        <div className={styles.roadmapError}>
          <span>{error}</span>
          <button
            className={styles.roadmapRetry}
            onClick={handleRetry}
            title="Clear cache and re-fetch from GitHub"
          >
            Retry
          </button>
        </div>
      )}

      <div className={styles.roadmapFilters}>
        <input
          type="text"
          className={styles.roadmapSearch}
          placeholder="Search roadmap…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          title="Search by title or description"
        />
        <div className={styles.roadmapFilterRow}>
          <div className={styles.roadmapChipGroup}>
            {(["all", "issue", "pr"] as const).map((t) => (
              <button
                key={t}
                className={`${styles.roadmapChip} ${typeFilter === t ? styles.roadmapChipActive : ""}`}
                onClick={() => setTypeFilter(t)}
                title={
                  t === "all"
                    ? "Show issues and pull requests"
                    : t === "issue"
                      ? "Show only issues"
                      : "Show only pull requests"
                }
              >
                {t === "all" ? "All types" : t === "issue" ? "Issues" : "PRs"}
              </button>
            ))}
          </div>

          <div className={styles.roadmapChipGroup}>
            {(["all", "open", "closed"] as const).map((s) => (
              <button
                key={s}
                className={`${styles.roadmapChip} ${statusFilter === s ? styles.roadmapChipActive : ""}`}
                onClick={() => setStatusFilter(s)}
                title={
                  s === "all"
                    ? "Show open and closed items"
                    : s === "open"
                      ? "Show only open items"
                      : "Show only closed items"
                }
              >
                {s === "all"
                  ? "All statuses"
                  : s === "open"
                    ? "Open"
                    : "Closed"}
              </button>
            ))}
          </div>

          {hasPinned && (
            <div className={styles.roadmapChipGroup}>
              {(["all", "labeled", "pinned"] as const).map((src) => (
                <button
                  key={src}
                  className={`${styles.roadmapChip} ${sourceFilter === src ? styles.roadmapChipActive : ""}`}
                  onClick={() => setSourceFilter(src)}
                  title={
                    src === "all"
                      ? "Show items from all sources"
                      : src === "labeled"
                        ? 'Show only items with the "roadmap" label'
                        : "Show only pinned items referenced by number"
                  }
                >
                  {src === "all"
                    ? "All sources"
                    : src === "labeled"
                      ? "Labeled"
                      : "Pinned"}
                </button>
              ))}
            </div>
          )}

          <select
            className={styles.roadmapSort}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            title="Change sort order"
          >
            <option value="updated">Recently updated</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {allLabels.length > 0 && (
          <div className={styles.roadmapLabelBar}>
            <button
              className={`${styles.roadmapLabelPill} ${labelFilter === null ? styles.roadmapLabelPillActive : ""}`}
              onClick={() => setLabelFilter(null)}
              title="Show all labels"
            >
              All labels
            </button>
            {allLabels.map((l) => (
              <LabelPill
                key={l.name}
                label={l}
                active={labelFilter === l.name}
                onClick={() =>
                  setLabelFilter(labelFilter === l.name ? null : l.name)
                }
              />
            ))}
          </div>
        )}
      </div>

      <AboutRoadmap hasPinned={hasPinned} />

      {loading ? (
        <div className={styles.roadmapLoading}>
          <div className={styles.roadmapSpinner} />
          <span>Loading roadmap from GitHub…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.roadmapEmpty}>
          {items.length === 0
            ? 'No roadmap items found. Add a "roadmap" label to issues, or pass issue numbers via pinnedIssues.'
            : "No items match the current filters."}
        </div>
      ) : (
        <>
          <p className={styles.roadmapCount}>
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
            {(search ||
              typeFilter !== "all" ||
              statusFilter !== "all" ||
              sourceFilter !== "all" ||
              labelFilter) &&
              ` (filtered from ${items.length})`}
          </p>
          <div className={styles.roadmapGrid}>
            {filtered.map((item) => (
              <RoadmapEntry key={item.number} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
