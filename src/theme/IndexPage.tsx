import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import TodoList from "./TodoList";
import styles from "../css/theme.module.css";
import type { SkellyDocsConfig } from "../types";

function HeroSection({
  config,
}: {
  config: SkellyDocsConfig;
}) {
  const { hero } = config;
  return (
    <div className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroContent}>
        <img
          src={hero.logoSrc}
          alt={hero.title}
          className={styles.heroLogo}
        />
        <h1 className={styles.heroTitle}>
          {hero.title.replace(hero.accentedSuffix, "")}
          <span className={styles.accent}>{hero.accentedSuffix}</span>
        </h1>
        <p className={styles.heroSubtitle}>
          {hero.subtitle.includes(hero.parentProject.name) ? (
            <>
              {hero.subtitle.split(hero.parentProject.name)[0]}
              <a href={hero.parentProject.url} className={styles.heroLink}>
                {hero.parentProject.name}
              </a>
              {hero.subtitle.split(hero.parentProject.name)[1]}
            </>
          ) : (
            hero.subtitle
          )}
        </p>
        <p className={styles.heroTagline}>{hero.tagline}</p>
        <div className={styles.heroCtas}>
          <Link className={styles.ctaPrimary} to="/docs/">
            Get Started
          </Link>
          <Link className={styles.ctaSecondary} to="/docs/">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection({
  config,
  repoUrl,
}: {
  config: SkellyDocsConfig;
  repoUrl: string;
}) {
  return (
    <div className={styles.features}>
      <div className={styles.featuresGrid}>
        {config.features.map((f) => (
          <div key={f.id} className={styles.featureCard}>
            <Link to={`/docs/${f.docPath}`} className={styles.featureCardLink}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <div className={styles.featureDescription}>{f.summary}</div>
            </Link>
            {f.todos.length > 0 && (
              <TodoList items={f.todos} repoUrl={repoUrl} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GuaranteesSection({
  config,
  repoUrl,
}: {
  config: SkellyDocsConfig;
  repoUrl: string;
}) {
  return (
    <div className={styles.guarantees}>
      <h2 className={styles.guaranteesTitle}>
        {config.hero.title} is carefully designed to{" "}
        <span className={styles.accent}>guarantee</span>:
      </h2>
      <div className={styles.guaranteesGrid}>
        {config.guarantees.map((g, i) => (
          <div key={i} className={styles.guaranteeItem}>
            <span className={styles.guaranteeCheck}>✓</span>
            <span dangerouslySetInnerHTML={{ __html: g }} />
          </div>
        ))}
      </div>
      {config.guaranteeTodos.length > 0 && (
        <div className={styles.guaranteesRoadmap}>
          <TodoList items={config.guaranteeTodos} repoUrl={repoUrl} />
        </div>
      )}
    </div>
  );
}

/**
 * Full landing page component. Consumed by each repo's `src/pages/index.tsx`
 * as a one-liner wrapper.
 */
export default function IndexPage({
  config,
  repo,
}: {
  config: SkellyDocsConfig;
  repo: string;
}): ReactNode {
  const repoUrl = `https://github.com/${repo}`;
  return (
    <Layout
      title="Home"
      description={config.hero.tagline}
    >
      <main className={styles.main}>
        <HeroSection config={config} />
        <FeaturesSection config={config} repoUrl={repoUrl} />
        <GuaranteesSection config={config} repoUrl={repoUrl} />
      </main>
    </Layout>
  );
}
