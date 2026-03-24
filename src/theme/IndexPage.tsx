import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import LinkedIssues from "./LinkedIssues.js";
import styles from "../css/theme.module.css";
import type { CtaButton, SkellyDocsConfig } from "../types.js";

export function HeroSection({
  config,
}: {
  config: SkellyDocsConfig;
}) {
  const { hero } = config;
  const logoUrl = useBaseUrl(hero.logoSrc);
  const buttons: CtaButton[] = hero.ctaButtons ?? [
    { label: "Get Started", to: "/docs/intro", variant: "primary" },
    { label: "Learn More", to: "/docs/intro", variant: "secondary" },
  ];
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
          {buttons.map((btn, i) => {
            const variant = btn.variant ?? (i === 0 ? "primary" : "secondary");
            return (
              <Link
                key={i}
                className={variant === "primary" ? styles.ctaPrimary : styles.ctaSecondary}
                to={btn.to}
              >
                {btn.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection({
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

export function GuaranteesSection({
  config,
}: {
  config: SkellyDocsConfig;
}) {
  const gConfig = config.guaranteesConfig;
  const title = gConfig?.title ?? (
    <>
      {config.hero.title} is carefully designed to{" "}
      <span className={styles.accent}>guarantee</span>:
    </>
  );
  const items = gConfig?.items ?? config.guarantees;
  const issues = gConfig?.issues ?? config.guaranteeIssues;

  return (
    <div className={styles.guarantees}>
      <h2 className={styles.guaranteesTitle}>
        {title}
      </h2>
      <div className={styles.guaranteesGrid}>
        {items.map((g, i) => (
          <div key={i} className={styles.guaranteeItem}>
            <span className={styles.guaranteeCheck}>✓</span>
            <span dangerouslySetInnerHTML={{ __html: g }} />
          </div>
        ))}
      </div>
      {issues.length > 0 && (
        <div className={styles.guaranteesRoadmap}>
          <LinkedIssues items={issues} />
        </div>
      )}
    </div>
  );
}

/**
 * Full landing page component. Consumed by each repo's `src/pages/index.tsx`.
 *
 * Three levels of customization:
 * 1. Config fields: ctaButtons, guaranteesConfig, hideSections
 * 2. Children: pass children to replace the default section layout
 * 3. Compose from parts: import HeroSection, FeaturesSection, GuaranteesSection directly
 */
export default function IndexPage({
  config,
  children,
}: {
  config: SkellyDocsConfig;
  children?: ReactNode;
}): ReactNode {
  const hidden = new Set(config.hideSections ?? []);
  return (
    <Layout
      title="Home"
      description={config.hero.tagline}
    >
      <main className={styles.main}>
        {children ?? (
          <>
            {!hidden.has("hero") && <HeroSection config={config} />}
            {!hidden.has("features") && <FeaturesSection config={config} />}
            {!hidden.has("guarantees") && <GuaranteesSection config={config} />}
          </>
        )}
      </main>
    </Layout>
  );
}
