import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import RoadmapContent from "./RoadmapContent.js";
import styles from "../css/theme.module.css";

/**
 * Full roadmap page component. Consumed by each repo's `src/pages/roadmap.tsx`
 * as a one-liner wrapper.
 */
export default function RoadmapPage({
  repo,
  roadmapLabel = "roadmap",
  pinnedIssues = [],
  title = "Roadmap",
  projectBoardUrl,
}: {
  repo: string;
  roadmapLabel?: string;
  /** Issue/PR URLs to always include, even without the roadmap label */
  pinnedIssues?: string[];
  title?: string;
  /** URL to an external project board (GitHub Projects, Linear, etc.) */
  projectBoardUrl?: string;
}): ReactNode {
  return (
    <Layout
      title={title}
      description={`${title} — what we're working on and what's next`}
    >
      <main className={styles.main}>
        <RoadmapContent repo={repo} roadmapLabel={roadmapLabel} pinnedIssues={pinnedIssues} projectBoardUrl={projectBoardUrl} />
      </main>
    </Layout>
  );
}
