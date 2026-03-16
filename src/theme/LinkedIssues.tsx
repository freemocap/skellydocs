import { type MouseEvent, useState } from "react";
import styles from "../css/theme.module.css";
import type { LinkedIssue } from "../types.js";

/**
 * Collapsible section that links each item to an issue or PR.
 * Uses divs instead of ul/li to avoid Docusaurus `.markdown` list style conflicts.
 * Stops event propagation so parent Link wrappers don't intercept clicks.
 */
export default function LinkedIssues({
  items,
}: {
  items: LinkedIssue[];
}) {
  const [open, setOpen] = useState(false);

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
          {items.map((t) => (
            <div key={t.url} className={styles.linkedIssueItem}>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedIssueLink}
                onClick={handleItemClick}
              >
                <span className={styles.linkedIssueIcon}>◇</span>
                {t.label}
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
