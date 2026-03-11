import type { ReactNode } from "react";

// ── Roadmap types ──

export type ItemType = "issue" | "pr";
export type ItemStatus = "open" | "closed";

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
  labels: GitHubLabel[];
  updatedAt: string;
  createdAt: string;
  url: string;
};

export type SortKey = "updated" | "newest" | "oldest";

// ── Todo item (used by TodoList and feature cards) ──

export type TodoItem = {
  label: string;
  issueNum: number;
};

// ── Core feature (used by index page cards and doc headers) ──

export type CoreFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
  summary: ReactNode;
  todos: TodoItem[];
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
  guaranteeTodos: TodoItem[];
};

// ── Preset options ──

export type SkellyPresetOptions = {
  repo: string;
};
