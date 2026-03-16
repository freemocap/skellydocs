import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import LinkedIssues from "./LinkedIssues.js";
import styles from "../css/theme.module.css";
import type { SkellyDocsConfig } from "../types.js";

function HeroSection({
  config,
}: {
  config: SkellyDocsConfig;
}) {
  const { hero } = config;
  const logoUrl = useBaseUrl(hero.logoSrc);
  return (
    <div className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroContent}>
        <img
          src={logoUrl}
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
          <Link className={styles.ctaPrimary} to="/docs/intro">
            Get Started
          </Link>
          <Link className={styles.ctaSecondary} to="/docs/intro">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection({
  config,
}: {
  config: SkellyDocsConfig;
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
            {f.issues?.length > 0 && (
              <LinkedIssues items={f.issues} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GuaranteesSection({
  config,
}: {
  config: SkellyDocsConfig;
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
      {config.guaranteeIssues.length > 0 && (
        <div className={styles.guaranteesRoadmap}>
          <LinkedIssues items={config.guaranteeIssues} />
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
}: {
  config: SkellyDocsConfig;
}): ReactNode {
  return (
    <Layout
      title="Home"
      description={config.hero.tagline}
    >
      <main className={styles.main}>
        <HeroSection config={config} />
        <FeaturesSection config={config} />
        <GuaranteesSection config={config} />
      </main>
    </Layout>
  );
}
