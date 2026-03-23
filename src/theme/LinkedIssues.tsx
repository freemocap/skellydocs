import type React from "react";
import { type MouseEvent, useState, useEffect } from "react";
import styles from "../css/theme.module.css";
import type { LinkedIssue, GitHubLabel } from "../types.js";
import { fetchIssueMetadata } from "./githubUtils.js";

type EnrichedIssue = LinkedIssue & {
  status?: "open" | "closed";
  type?: "issue" | "pr";
  labels?: GitHubLabel[];
};

/**
 * Collapsible section that links each item to an issue or PR.
 * Fetches metadata from GitHub API to show type, status, and label badges.
 * Falls back to simple display if fetch fails.
 *
 * @param defaultOpen - Start the section expanded (default: false)
 */
export default function LinkedIssues({
  items,
  defaultOpen = false,
}: {
  items: LinkedIssue[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [enriched, setEnriched] = useState<EnrichedIssue[]>(items);

  // Fetch metadata for items that don't already have it
  useEffect(() => {
    if (!open) return;

    const toFetch = items.filter((item) => !item.status && item.url.includes("github.com"));
    if (toFetch.length === 0) return;

    // Check localStorage cache first
    const cacheKey = `sk-linked-${toFetch.map((i) => i.url).join(",")}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as { timestamp: number; data: Record<string, EnrichedIssue> };
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setEnriched(
            items.map((item) => parsed.data[item.url] ?? item),
          );
          return;
        }
      }
    } catch {
      // cache miss
    }

    Promise.all(
      toFetch.map(async (item) => {
        const meta = await fetchIssueMetadata(item.url);
        if (!meta) return item;
        return { ...item, ...meta };
      }),
    ).then((results) => {
      const dataMap: Record<string, EnrichedIssue> = {};
      for (const r of results) {
        dataMap[r.url] = r;
      }
      const merged = items.map((item) => dataMap[item.url] ?? item);
      setEnriched(merged);

      // Cache results
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: dataMap }),
        );
      } catch {
        // storage full
      }
    });
  }, [open, items]);

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen((v) => !v);
  };

  const handleItemClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={styles.linkedIssueSection}
      onClick={(e: MouseEvent) => e.stopPropagation()}
    >
      <button
        className={styles.linkedIssueToggle}
        onClick={handleToggle}
        aria-expanded={open}
      >
        <span className={styles.linkedIssueChevron} data-open={open}>
          ▸
        </span>
        <span className={styles.linkedIssueLabel}>Linked Issues</span>
        <span className={styles.linkedIssueBadge}>{items.length}</span>
      </button>
      {open && (
        <div className={styles.linkedIssueItems}>
          {enriched.map((t) => (
            <div key={t.url} className={styles.linkedIssueItem}>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedIssueLink}
                onClick={handleItemClick}
              >
                <span className={styles.linkedIssueMeta}>
                  {t.type && (
                    <span
                      className={
                        t.type === "pr"
                          ? styles.roadmapTypeBadgePr
                          : styles.roadmapTypeBadgeIssue
                      }
                    >
                      {t.type === "pr" ? "PR" : "Issue"}
                    </span>
                  )}
                  {t.status && (
                    <span
                      className={
                        t.status === "open"
                          ? styles.roadmapStatusOpen
                          : styles.roadmapStatusClosed
                      }
                    >
                      {t.status === "open" ? "●" : "✓"}
                    </span>
                  )}
                </span>
                <span className={styles.linkedIssueIcon}>◇</span>
                {t.label}
                {t.labels && t.labels.length > 0 && (
                  <span className={styles.linkedIssueLabelChips}>
                    {t.labels.map((l) => (
                      <span
                        key={l.name}
                        className={styles.roadmapCardLabel}
                        style={
                          {
                            "--label-color": `#${l.color}`,
                          } as React.CSSProperties
                        }
                      >
                        {l.name}
                      </span>
                    ))}
                  </span>
                )}
                <span className={styles.linkedIssueArrow}>↗</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { LinkedIssue };
