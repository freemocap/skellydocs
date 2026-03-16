import type { SkellyDocsConfig } from "../types.js";

/** Extract all unique issue/PR URLs from a content config. */
export function collectLinkedUrls(config: SkellyDocsConfig): string[] {
  const urls = new Set<string>();
  for (const f of config.features) {
    for (const issue of f.issues) {
      if (issue.url) urls.add(issue.url);
    }
  }
  for (const issue of config.guaranteeIssues) {
    if (issue.url) urls.add(issue.url);
  }
  return Array.from(urls);
}
