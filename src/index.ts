// ── Types ──
export type {
  SkellyDocsConfig,
  SkellyPresetOptions,
  HeroConfig,
  CoreFeature,
  TodoItem,
  RoadmapItem,
  GitHubLabel,
  ItemType,
  ItemStatus,
  SortKey,
} from "./types";

// ── Preset and config helpers ──
export { skellyPreset, skellyThemeConfig, defaultLocales } from "./preset";

// ── Theme components (re-exported for use in consuming repos) ──
export { default as Tip } from "./theme/Tip";
export { default as TodoList } from "./theme/TodoList";
export { default as CoreFeatureHeader } from "./theme/CoreFeatureHeader";
export { default as RoadmapEntry } from "./theme/RoadmapEntry";
export { default as RoadmapContent } from "./theme/RoadmapContent";
export { default as IndexPage } from "./theme/IndexPage";
export { default as RoadmapPage } from "./theme/RoadmapPage";
export { default as AiGeneratedBanner } from "./theme/AiGeneratedBanner";
