import type { ReactNode } from "react";

// ── Roadmap types ──

export type ItemType = "issue" | "pr";
export type ItemStatus = "open" | "closed";
export type ItemSource = "labeled" | "pinned";

export type GitHubLabel = {
  name: string;
  color: string;
};

export type RoadmapItem = {
  number: number;
  title: string;
  excerpt: string;
  type: ItemType;
  status: ItemStatus;
  source: ItemSource;
  labels: GitHubLabel[];
  updatedAt: string;
  createdAt: string;
  url: string;
};

export type SortKey = "updated" | "newest" | "oldest";

// ── AI-generated banner ──

export type GenerationType =
  | "ai-generated"
  | "ai-human-curated"
  | "human-sourced-ai"
  | "human-generated";

// ── Linked issue (used by LinkedIssues component and feature cards) ──

export type LinkedIssue = {
  label: string;
  url: string;
  status?: ItemStatus;
  type?: ItemType;
  labels?: GitHubLabel[];
};

// ── Core feature (used by index page cards and doc headers) ──

export type CoreFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
  summary: ReactNode;
  issues: LinkedIssue[];
  docPath: string;
};

// ── Content config (provided by each consuming repo) ──

export type HeroConfig = {
  title: string;
  accentedSuffix: string;
  subtitle: string;
  tagline: string;
  logoSrc: string;
  parentProject: {
    name: string;
    url: string;
  };
};

export type SkellyDocsConfig = {
  hero: HeroConfig;
  features: CoreFeature[];
  guarantees: string[];
  guaranteeIssues: LinkedIssue[];
};
