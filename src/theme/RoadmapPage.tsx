import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import RoadmapContent from "./RoadmapContent";
import styles from "../css/theme.module.css";

/**
 * Full roadmap page component. Consumed by each repo's `src/pages/roadmap.tsx`
 * as a one-liner wrapper.
 */
export default function RoadmapPage({
  repo,
  roadmapLabel = "roadmap",
  title = "Roadmap",
}: {
  repo: string;
  roadmapLabel?: string;
  title?: string;
}): ReactNode {
  return (
    <Layout
      title={title}
      description={`${title} — what we're working on and what's next`}
    >
      <main className={styles.main}>
        <RoadmapContent repo={repo} roadmapLabel={roadmapLabel} />
      </main>
    </Layout>
  );
}
