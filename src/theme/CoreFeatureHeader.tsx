import type { CoreFeature } from "../types.js";
import TodoList from "./TodoList.js";
import styles from "../css/theme.module.css";

/**
 * Header block for core feature doc pages. Renders the feature's summary
 * and roadmap, creating visual consistency with the index page cards.
 *
 * Usage in MDX:
 *   import CoreFeatureHeader from '@freemocap/skellydocs/theme/CoreFeatureHeader';
 *   <CoreFeatureHeader feature={...} repoUrl="https://github.com/freemocap/skellycam" />
 */
export default function CoreFeatureHeader({
  feature,
  repoUrl,
}: {
  feature: CoreFeature;
  repoUrl: string;
}) {
  return (
    <div className={styles.featureHeader}>
      <div className={styles.featureHeaderSummary}>
        <span className={styles.featureHeaderIcon}>{feature.icon}</span>
        <div className={styles.featureHeaderText}>{feature.summary}</div>
      </div>
      {feature.todos.length > 0 && (
        <TodoList items={feature.todos} repoUrl={repoUrl} />
      )}
    </div>
  );
}
