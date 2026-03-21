import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import styles from "../css/theme.module.css";

/**
 * Inline tooltip for progressive disclosure.
 *
 * Legacy mode (CSS-only): pass `text` prop — hover reveals explanation.
 * Two-stage mode: pass `shortInfo` and optionally `longInfo` —
 *   hover shows short info, click expands to show long info below.
 *   Optional `href` adds a "Learn more" link at the end of the expanded text.
 */
export default function Tip({
  text,
  shortInfo,
  longInfo,
  href,
  children,
}: {
  text?: string;
  shortInfo?: string;
  longInfo?: string;
  href?: string;
  children: ReactNode;
}) {
  // Legacy CSS-only path
  if (text && !shortInfo) {
    return (
      <span className={styles.tip} data-tip={text}>
        {children}
      </span>
    );
  }

  return (
    <ProgressiveTip shortInfo={shortInfo ?? ""} longInfo={longInfo} href={href}>
      {children}
    </ProgressiveTip>
  );
}

function ProgressiveTip({
  shortInfo,
  longInfo,
  href,
  children,
}: {
  shortInfo: string;
  longInfo?: string;
  href?: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
      setExpanded(false);
    }, 150);
  }, [cancelHide]);

  useEffect(() => {
    return () => cancelHide();
  }, [cancelHide]);

  // Close on outside click
  useEffect(() => {
    if (!visible) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        cancelHide();
        setVisible(false);
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [visible, cancelHide]);

  return (
    <span
      ref={wrapperRef}
      className={styles.tipWrapper}
      onMouseEnter={() => {
        cancelHide();
        setVisible(true);
      }}
      onMouseLeave={() => {
        if (!expanded) {
          scheduleHide();
        }
      }}
    >
      {children}
      {visible && (
        <div
          className={`${styles.tipTooltip} ${expanded ? styles.tipTooltipExpanded : ""}`}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={cancelHide}
          onMouseLeave={() => {
            if (!expanded) {
              scheduleHide();
            }
          }}
        >
          <p className={styles.tipText}>{shortInfo}</p>
          {longInfo && !expanded && (
            <button
              className={styles.tipToggle}
              onClick={() => setExpanded(true)}
            >
              Click to learn more
            </button>
          )}
          {expanded && longInfo && (
            <p className={styles.tipLongText}>
              {longInfo}
              {href && (
                <>
                  {" "}
                  <a
                    href={href}
                    className={styles.tipLearnMoreLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more →
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </span>
  );
}
