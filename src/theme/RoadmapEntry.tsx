import type React from "react";
import type { RoadmapItem } from "../types.js";
import styles from "../css/theme.module.css";

function TypeIcon({ type }: { type: RoadmapItem["type"] }) {
  if (type === "pr") {
    return (
      <span className={styles.roadmapTypeBadgePr} title="Pull Request">
        PR
      </span>
    );
  }
  return (
    <span className={styles.roadmapTypeBadgeIssue} title="Issue">
      Issue
    </span>
  );
}

function StatusBadge({ status }: { status: RoadmapItem["status"] }) {
  const cls =
    status === "open" ? styles.roadmapStatusOpen : styles.roadmapStatusClosed;
  return (
    <span
      className={cls}
      title={status === "open" ? "This item is still open" : "This item has been closed"}
    >
      {status === "open" ? "● Open" : "✓ Closed"}
    </span>
  );
}

/**
 * A single roadmap entry card. Shows type badge, status, issue number,
 * last-updated date, title, body excerpt, labels, and a link to GitHub.
 */
export default function RoadmapEntry({ item }: { item: RoadmapItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.roadmapCard}
      title={`${item.type === "pr" ? "PR" : "Issue"} #${item.number}: ${item.title}`}
    >
      <div className={styles.roadmapCardHeader}>
        <TypeIcon type={item.type} />
        <StatusBadge status={item.status} />
        {item.source === "pinned" && (
          <span
            className={styles.roadmapPinnedBadge}
            title="This item is pinned — it was explicitly referenced by number in the site config"
          >
            pinned
          </span>
        )}
        <span className={styles.roadmapCardNumber} title={`Issue number ${item.number}`}>
          #{item.number}
        </span>
        <span
          className={styles.roadmapCardDate}
          title={`Last updated: ${new Date(item.updatedAt).toLocaleString()}`}
        >
          {new Date(item.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <h3 className={styles.roadmapCardTitle}>{item.title}</h3>
      {item.excerpt && (
        <p className={styles.roadmapCardExcerpt}>{item.excerpt}</p>
      )}
      {item.labels.length > 0 && (
        <div className={styles.roadmapCardLabels}>
          {item.labels.map((l) => (
            <span
              key={l.name}
              className={styles.roadmapCardLabel}
              style={
                { "--label-color": `#${l.color}` } as React.CSSProperties
              }
              title={`Label: ${l.name}`}
            >
              {l.name}
            </span>
          ))}
        </div>
      )}
      <span className={styles.roadmapCardArrow}>View on GitHub →</span>
    </a>
  );
}
