import type { CoreFeature } from "../types.js";
import LinkedIssues from "./LinkedIssues.js";
import styles from "../css/theme.module.css";

/**
 * Header block for core feature doc pages. Renders the feature's summary
 * and linked issues, creating visual consistency with the index page cards.
 *
 * Usage in MDX:
 *   import CoreFeatureHeader from '@freemocap/skellydocs/theme/CoreFeatureHeader';
 *   <CoreFeatureHeader feature={...} />
 */
export default function CoreFeatureHeader({
  feature,
}: {
  feature: CoreFeature;
}) {
  return (
    <div className={styles.featureHeader}>
      <div className={styles.featureHeaderSummary}>
        <span className={styles.featureHeaderIcon}>{feature.icon}</span>
        <div className={styles.featureHeaderText}>{feature.summary}</div>
      </div>
      {feature.issues?.length > 0 && (
        <LinkedIssues items={feature.issues} />
      )}
    </div>
  );
}
